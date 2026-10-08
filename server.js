const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const trains = [
  {
    number: "12007",
    name: "Deccan Queen",
    type: "Superfast",
    route: ["Mumbai CSMT","Dadar","Thane","Kalyan","Lonavala","Pune"],
    departure: "07:10",
    arrival: "09:57",
    status: "On Time",
    platform: "5",
    progress: 72,
    speed: 92,
    delay: 0,
    coach: "CC"
  },
  {
    number: "12009",
    name: "Shatabdi Express",
    type: "Shatabdi",
    route: ["Mumbai Central","Borivali","Surat","Vadodara","Ahmedabad"],
    departure: "06:25",
    arrival: "12:45",
    status: "On Time",
    platform: "3",
    progress: 48,
    speed: 105,
    delay: 0,
    coach: "EC"
  },
  {
    number: "12627",
    name: "Karnataka Express",
    type: "Superfast",
    route: ["KSR Bengaluru","Yelahanka","Dharmapuri","Salem","Erode","Tiruppur","Coimbatore","Chennai Central","Vijayawada","Nagpur","New Delhi"],
    departure: "19:20",
    arrival: "06:30",
    status: "Running",
    platform: "2",
    progress: 61,
    speed: 88,
    delay: 8,
    coach: "SL"
  },
  {
    number: "12622",
    name: "Tamil Nadu Express",
    type: "Superfast",
    route: ["New Delhi","Agra Cantt","Gwalior","Jhansi","Bhopal","Nagpur","Vijayawada","Chennai Central"],
    departure: "22:30",
    arrival: "07:10",
    status: "Running",
    platform: "7",
    progress: 57,
    speed: 96,
    delay: 4,
    coach: "SL"
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    type: "Rajdhani",
    route: ["Mumbai Central","Borivali","Surat","Vadodara","Ratlam","Kota","New Delhi"],
    departure: "17:00",
    arrival: "08:35",
    status: "On Time",
    platform: "1",
    progress: 35,
    speed: 110,
    delay: 0,
    coach: "3A"
  },
  {
    number: "12952",
    name: "Mumbai Rajdhani",
    type: "Rajdhani",
    route: ["New Delhi","Kota","Ratlam","Vadodara","Surat","Borivali","Mumbai Central"],
    departure: "16:55",
    arrival: "08:35",
    status: "Delayed",
    platform: "4",
    progress: 42,
    speed: 76,
    delay: 21,
    coach: "3A"
  },
  {
    number: "12301",
    name: "Kolkata Rajdhani",
    type: "Rajdhani",
    route: ["Howrah","Asansol","Dhanbad","Gaya","Kanpur Central","New Delhi"],
    departure: "16:55",
    arrival: "10:00",
    status: "Running",
    platform: "9",
    progress: 66,
    speed: 103,
    delay: 3,
    coach: "2A"
  },
  {
    number: "12302",
    name: "Kolkata Rajdhani",
    type: "Rajdhani",
    route: ["New Delhi","Kanpur Central","Gaya","Dhanbad","Asansol","Howrah"],
    departure: "16:50",
    arrival: "09:55",
    status: "On Time",
    platform: "6",
    progress: 29,
    speed: 98,
    delay: 0,
    coach: "2A"
  },
  {
    number: "12953",
    name: "August Kranti Rajdhani",
    type: "Rajdhani",
    route: ["Mumbai Central","Borivali","Surat","Vadodara","Ratlam","Kota","Mathura","New Delhi"],
    departure: "17:40",
    arrival: "09:43",
    status: "Running",
    platform: "8",
    progress: 51,
    speed: 101,
    delay: 2,
    coach: "1A"
  },
  {
    number: "12259",
    name: "Sealdah Duronto Express",
    type: "Duronto",
    route: ["Sealdah","Dhanbad","Gaya","Kanpur Central","New Delhi"],
    departure: "12:50",
    arrival: "10:00",
    status: "On Time",
    platform: "10",
    progress: 44,
    speed: 107,
    delay: 0,
    coach: "2A"
  },
  {
    number: "12243",
    name: "Chennai Central Duronto",
    type: "Duronto",
    route: ["Chennai Central","Vijayawada","Warangal","Nagpur","Bhopal","New Delhi"],
    departure: "06:35",
    arrival: "10:30",
    status: "Running",
    platform: "3",
    progress: 38,
    speed: 99,
    delay: 6,
    coach: "3A"
  },
  {
    number: "12646",
    name: "Nizamuddin - Ernakulam SF",
    type: "Superfast",
    route: ["Hazrat Nizamuddin","Agra Cantt","Bhopal","Nagpur","Secunderabad","Vijayawada","Chennai Central","Bengaluru","Ernakulam"],
    departure: "09:15",
    arrival: "18:20",
    status: "Running",
    platform: "2",
    progress: 74,
    speed: 84,
    delay: 10,
    coach: "SL"
  }
];

const stations = [
  "New Delhi","Mumbai Central","Mumbai CSMT","Chennai Central","KSR Bengaluru",
  "Howrah","Sealdah","Pune","Ahmedabad","Surat","Vadodara","Bhopal",
  "Nagpur","Vijayawada","Hyderabad","Secunderabad","Kota","Agra Cantt",
  "Kanpur Central","Gaya","Dhanbad","Asansol","Ernakulam","Coimbatore",
  "Salem","Erode","Tiruppur","Bengaluru"
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/trains", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  let result = trains;
  if (q) {
    result = trains.filter(t =>
      t.number.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q) ||
      t.route.some(s => s.toLowerCase().includes(q))
    );
  }
  res.json(result);
});

app.get("/api/trains/:number", (req, res) => {
  const train = trains.find(t => t.number === req.params.number);
  if (!train) return res.status(404).json({error: "Train not found"});
  res.json(train);
});

app.get("/api/stations", (req, res) => res.json(stations));

app.get("/api/stats", (req, res) => {
  const running = trains.filter(t => t.status === "Running").length;
  const delayed = trains.filter(t => t.status === "Delayed").length;
  res.json({
    trains: trains.length,
    stations: stations.length,
    running,
    delayed,
    onTime: trains.length - delayed
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Cloud Train Tracking System running at http://localhost:${PORT}`);
});