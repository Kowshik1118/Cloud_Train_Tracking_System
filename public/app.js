let trains = [];
let favorites = JSON.parse(localStorage.getItem("railcloud_favorites") || "[]");

const $ = id => document.getElementById(id);

async function load() {
  const [trainsRes, statsRes, stationsRes] = await Promise.all([
    fetch("/api/trains"), fetch("/api/stats"), fetch("/api/stations")
  ]);
  trains = await trainsRes.json();
  const stats = await statsRes.json();
  const stations = await stationsRes.json();

  $("stats").innerHTML = `
    <div class="stat"><b>${stats.trains}</b><span>Trains monitored</span></div>
    <div class="stat"><b>${stats.stations}</b><span>Stations in directory</span></div>
    <div class="stat"><b>${stats.running}</b><span>Currently running</span></div>
    <div class="stat"><b>${stats.delayed}</b><span>Delayed services</span></div>`;
  renderFeatured();
  renderAll();
  renderStations(stations);
}

function statusClass(status) {
  return status === "Delayed" ? "delay" : status === "On Time" ? "ontime" : "";
}

function card(t) {
  const fav = favorites.includes(t.number);
  const from = t.route[0], to = t.route[t.route.length - 1];
  return `<article class="train-card">
    <div class="train-top">
      <div><div class="number">${t.number} · ${t.type}</div><div class="train-name">${t.name}</div></div>
      <span class="badge ${statusClass(t.status)}">${t.status}${t.delay ? " +" + t.delay + "m" : ""}</span>
    </div>
    <div class="route"><b>${from}</b><div class="route-line"></div><b>${to}</b></div>
    <div class="meta">
      <div><span>Speed</span><b>${t.speed} km/h</b></div>
      <div><span>Platform</span><b>${t.platform}</b></div>
      <div><span>Departure</span><b>${t.departure}</b></div>
      <div><span>Coach</span><b>${t.coach}</b></div>
    </div>
    <div class="card-actions">
      <button class="${fav ? "star active" : "star"}" onclick="toggleFavorite('${t.number}')" title="Favorite">★</button>
      <button class="primary" onclick="showDetails('${t.number}')">Track Train</button>
    </div>
  </article>`;
}

function renderFeatured() {
  $("featuredTrains").innerHTML = trains.filter(t => t.status === "Running").slice(0, 6).map(card).join("");
}

function renderAll() {
  const type = $("typeFilter").value, status = $("statusFilter").value;
  const list = trains.filter(t => (!type || t.type === type) && (!status || t.status === status));
  $("allTrains").innerHTML = list.length ? list.map(card).join("") : `<div class="empty">No trains match your filters.</div>`;
}

function renderFavorites() {
  const list = trains.filter(t => favorites.includes(t.number));
  $("favoriteTrains").innerHTML = list.length ? list.map(card).join("") :
    `<div class="empty">No favorite trains yet. Click ★ on a train to add it here.</div>`;
}

function renderStations(stations) {
  const q = ($("stationSearch").value || "").toLowerCase();
  const list = stations.filter(s => s.toLowerCase().includes(q));
  $("stationGrid").innerHTML = list.map(s => {
    const count = trains.filter(t => t.route.includes(s)).length;
    return `<div class="station">🚉 ${s}<small>${count} monitored route${count === 1 ? "" : "s"}</small></div>`;
  }).join("");
}

function toggleFavorite(number) {
  favorites = favorites.includes(number) ? favorites.filter(x => x !== number) : [...favorites, number];
  localStorage.setItem("railcloud_favorites", JSON.stringify(favorites));
  renderFeatured(); renderAll(); renderFavorites();
}

function showDetails(number) {
  const t = trains.find(x => x.number === number);
  $("modalContent").innerHTML = `
    <p class="eyebrow">${t.type} · TRAIN ${t.number}</p>
    <h2 class="detail-title">${t.name}</h2>
    <p><span class="badge ${statusClass(t.status)}">${t.status}</span> &nbsp; Current speed: <b>${t.speed} km/h</b></p>
    <p>Journey progress</p>
    <div class="progress"><div style="width:${t.progress}%"></div></div>
    <b>${t.progress}% completed</b>
    <div class="detail-grid" style="margin-top:20px">
      <div class="detail-box"><small>Departure</small><b>${t.departure}</b></div>
      <div class="detail-box"><small>Arrival</small><b>${t.arrival}</b></div>
      <div class="detail-box"><small>Platform</small><b>${t.platform}</b></div>
      <div class="detail-box"><small>Coach</small><b>${t.coach}</b></div>
      <div class="detail-box"><small>Delay</small><b>${t.delay} min</b></div>
      <div class="detail-box"><small>Stops</small><b>${t.route.length}</b></div>
    </div>
    <h3>Route</h3>
    <div class="detail-route">${t.route.map((s,i) => `<span class="station-pill">${i+1}. ${s}</span>`).join("")}</div>`;
  $("modal").classList.remove("hidden");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section === id));
  if (id === "favorites") renderFavorites();
}

document.querySelectorAll(".nav-btn").forEach(b => b.addEventListener("click", () => showSection(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showSection(b.dataset.go)));

$("searchBtn").addEventListener("click", () => {
  const q = $("mainSearch").value.trim();
  showSection("trains");
  document.querySelectorAll(".train-card").forEach(() => {});
  $("allTrains").innerHTML = trains.filter(t =>
    [t.number,t.name,t.type,...t.route].some(v => v.toLowerCase().includes(q.toLowerCase()))
  ).map(card).join("") || `<div class="empty">No matching trains found.</div>`;
});
$("mainSearch").addEventListener("keydown", e => { if(e.key === "Enter") $("searchBtn").click(); });
$("typeFilter").addEventListener("change", renderAll);
$("statusFilter").addEventListener("change", renderAll);
$("stationSearch").addEventListener("input", async () => renderStations(await (await fetch("/api/stations")).json()));
$("closeModal").onclick = () => $("modal").classList.add("hidden");
$("modal").onclick = e => { if(e.target === $("modal")) $("modal").classList.add("hidden"); };

$("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("railcloud_dark", document.body.classList.contains("dark"));
  $("themeBtn").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};
if(localStorage.getItem("railcloud_dark") === "true") {
  document.body.classList.add("dark"); $("themeBtn").textContent = "☀️";
}

load();
setInterval(() => {
  trains = trains.map(t => ({...t, speed: Math.max(45, Math.min(120, t.speed + Math.round((Math.random()-.5)*8))) }));
  if(document.getElementById("dashboard").classList.contains("active")) renderFeatured();
  if(document.getElementById("trains").classList.contains("active")) renderAll();
}, 8000);