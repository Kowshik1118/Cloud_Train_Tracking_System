# 🚆 RailCloud - Cloud-Based Train Tracking System
https://cloud-train-tracking-system.onrender.com
A beginner-friendly academic project built with **HTML, CSS, JavaScript and Node.js/Express**.

## Features

- Modern responsive train tracking dashboard
- 12 real Indian train names
- 28 major stations
- Search by train name, train number or station
- Favorite trains saved in browser LocalStorage
- Train type filters: Rajdhani, Shatabdi, Duronto, Superfast
- Status filters: Running, On Time, Delayed
- Train tracking details modal
- Route and station directory
- Journey progress bar
- Speed, platform, coach, departure, arrival and delay information
- Dark mode
- Responsive design for mobile and desktop
- REST API endpoints
- Live-style speed updates every few seconds
- Cloud-deployment friendly because the server uses `process.env.PORT`

## Technologies

Frontend:
- HTML5
- CSS3
- JavaScript

Backend:
- Node.js
- Express.js

Storage:
- LocalStorage for favorites/theme
- In-memory demo train data

## Folder Structure

```text
Cloud_Train_Tracking_System/
│
├── package.json
├── server.js
├── README.md
│
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Run in VS Code

1. Install Node.js.
2. Extract the ZIP.
3. Open the extracted folder in VS Code.
4. Open Terminal in VS Code.
5. Run:

```bash
npm install
```

6. Then run:

```bash
npm start
```

7. Open:
8. https://cloud-train-tracking-system.onrender.com

```text
http://localhost:5000
```

## API Endpoints

```text
GET /api/trains
GET /api/trains?q=rajdhani
GET /api/trains/12627
GET /api/stations
GET /api/stats
```

## Cloud Deployment

This project is ready for platforms such as Render, Railway or similar Node.js hosting.

Use:

```text
Build command: npm install
Start command: npm start
```

The server automatically uses the hosting provider's `PORT` environment variable.

## Important Note

The train information in this academic project is demonstration data. Train names are real, but the displayed live status, speed, progress and timings are simulated for the project UI.

## Suggested Project Title

**Cloud-Based Train Tracking and Journey Management System**

## Future Enhancements

- MongoDB Atlas database
- User registration/login
- Admin dashboard
- Real railway API integration
- Booking module
- PNR status
- Push notifications
- Maps/GPS integration
- Email/SMS alerts
- Real-time WebSocket tracking
