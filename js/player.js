/*
 * Audio demo tracks.
 * Add more entries here (and drop the matching .mp3 into assets/audio/)
 * to show more than one sample — the player UI supports any number.
 *
 * Example of a second track once you have the file:
 * {
 *   file: "assets/audio/demo-02.mp3",
 *   titleEs: "Mezcla y masterización — Tema musical",
 *   titleEn: "Mix & master — Music track",
 *   tagEs: "Mezcla & Masterización",
 *   tagEn: "Mixing & Mastering"
 * }
 */
const TRACKS = [
  {
    file: "assets/audio/demo-01.mp3",
    titleEs: "Reel de locución y doblaje",
    titleEn: "Voice over & dubbing reel",
    tagEs: "Locución / Doblaje",
    tagEn: "Voice Over / Dubbing"
  }
];

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const ICONS = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

function buildPlayerCard(track, lang) {
  const wrap = document.createElement("div");
  wrap.className = "player-card reveal";

  const audio = document.createElement("audio");
  audio.src = track.file;
  audio.preload = "metadata";

  const playBtn = document.createElement("button");
  playBtn.className = "player-playbtn";
  playBtn.innerHTML = ICONS.play;
  playBtn.setAttribute("aria-label", "Play");

  const body = document.createElement("div");
  body.className = "player-body";

  const titleRow = document.createElement("div");
  titleRow.className = "player-title-row";
  const title = document.createElement("span");
  title.className = "player-title";
  title.dataset.es = track.titleEs;
  title.dataset.en = track.titleEn;
  title.textContent = lang === "en" ? track.titleEn : track.titleEs;
  const tag = document.createElement("span");
  tag.className = "player-tag";
  tag.dataset.es = track.tagEs;
  tag.dataset.en = track.tagEn;
  tag.textContent = lang === "en" ? track.tagEn : track.tagEs;
  titleRow.appendChild(title);
  titleRow.appendChild(tag);

  const progressRow = document.createElement("div");
  progressRow.className = "player-progress-row";

  const curTime = document.createElement("span");
  curTime.className = "player-time start";
  curTime.textContent = "0:00";

  const track_el = document.createElement("div");
  track_el.className = "progress-track";
  const fill = document.createElement("div");
  fill.className = "progress-fill";
  const handle = document.createElement("div");
  handle.className = "progress-handle";
  track_el.appendChild(fill);
  track_el.appendChild(handle);

  const endTime = document.createElement("span");
  endTime.className = "player-time end";
  endTime.textContent = "0:00";

  progressRow.appendChild(curTime);
  progressRow.appendChild(track_el);
  progressRow.appendChild(endTime);

  body.appendChild(titleRow);
  body.appendChild(progressRow);

  const controls = document.createElement("div");
  controls.className = "player-controls";

  const backBtn = document.createElement("button");
  backBtn.className = "icon-btn";
  backBtn.innerHTML = ICONS.back;
  backBtn.setAttribute("aria-label", "Rewind 10s");

  const fwdBtn = document.createElement("button");
  fwdBtn.className = "icon-btn";
  fwdBtn.innerHTML = ICONS.fwd;
  fwdBtn.setAttribute("aria-label", "Forward 10s");

  const dlBtn = document.createElement("a");
  dlBtn.className = "icon-btn";
  dlBtn.innerHTML = ICONS.download;
  dlBtn.href = track.file;
  dlBtn.setAttribute("download", "");
  dlBtn.setAttribute("aria-label", "Download");

  controls.appendChild(backBtn);
  controls.appendChild(fwdBtn);
  controls.appendChild(dlBtn);

  wrap.appendChild(playBtn);
  wrap.appendChild(body);
  wrap.appendChild(controls);
  wrap.appendChild(audio);

  let isPlaying = false;

  function setPlaying(state) {
    isPlaying = state;
    playBtn.innerHTML = state ? ICONS.pause : ICONS.play;
    playBtn.setAttribute("aria-label", state ? "Pause" : "Play");
  }

  playBtn.addEventListener("click", () => {
    document.querySelectorAll("audio").forEach(a => {
      if (a !== audio && !a.paused) a.pause();
    });
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => setPlaying(false));

  audio.addEventListener("loadedmetadata", () => {
    endTime.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + "%";
    handle.style.left = pct + "%";
    curTime.textContent = formatTime(audio.currentTime);
  });

  function seekFromEvent(e) {
    const rect = track_el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.min(1, Math.max(0, pct));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }

  track_el.addEventListener("click", seekFromEvent);

  let dragging = false;
  track_el.addEventListener("mousedown", () => { dragging = true; });
  window.addEventListener("mousemove", (e) => { if (dragging) seekFromEvent(e); });
  window.addEventListener("mouseup", () => { dragging = false; });

  backBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });
  fwdBtn.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  return wrap;
}

window.renderPlayers = function (lang) {
  const list = document.getElementById("player-list");
  if (!list) return;

  if (list.dataset.built === "true") {
    // Already built — just swap the language-dependent text, don't
    // recreate the DOM (that would reset playback and the entrance animation).
    list.querySelectorAll(".player-title, .player-tag").forEach(el => {
      el.textContent = lang === "en" ? el.dataset.en : el.dataset.es;
    });
    return;
  }

  list.innerHTML = "";
  TRACKS.forEach(track => {
    list.appendChild(buildPlayerCard(track, lang));
  });
  list.dataset.built = "true";
};
