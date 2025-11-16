// scripts.js - JavaScript logic for RaceStream Hub
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.querySelector('.theme-toggle');

/* ============================================================
   FALLBACK DATA (DUMMY)
=============================================================== */
const dummyData = {
    upcoming: [
        { title: 'MotoGP Qatar', date: '2023-10-01', type: 'motogp' },
        { title: 'F1 Mexico', date: '2023-10-08', type: 'f1' }
    ],
    live: [
        { 
            title: 'Valencia GP', 
            status: 'live', 
            leaderboard: ['Rider1 - 1st', 'Rider2 - 2nd'],
            streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        }
    ],
    schedule: [
        { title: 'MotoGP Indonesia', date: '2025-10-15', country: 'Indonesia', type: 'motogp' },
        { title: 'F1 Brazil', date: '2025-10-22', country: 'Brazil', type: 'f1' }
    ],
    highlights: [
        { 
            title: 'MotoGP Highlight', 
            thumbnail: 'data:image/svg+xml;base64,...', 
            description: 'Best moments from the race.' 
        }
    ],
    teams: [
        { 
            name: 'Yamaha', 
            driver: 'Valentino Rossi', 
            number: 46, 
            nationality: 'Italy', 
            photo: 'data:image/svg+xml;base64,...' 
        }
    ]
};

/* ============================================================
   LOAD DATA
=============================================================== */
async function loadData() {
    try {
        const response = await fetch('data/events.json');
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    } catch (err) {
        console.warn("Using dummy data:", err);
        return dummyData;
    }
}

/* ============================================================
   PAGE NAVIGATION
=============================================================== */
function showPage(pageId) {
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");

    navLinks.forEach(n => n.classList.remove("active"));
    const nav = document.querySelector(`[data-page="${pageId}"]`);
    if (nav) nav.classList.add("active");
}

/* ============================================================
   THEME SWITCH
=============================================================== */
function toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "dark" ? "🌙" : "☀️";
}

/* ============================================================
   RENDER SECTIONS
=============================================================== */
function renderUpcoming(data) {
    document.getElementById("upcoming-carousel").innerHTML =
        data.upcoming.map(u => `
            <div class="carousel__item">
                <h3>${u.title}</h3>
                <p>${u.date}</p>
            </div>
        `).join("");
}

function renderLive(data) {
    document.getElementById("live-events").innerHTML =
        data.live.map(event => `
            <div class="event-card ${event.status === "live" ? "live" : ""}">
                <h3>${event.title}</h3>
                <ul>${event.leaderboard.map(p => `<li>${p}</li>`).join("")}</ul>

                <button class="event-card__btn"
                    onclick="openStream('${event.streamUrl}')">
                    Putar Stream
                </button>

                <button class="event-card__btn"
                    onclick="playStreamFallback('${event.streamUrl}')">
                    Force Fallback Player
                </button>
            </div>
        `).join("");
}

function renderSchedule(data, filter="all") {
    const filtered = data.schedule.filter(s => filter === "all" || s.type === filter);
    document.getElementById("schedule-list").innerHTML =
        filtered.map(item => `
            <div class="schedule-item">
                <h3>${item.title}</h3>
                <p>${item.date} - ${item.country}</p>
            </div>
        `).join("");
}

function renderHighlights(data) {
    document.getElementById("highlights-grid").innerHTML =
        data.highlights.map(h => `
            <div class="highlight-card" onclick="openHighlight('${h.title}')">
                <img src="${h.thumbnail}" loading="lazy">
                <h3>${h.title}</h3>
                <p>${h.description}</p>
            </div>
        `).join("");
}

function renderTeams(data) {
    document.getElementById("teams-grid").innerHTML =
        data.teams.map(t => `
            <div class="team-card">
                <img src="${t.photo}" loading="lazy">
                <h3>${t.driver}</h3>
                <p>${t.name} - #${t.number} (${t.nationality})</p>
            </div>
        `).join("");
}

/* ============================================================
   TOAST
=============================================================== */
function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `
        position:fixed; bottom:20px; right:20px; 
        background:var(--accent); color:#fff;
        padding:1rem; border-radius:6px; z-index:9999;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ============================================================
   ADVANCED PLAYER — AXEL MODE (VERSI 1)
=============================================================== */
const videoPlayer = document.getElementById("video-player");

async function openStream(url) {
    showPage("player");
    showToast("Mencoba memuat stream...");
    await playStreamSmart(url);
}

async function playStreamSmart(url) {
    const attemptList = [
        directAttempt,
        corsProxyAttempt,
        rewriteAttempt,
        blobBypassAttempt
    ];

    for (const tryMethod of attemptList) {
        const success = await tryMethod(url);
        if (success) return true;
    }

    alert("Semua metode gagal. Server memblokir akses.");
    return false;
}

async function directAttempt(url) {
    try {
        if (Hls.isSupported()) {
            const hls = new Hls({ debug: false });
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());
            showToast("Direct stream OK");
            return true;
        }
        if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
            videoPlayer.src = url;
            videoPlayer.play();
            showToast("iOS native OK");
            return true;
        }
    } catch {}
    return false;
}

async function corsProxyAttempt(url) {
    try {
        const proxy = "https://cors-proxy.axel.workers.dev/?";
        const finalURL = proxy + url;

        const hls = new Hls();
        hls.loadSource(finalURL);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());

        showToast("Proxy bypass OK");
        return true;
    } catch {}
    return false;
}

async function rewriteAttempt(url) {
    try {
        const rewritten = url.replace("https://", "https://raw.");
        const hls = new Hls();
        hls.loadSource(rewritten);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());

        showToast("Rewrite bypass OK");
        return true;
    } catch {}
    return false;
}

async function blobBypassAttempt(url) {
    try {
        const res = await fetch(url);
        const data = await res.blob();
        const blobURL = URL.createObjectURL(data);

        const hls = new Hls();
        hls.loadSource(blobURL);
        hls.attachMedia(videoPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, () => videoPlayer.play());
        showToast("Blob bypass OK — Cloudflare dilewati");

        return true;
    } catch {}
    return false;
}

/* ============================================================
 AXEL — FALLBACK PLAYER (VERSI 2, dari request kamu)
=============================================================== */
// ==========================================
// 1. UBAH INI KE DOMAIN HOSTING KAMU
// ==========================================
const proxyURL = "https://Tongkrongan balap.com/proxy.php?url=";

// ==========================================
// 2. LINK STREAM YANG MAU DIPUTAR
// ==========================================
const streamURL = "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8";

const video = document.getElementById("videoPlayer");

// ==========================================
// Fungsi play via PROXY
// ==========================================
function playViaProxy() {
    const finalURL = proxyURL + encodeURIComponent(streamURL);
    console.log("Trying via PROXY:", finalURL);

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(finalURL);
        hls.attachMedia(video);
    } else {
        video.src = finalURL;
    }
}

// ==========================================
// Fungsi play DIRECT
// ==========================================
function playDirect() {
    console.log("Trying DIRECT:", streamURL);

    if (Hls.isSupported()) {
        const hls = new Hls();

        // Kalau error → otomatis pindah ke proxy
        hls.on(Hls.Events.ERROR, function (_, data) {
            console.warn("Direct error detected:", data.details);
            console.log("Switching to proxy...");
            playViaProxy();
        });

        hls.loadSource(streamURL);
        hls.attachMedia(video);

    } else {
        video.src = streamURL;

        video.onerror = () => {
            console.log("Native direct failed → switching to proxy...");
            playViaProxy();
        };
    }
}

// ==========================================
// Start
// ==========================================
playDirect();


/* ============================================================
   EVENT LISTENER
=============================================================== */
document.addEventListener("click", e => {
    const page = e.target.getAttribute("data-page");
    if (page) {
        e.preventDefault();
        showPage(page);
        localStorage.setItem("lastPage", page);
    }
});

themeToggle.addEventListener("click", toggleTheme);

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const filter = e.target.getAttribute("data-filter");
        loadData().then(data => renderSchedule(data, filter));
        localStorage.setItem("lastFilter", filter);
    });
});

/* ============================================================
   INIT
=============================================================== */
async function init() {
    const data = await loadData();

    renderUpcoming(data);
    renderLive(data);
    renderSchedule(data, localStorage.getItem("lastFilter") || "all");
    renderHighlights(data);
    renderTeams(data);

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);

    const lastPage = localStorage.getItem("lastPage") || "home";
    showPage(lastPage);
}

init();
