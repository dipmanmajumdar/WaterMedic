// Global variables for application state
let dailyTargetMl = 0;
let currentIntakeMl = 0;
let weightUnit = 'kg'; // 'kg' or 'lb'
let lastResetDate = ''; // YYYY-MM-DD
let hydrationHistory = []; // [{ date: 'YYYY-MM-DD', intake: 2000 }]
let reminderIntervalId = null; // Stores the setInterval ID for reminders
const GLASS_SIZE_ML = 250; // Default glass size

// DOM Elements
const calculatorForm = document.getElementById('calculatorForm');
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const unitKgBtn = document.getElementById('unitKg');
const unitLbBtn = document.getElementById('unitLb');
const activityLevelSelect = document.getElementById('activityLevel');
const weatherHotCheckbox = document.getElementById('weatherHot');
const dailyTargetDisplay = document.getElementById('dailyTargetDisplay');
const targetMlSpan = document.getElementById('targetMl');
const targetGlassesSpan = document.getElementById('targetGlasses');

const currentIntakeDisplay = document.getElementById('currentIntakeDisplay');
const plusBtn = document.getElementById('plusBtn');
const minusBtn = document.getElementById('minusBtn');
const progressBarFill = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const wavePath = document.getElementById('wavePath');
const glassesConsumedSpan = document.getElementById('glassesConsumed');
const glassesTargetSpan = document.getElementById('glassesTarget');
const dropletContainer = document.getElementById('dropletContainer');

const reminderIntervalSelect = document.getElementById('reminderInterval');
const setReminderBtn = document.getElementById('setReminderBtn');
const toastContainer = document.getElementById('toastContainer');

const graphWeekBtn = document.getElementById('graphWeekBtn');
const graphMonthBtn = document.getElementById('graphMonthBtn');
const graphYearBtn = document.getElementById('graphYearBtn');
const waterIntakeGraphSvg = document.getElementById('waterIntakeGraph');

/**
 * Saves the current application state to localStorage.
 */
function saveState() {
    try {
        localStorage.setItem('waterMedicState', JSON.stringify({
            dailyTargetMl,
            currentIntakeMl,
            weightUnit,
            lastResetDate,
            hydrationHistory,
            reminderInterval: reminderIntervalSelect.value,
            calculatorInputs: {
                age: ageInput.value,
                weight: weightInput.value,
                activityLevel: activityLevelSelect.value,
                weatherHot: weatherHotCheckbox.checked
            }
        }));
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
        showCustomToast("Error saving data. Please check your browser's storage settings.");
    }
}

/**
 * Loads the application state from localStorage.
 */
function loadState() {
    try {
        const savedState = JSON.parse(localStorage.getItem('waterMedicState'));
        if (savedState) {
            dailyTargetMl = savedState.dailyTargetMl || 0;
            currentIntakeMl = savedState.currentIntakeMl || 0;
            weightUnit = savedState.weightUnit || 'kg';
            lastResetDate = savedState.lastResetDate || '';
            hydrationHistory = savedState.hydrationHistory || [];

            // Restore calculator inputs
            if (savedState.calculatorInputs) {
                ageInput.value = savedState.calculatorInputs.age || 30;
                weightInput.value = savedState.calculatorInputs.weight || 70;
                activityLevelSelect.value = savedState.calculatorInputs.activityLevel || 'moderate';
                weatherHotCheckbox.checked = savedState.calculatorInputs.weatherHot || false;
            }

            // Restore reminder interval
            reminderIntervalSelect.value = savedState.reminderInterval || '0';

            // Update unit button styles
            if (weightUnit === 'kg') {
                unitKgBtn.classList.add('bg-blue-300');
                unitLbBtn.classList.remove('bg-blue-300');
            } else {
                unitLbBtn.classList.add('bg-blue-300');
                unitKgBtn.classList.remove('bg-blue-300');
            }
        }
    } catch (e) {
        console.error("Error loading state from localStorage:", e);
        showCustomToast("Error loading saved data. Starting fresh.");
        // Clear corrupted data if parsing fails
        localStorage.removeItem('waterMedicState');
    }
}

/**
 * Displays a custom toast notification.
 * @param {string} message - The message to display.
 */
function showCustomToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Remove the toast after animation completes
    setTimeout(() => {
        toast.remove();
    }, 3000); // 3 seconds (0.5s slideIn + 2.5s display + 0.5s fadeOut)
}

/**
 * Requests notification permission from the user.
 */
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        showCustomToast("Notifications are not supported by your browser.");
        return;
    }

    if (Notification.permission === "granted") {
        console.log("Notification permission already granted.");
        return;
    }

    if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showCustomToast("Notification permission granted! You'll receive hydration reminders.");
            } else {
                showCustomToast("Notification permission denied. Reminders will not be sent.");
                reminderIntervalSelect.value = '0'; // Turn off reminders if denied
                saveState();
            }
        }).catch(error => {
            console.error("Error requesting notification permission:", error);
            showCustomToast("Error requesting notification permission.");
        });
    }
}

/**
 * Schedules hydration notifications based on the selected interval.
 */
function scheduleNotification() {
    // Clear any existing interval
    if (reminderIntervalId) {
        clearInterval(reminderIntervalId);
        reminderIntervalId = null;
    }

    const intervalHours = parseInt(reminderIntervalSelect.value);

    if (intervalHours > 0) {
        if (Notification.permission !== "granted") {
            showCustomToast("Please grant notification permission to enable reminders.");
            requestNotificationPermission(); // Re-request if not granted
            return;
        }

        showCustomToast(`Hydration reminders set for every ${intervalHours} hour(s).`);

        // Set up the new interval
        reminderIntervalId = setInterval(() => {
            new Notification("💧 WaterMedic Reminder", {
                body: `Time to drink some water! You've consumed ${currentIntakeMl}ml out of your ${dailyTargetMl}ml target.`,
                icon: 'https://placehold.co/64x64/4facfe/ffffff?text=💧' // Placeholder droplet icon
            });
        }, intervalHours * 60 * 60 * 1000); // Convert hours to milliseconds
    } else {
        showCustomToast("Hydration reminders turned off.");
    }
    saveState(); // Save the chosen interval
}

/**
 * Calculates the daily water intake target based on user inputs.
 */
function calculateWaterIntake() {
    const age = parseInt(ageInput.value);
    let weight = parseFloat(weightInput.value);
    const activityLevel = activityLevelSelect.value;
    const weatherHot = weatherHotCheckbox.checked;

    if (isNaN(age) || age <= 0 || isNaN(weight) || weight <= 0) {
        showCustomToast("Please enter valid age and weight.");
        return;
    }

    // Convert weight to kg if unit is lb
    if (weightUnit === 'lb') {
        weight *= 0.453592; // 1 lb = 0.453592 kg
    }

    let calculatedTarget = weight * 35; // Base calculation

    // Activity adjustment
    if (activityLevel === 'moderate') {
        calculatedTarget *= 1.10; // +10%
    } else if (activityLevel === 'high') {
        calculatedTarget *= 1.20; // +20%
    }

    // Weather hot adjustment
    if (weatherHot) {
        calculatedTarget *= 1.15; // +15%
    }

    dailyTargetMl = Math.round(calculatedTarget);
    updateTrackerUI();
    saveState();
    showCustomToast(`Daily target updated to ${dailyTargetMl}ml.`);
}

/**
 * Updates the current water intake and refreshes the UI.
 * @param {number} amount - The amount of water (in ml) to add or subtract.
 */
function updateIntake(amount) {
    currentIntakeMl += amount;
    if (currentIntakeMl < 0) {
        currentIntakeMl = 0;
    }
    updateTrackerUI();
    saveState();
}

/**
 * Renders the progress bar and droplet icons based on current intake.
 */
function updateTrackerUI() {
    currentIntakeDisplay.textContent = currentIntakeMl;
    targetMlSpan.textContent = dailyTargetMl;

    const percentage = dailyTargetMl > 0 ? (currentIntakeMl / dailyTargetMl) * 100 : 0;
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    progressBarFill.style.width = `${clampedPercentage}%`;
    progressText.textContent = `${Math.round(clampedPercentage)}%`;

    // Animate wave path (simple up/down based on percentage)
    const waveHeight = 100 - clampedPercentage; // 100% fill means wave at 0, 0% fill means wave at 100
    wavePath.setAttribute('d', `M0,${waveHeight} C25,${waveHeight - 25} 50,${waveHeight} 75,${waveHeight - 25} 100,${waveHeight} V100 H0 Z`);

    const glassesConsumed = Math.floor(currentIntakeMl / GLASS_SIZE_ML);
    const glassesTarget = Math.ceil(dailyTargetMl / GLASS_SIZE_ML);
    glassesConsumedSpan.textContent = glassesConsumed;
    glassesTargetSpan.textContent = glassesTarget;

    renderDroplets(glassesTarget, glassesConsumed);
}

/**
 * Renders water droplet icons based on target and consumed glasses.
 * @param {number} target - Total target glasses.
 * @param {number} consumed - Glasses consumed.
 */
function renderDroplets(target, consumed) {
    dropletContainer.innerHTML = ''; // Clear existing droplets
    for (let i = 0; i < target; i++) {
        const isFilled = i < consumed;
        const dropletSvg = `
            <svg class="droplet-icon ${isFilled ? 'filled' : ''}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17c-3.87 0-7-3.13-7-7 0-2.45 1.28-4.63 3.22-5.89L12 3l3.78 3.11C19.72 7.37 21 9.55 21 12c0 3.87-3.13 7-7 7zM12 5.3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                <path d="M12 6.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" fill="${isFilled ? 'url(#waterGradient)' : '#bbdefb'}"/>
            </svg>
        `;
        dropletContainer.innerHTML += dropletSvg;
    }
}

/**
 * Checks if a new day has started and performs daily reset if necessary.
 */
function checkDailyReset() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (lastResetDate !== today) {
        // Save today's intake to history before resetting
        if (currentIntakeMl > 0 || dailyTargetMl > 0) { // Only save if there was activity
            // Find if an entry for today already exists
            const existingEntryIndex = hydrationHistory.findIndex(entry => entry.date === lastResetDate);
            if (existingEntryIndex !== -1) {
                hydrationHistory[existingEntryIndex].intake = currentIntakeMl;
            } else if (lastResetDate) {
                hydrationHistory.push({ date: lastResetDate, intake: currentIntakeMl });
            }
        }

        currentIntakeMl = 0;
        lastResetDate = today;
        showCustomToast("Daily water intake reset for the new day!");
        saveState();
        renderGraph('week');
    }
}

/**
 * Renders the water intake history graph using D3.js.
 * @param {string} period - 'week', 'month', or 'year' to filter history.
 */
function renderGraph(period = 'week') {
    const now = new Date();
    let filteredData = [];

    // Filter data based on the selected period
    if (period === 'week') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        filteredData = hydrationHistory.filter(d => new Date(d.date) >= sevenDaysAgo);
    } else if (period === 'month') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 29);
        filteredData = hydrationHistory.filter(d => new Date(d.date) >= thirtyDaysAgo);
    } else if (period === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filteredData = hydrationHistory.filter(d => new Date(d.date) >= oneYearAgo);
    }

    // Ensure data is sorted by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate all dates within the period
    const allDates = new Set();
    const startDate = new Date(now);
    if (period === 'week') startDate.setDate(now.getDate() - 6);
    else if (period === 'month') startDate.setDate(now.getDate() - 29);
    else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
        allDates.add(d.toISOString().slice(0, 10));
    }

    const fullData = Array.from(allDates).map(date => {
        const existing = filteredData.find(d => d.date === date);
        return { date: new Date(date), intake: existing ? existing.intake : 0 };
    }).sort((a, b) => a.date - b.date);

    const svg = d3.select(waterIntakeGraphSvg);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(fullData, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(fullData, d => d.intake) * 1.2 || dailyTargetMl * 1.2 || 3000])
        .range([height, 0]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .ticks(period === 'week' ? d3.timeDay.every(1) : d3.timeWeek.every(1))
            .tickFormat(d3.timeFormat(period === 'week' ? "%b %d" : "%b '%y")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Intake (ml)");

    g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .ticks(period === 'week' ? d3.timeDay.every(1) : d3.timeWeek.every(1))
            .tickSize(-height)
            .tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-opacity", 0.7);

    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-opacity", 0.7);

    g.selectAll(".dot")
        .data(fullData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.intake))
        .attr("r", 5)
        .attr("fill", d => d.intake >= dailyTargetMl ? "#28a745" : "#1a73e8")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 8).attr("fill", "#ffc107");
            g.append("text")
                .attr("class", "tooltip-text")
                .attr("x", x(d.date) + 10)
                .attr("y", y(d.intake) - 10)
                .text(`${d3.timeFormat("%b %d")(d.date)}: ${d.intake}ml`)
                .attr("font-size", "12px")
                .attr("fill", "#333");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("r", 5).attr("fill", d => d.intake >= dailyTargetMl ? "#28a745" : "#1a73e8");
            g.selectAll(".tooltip-text").remove();
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 50)
        .attr("cy", d => y(d.intake));
}

/**
 * Initializes the application: loads state, performs daily reset, sets up UI.
 */
function initApp() {
    loadState();
    checkDailyReset();
    calculateWaterIntake();
    updateTrackerUI();
    scheduleNotification();
    renderGraph('week');

    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateWaterIntake();
    });

    ageInput.addEventListener('input', calculateWaterIntake);
    weightInput.addEventListener('input', calculateWaterIntake);
    activityLevelSelect.addEventListener('change', calculateWaterIntake);
    weatherHotCheckbox.addEventListener('change', calculateWaterIntake);

    unitKgBtn.addEventListener('click', () => {
        weightUnit = 'kg';
        unitKgBtn.classList.add('bg-blue-300');
        unitLbBtn.classList.remove('bg-blue-300');
        calculateWaterIntake();
    });

    unitLbBtn.addEventListener('click', () => {
        weightUnit = 'lb';
        unitLbBtn.classList.add('bg-blue-300');
        unitKgBtn.classList.remove('bg-blue-300');
        calculateWaterIntake();
    });

    plusBtn.addEventListener('click', () => updateIntake(GLASS_SIZE_ML));
    minusBtn.addEventListener('click', () => updateIntake(-GLASS_SIZE_ML));

    setReminderBtn.addEventListener('click', scheduleNotification);
    reminderIntervalSelect.addEventListener('change', scheduleNotification);

    graphWeekBtn.addEventListener('click', () => renderGraph('week'));
    graphMonthBtn.addEventListener('click', () => renderGraph('month'));
    graphYearBtn.addEventListener('click', () => renderGraph('year'));

    requestNotificationPermission();
}

document.addEventListener('DOMContentLoaded', initApp);

setInterval(checkDailyReset, 60 * 60 * 1000);
