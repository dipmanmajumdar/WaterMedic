# WaterMedic - Hydration Tracker

WaterMedic is a web-based application designed to help users track and manage their daily water intake. Featuring a modern, neumorphic design with a soothing blue color palette, it offers an intuitive interface to calculate personalized hydration goals, monitor daily water consumption, set reminders, and visualize hydration history over time. Built with HTML, CSS, and JavaScript, it leverages Tailwind CSS for styling and D3.js for interactive data visualization.
Table of Contents

## Table of content:
- Technologies Used
- Setup Instructions
- Usage
- File Structure
- Screenshots
- Contributing
- License
- Credits
- Contact

## Features

### Personalized Water Intake Calculator:

Calculate daily water intake based on age, weight, activity level, and weather conditions.
Supports weight input in kilograms or pounds.
Adjusts targets for moderate (+10%) or high (+20%) activity levels and hot weather (+15%).


### Interactive Daily Tracker:

Track water intake with a dynamic progress bar featuring a water-like wave animation.
Visual droplet icons represent glasses of water (250ml each) consumed versus the target.
Add or subtract water in 250ml increments using intuitive "+" and "−" buttons.


### Hydration Reminders:

Set browser notifications for reminders every 1, 2, or 3 hours.
Notifications display current intake and daily target.
Requires browser notification permission.


### Water Intake History Graph:

Visualize water intake over the last 7 days, 30 days, or 365 days using an interactive D3.js graph.
Hover over data points to view exact intake amounts.
Green dots indicate days meeting or exceeding the target; blue dots indicate otherwise.


### Responsive Design:

Optimized for desktop and mobile devices with a clean, modern UI.
Uses Tailwind CSS for responsive layouts and a neumorphic design for a sleek, glass-like aesthetic.


### Data Persistence:

Saves user inputs, current intake, and hydration history to localStorage for persistence across sessions.
Automatically resets daily intake at midnight, saving the previous day’s data to history.



## Technologies Used

- HTML5: Core structure of the web application.
- CSS3: Custom styling with Tailwind CSS and neumorphic design principles.
- JavaScript: Application logic, DOM manipulation, and state management.
- D3.js: Interactive data visualization for the hydration history graph.
- Tailwind CSS: Utility-first CSS framework for rapid and responsive styling.
- Inter Font: Modern typography via Google Fonts.
- LocalStorage: Browser-based storage for persisting user data.

## Setup Instructions
To run WaterMedic locally or deploy it, follow these steps:

### Prerequisites

A modern web browser (e.g., Chrome, Firefox, Edge).
A local development server (e.g., http-server, VS Code Live Server, or Python’s HTTP server).
Internet access to load external CDNs (Tailwind CSS, Inter Font, D3.js).

### Installation

Clone the Repository:
```
git clone https://github.com/dipmanmajumdar/watermedic.git
cd watermedic
```

### Verify Project Files:Ensure the following files are present in the project directory:

index.html: Main HTML structure.
styles.css: Custom CSS for styling.
script.js: JavaScript for interactivity.


### Serve the Application:WaterMedic requires a web server to function properly due to CDN dependencies and localStorage. Use one of the following methods:

Using http-server (requires Node.js):
```
npm install -g http-server
http-server .
```
Open <b>http://localhost:8080</b> in your browser.
Using VS Code Live Server:Open the project in VS Code, install the Live Server extension, right-click index.html, and select "Open with Live Server."
Using Python HTTP Server (Python 3):
```
python -m http.server 8000
```
Open <b>http://localhost:8000</b> in your browser.


Access the Application:Navigate to the served URL (e.g., http://localhost:8080). The application will load with all features functional.


## Usage
### 1. Personalized Water Intake Calculator

### Input Details:
- Age: Enter your age in years.
- Weight: Enter your weight and select the unit (kg or lb).
- Activity Level: Choose Low (sedentary), Moderate (light exercise), or High (intense exercise).
- Hot Weather: Toggle the switch to increase the target by 15% for hot climates.


- Calculate: Click "Calculate Daily Target" to compute your daily water goal, displayed in milliliters and equivalent 250ml glasses.

### 2. Daily Hydration Tracker

Track Intake: Use the "+" button to add 250ml (one glass) or the "−" button to subtract 250ml.
Progress Bar: Updates dynamically with a percentage and animated wave effect.
Droplet Icons: Show consumed glasses (filled blue) versus total target glasses (light blue).

### 3. Hydration Reminders

Set Interval: Select a reminder frequency (1, 2, or 3 hours) or "Off" to disable.
Enable Notifications: Click "Set Reminder" and grant browser notification permission when prompted.
Receive Alerts: Notifications will remind you to drink water, showing your current and target intake.

### 4. Water Intake History

View History: Select "Last 7 Days," "Last 30 Days," or "Last 365 Days" to filter the graph.
Interactive Graph: Hover over dots to see intake details for specific days.
Daily Reset: Intake resets at midnight, with the previous day’s data saved to history.

### 5. Data Persistence

All settings and data are saved to localStorage, ensuring continuity across browser sessions.
Clear browser storage if you wish to reset all data.

File Structure
```
watermedic/
├── index.html        # Main HTML file with the application structure
├── styles.css        # Custom CSS for neumorphic design and styling
├── script.js         # JavaScript logic for interactivity and state management
└── README.md         # Project documentation
```
## Screenshots
### Main Interface: 
![Click Here](https://github.com/user-attachments/assets/408989cc-3179-49e9-84c5-eb15ab37578e)

### Hydration Tracker: 
![Screenshot 2025-07-10 023235](https://github.com/user-attachments/assets/22f3b60b-e06c-474e-8c54-2927ab7fe419)

### History Graph: 
![Screenshot 2025-07-10 023331](https://github.com/user-attachments/assets/16fdbc0b-5a79-48de-a989-781f25c7c9a9)

___

# Contributing
Contributions are welcome! To contribute:

Fork the repository.

Create a feature branch:
~~~
git checkout -b feature/your-feature-name
~~~

Commit your changes:git commit -m "Add your feature description"


Push to the branch:
```
git push origin feature/your-feature-name
```

Open a Pull Request with a detailed description of your changes.

Please adhere to the existing code style, add comments where necessary, and test your changes thoroughly.
License
<i>This project is licensed under the MIT License. See the LICENSE file for details.</i>

# Credits
## 🚀 Developed by [Dee](https://github.com/dipmanmajumdar)

# Contact
- For questions, suggestions, or issues, please:

### <i>Open an issue on the GitHub Issues page.</i>
Contact Dee directly.
___
## Stay hydrated with WaterMedic! 💧
