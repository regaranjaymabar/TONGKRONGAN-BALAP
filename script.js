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
        },
        { 
            title: 'epwang', 
            status: 'live', 
            leaderboard: ['Rider1 - 1st', 'Rider2 - 2nd'],
            streamUrl: 'https://cb.cdnid.win/racevalencia25/v360p/gp_152.json'
        },
    ],
    schedule: [
        { title: 'Pre Season Test', date: '2025-11-18', country: 'Valencia spanyol', type: 'motogp' },
        { title: 'F1 Brazil', date: '2025-10-22', country: 'Brazil', type: 'f1' }
    ],
    highlights: [
        { 
            title: 'Highlight MotoGP Valencia', 
            thumbnail: 'https://media.gettyimages.com/id/2246434260/photo/aprilia-racing-teams-italian-motogp-rider-marco-bezzecchi-celebrates-on-the-podium-after.jpg?s=612x612&w=0&k=20&c=2bELk9oaT74vITwvhNCyTuFhsdEyMDIK_06RYLZYLv8=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/_MNlGAK69AE?si=oL1WnvoCGk6IT47S",
        },
        { 
            title: 'Highlight MotoGP Algarve', 
            thumbnail: 'https://media.gettyimages.com/id/2245298939/photo/lagoa-algarve-portugal-during-the-qatar-airways-grand-prix-of-portugal-race-day-at-autodromo.jpg?s=612x612&w=0&k=20&c=t95KdWQBxI4yleHnT9pL7oWeyE5p-8196ga-fyhtVM0=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/EbJMANarkcQ?si=1mzksTVFX9wJs6HJ"
        },
        { 
            title: 'Highlight MotoGP Sepang ', 
            thumbnail: 'https://media.gettyimages.com/id/2243360149/photo/kuala-lumpur-malaysia-alex-marquez-of-spain-riding-the-bk8-gresini-racing-ducati-takes.jpg?s=612x612&w=0&k=20&c=4mTIk5olEvLFOa3EjdNxmE0R7PHRucj0eWa48o9ZqD4=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/h6QFIj_uBN4?si=xi6uNtduElaZ5aoI" 
        },
        { 
            title: 'Highlight MotoGP Philip Island', 
            thumbnail: 'https://media.gettyimages.com/id/2241823412/photo/phillip-island-grand-prix-circuit-cowes-victoria-australia-number-25-trackhouse-racing-rider.jpg?s=612x612&w=0&k=20&c=YVoEwttpOkfOAZNWPwK6E_WYps9MaLN6f6vtnBmAkn8=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/wIrSzozUjP0?si=LwxUJJ5JkAjmEfRx" 
        },
        { 
            title: 'Highlight MotoGP Mandalika', 
            thumbnail: 'https://media.gettyimages.com/id/2238896608/photo/topshot-bk8-gresini-racing-motogp-teams-spanish-motogp-rider-fermin-aldeguer-celebrates-on.jpg?s=612x612&w=0&k=20&c=JTmm0zmgP0hAeWdmlS4qDFtvUFUbxo7ySFU2Bw_yhU0=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/0sHnV_d10NQ?si=7nE9x7tEIMzFFXAH" 
        },
        { 
            title: 'Highlight MotoGP Motegi', 
            thumbnail: 'https://media.gettyimages.com/id/2237824393/photo/motegi-japan-marc-marquez-of-spain-riding-the-lenovo-ducati-celebrates-winning-the-world.jpg?s=612x612&w=0&k=20&c=xaCCvwiId1Yzl1rg3y_3qigqzM0f1ILbWccKmMfJ4wA=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/yKzEZsyVjjo?si=4rlrU1CEQe_R4JNp" 
        },
        { 
            title: 'Highlight MotoGP Misano', 
            thumbnail: 'https://media.gettyimages.com/id/2234820647/photo/marc-marquez-from-spain-rides-the-ducati-desmosedici-gp25-of-the-ducati-lenovo-team-and-shows.jpg?s=612x612&w=0&k=20&c=QaBOy-q_LQN0JkhsIb5eXLxrQuclZQ-AQxtuzhZlFsc=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/BLsG1SneHKc?si=yh2krLVaaJXZOp2T" 
        },
        { 
            title: 'Highlight MotoGP Catalunya  ', 
            thumbnail: 'https://media.gettyimages.com/id/2234138989/photo/barcelona-spain-alex-marquez-of-spain-riding-the-bk8-gresini-racing-ducati-celebrates-victory.jpg?s=612x612&w=0&k=20&c=HrBh7x4iNR-Lll66Uex-1tBWcuQD26inxR513xjRdLY=', 
            description: 'Best moments from the race.',
            videoUrl:"https://youtu.be/Gz5DKTmm5Ps?si=xdzYwfWDxVXMDr-D" 
        },
        { 
            title: 'tes live tvone  ', 
            thumbnail: 'https://i.pinimg.com/736x/2a/e4/c8/2ae4c8978c167465bfcd1291c88079b7.jpg', 
            description: 'TES.',
            videoUrl:"https://youtu.be/yNKvkPJl-tg" 
        }
    ],
    teams: [
        { 
            name: 'Ducati', 
            driver: 'Marc Marquez', 
            number: 93, 
            nationality: 'Spanyol', 
            photo: 'https://resources.motogp.pulselive.com/photo-resources/2025/02/10/db39c323-167c-4a23-b3ae-75cfe6b06d95/jws78ATZ.png?height=700&width=900',
        }
    ]
};

function extractYouTubeID(url) {
    const pattern = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#?/]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

function playYouTube(url) {
    const videoId = extractYouTubeID(url);
    if (!videoId) {
        alert("Link YouTube tidak valid!");
        return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

    // ganti video-player menjadi iframe
    document.getElementById("video-player").outerHTML = `
        <iframe id="video-player"
            width="100%" 
            height="100%" 
            src="${embedUrl}" 
            frameborder="0" 
            allow="autoplay; encrypted-media"
            allowfullscreen>
        </iframe>
    `;

    // buka halaman player
    showPage("player");
}


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
            <div class="highlight-card" onclick="playYouTube('${h.videoUrl}')">
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
const proxyURL = "https://Tongkronganbalap.com/proxy.php?url=";

// ==========================================
// 2. LINK STREAM YANG MAU DIPUTAR
// ==========================================
const streamURL = "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8";

const video = document.getElementById("video-player");

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
//playDirect();


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


/* ============================================================
   OBS PLAYER MODE — SUPAYA BISA DIPAKAI DI OBS
=============================================================== */

function playForOBS(streamUrl) {
    const video = document.getElementById("video-player");

    // Jika elemen videonya tidak ada → stop
    if (!video) {
        console.error("Video element #videoPlayer tidak ditemukan");
        return;
    }

    // Link proxy kamu
    const proxyURL = "https://Tongkronganbalap.com/proxy.php?url=";

    // Bikin dua versi: direct + proxy
    const directURL = streamUrl;
    const proxiedURL = proxyURL + encodeURIComponent(streamUrl);

    console.log("OBS mode: mencoba DIRECT dulu:", directURL);

    if (Hls.isSupported()) {
        const hls = new Hls();

        // Jika gagal → otomatis switch ke proxy
        hls.on(Hls.Events.ERROR, function (_, error) {
            console.warn("Direct gagal:", error.details);
            console.log("Pindah ke MODE PROXY:", proxiedURL);

            const hls2 = new Hls();
            hls2.loadSource(proxiedURL);
            hls2.attachMedia(video);
        });

        // Coba direct dulu
        try {
            hls.loadSource(directURL);
            hls.attachMedia(video);
        } catch {
            console.warn("Direct load error → langsung proxy");
            const hls2 = new Hls();
            hls2.loadSource(proxiedURL);
            hls2.attachMedia(video);
        }

    } else {
        // Untuk Safari / OBS native player
        video.src = directURL;

        video.onerror = () => {
            console.log("Native direct fail → ganti proxy");
            video.src = proxiedURL;
        };
    }
}

