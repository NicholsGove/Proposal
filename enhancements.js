// ============================================================
//  ENHANCEMENTS — new features layer
//  Photo gallery · Our-story timeline · Music · Keepsake
//
//  HOW TO PERSONALIZE (everything is editable below):
//   • PHOTOS  : drop photo1.jpg ... photo8.jpg into this folder
//               (any photos will appear automatically). Edit the
//               captions in `galleryPhotos` below.
//   • TIMELINE: edit `timelineMilestones` with your real dates
//               and moments.
//   • MUSIC   : drop a song named  music.mp3  (or music.ogg) into
//               this folder. If none is found, a soft built-in
//               melody plays instead.
//   • KEEPSAKE: edit `keepsakeMessage` below.
// ============================================================

const PERSON_NAME = (typeof HER_NAME !== 'undefined') ? HER_NAME : 'My Love';

// ---- Photo gallery data ------------------------------------
const galleryPhotos = [
    { file: 'photo1.jpg', caption: 'The day everything changed 💖' },
    { file: 'photo2.jpg', caption: 'Your smile, my favorite view' },
    { file: 'photo3.jpg', caption: 'Lost in the moment with you' },
    { file: 'photo4.jpg', caption: 'Every adventure is better together' },
    { file: 'photo5.jpg', caption: 'Just us, just happy' },
    { file: 'photo6.jpg', caption: 'My whole world in one frame' },
    { file: 'photo7.jpg', caption: 'Forever starts here' },
    { file: 'photo8.jpg', caption: 'And so many more to come...' }
];

// ---- Timeline milestones (edit freely) ---------------------
const timelineMilestones = [
    { date: 'The Beginning', title: 'The day we met', text: 'The moment the world quietly rearranged itself around you.', icon: '✨' },
    { date: 'Early Days',    title: 'Our first conversation', text: 'Hours felt like minutes. I knew you were different.', icon: '💬' },
    { date: 'Falling',       title: 'The first time you smiled at me', text: 'That smile undid me completely.', icon: '😊' },
    { date: 'Certainty',     title: 'When I knew it was you', text: 'Every road in my heart led straight to you.', icon: '💫' },
    { date: 'Today',         title: 'The day I ask you to be mine', text: 'And the day I hope our forever begins.', icon: '💍' }
];

// ---- Keepsake message --------------------------------------
const keepsakeMessage = "On this day, you said yes — and made me the luckiest person alive. I promise to love you, laugh with you, and choose you, every single day. Forever yours.";

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    fixLetterCounts();
    setupFeatureNav();
    buildGallery();
    setupLightbox();
    buildTimeline();
    setupMusic();
    setupKeepsake();
});

// ---- Fix the 12-vs-20 letters mismatch ---------------------
function fixLetterCounts() {
    const total = (typeof loveLetters !== 'undefined') ? loveLetters.length : 0;
    const subtitle = document.getElementById('love-letters-subtitle');
    if (subtitle) subtitle.textContent = `${total} letters from my heart to yours`;
    const readCount = document.querySelector('.letters-read-count');
    if (readCount) readCount.textContent = `0/${total} Read`;
}

// ============================================================
//  NAVIGATION between feature screens
// ============================================================
function goToScreen(id) {
    // transitionToScreen + currentScreen are defined in script.js (shared global scope)
    if (typeof transitionToScreen === 'function') {
        transitionToScreen(id);
    } else {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }
}

function setupFeatureNav() {
    const galleryBtn = document.getElementById('gallery-btn');
    const timelineBtn = document.getElementById('timeline-btn');
    const closeGallery = document.getElementById('close-gallery-btn');
    const closeTimeline = document.getElementById('close-timeline-btn');

    if (galleryBtn) galleryBtn.addEventListener('click', () => { goToScreen('gallery-page'); animateGalleryIn(); });
    if (timelineBtn) timelineBtn.addEventListener('click', () => { goToScreen('timeline-page'); animateTimelineIn(); });
    if (closeGallery) closeGallery.addEventListener('click', () => goToScreen('question-page'));
    if (closeTimeline) closeTimeline.addEventListener('click', () => goToScreen('question-page'));
}

// ============================================================
//  PHOTO MEMORY GALLERY
// ============================================================
let galleryLoaded = [];

function buildGallery() {
    const grid = document.getElementById('gallery-grid');
    const hint = document.getElementById('gallery-hint');
    if (!grid) return;
    grid.innerHTML = '';
    galleryLoaded = [];

    galleryPhotos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        item.style.animationDelay = (index * 0.08) + 's';

        const frame = document.createElement('div');
        frame.className = 'gallery-frame placeholder';
        frame.innerHTML = `
            <div class="gallery-placeholder-icon">📷</div>
            <div class="gallery-placeholder-num">${index + 1}</div>
        `;

        const cap = document.createElement('div');
        cap.className = 'gallery-caption';
        cap.textContent = photo.caption;

        item.appendChild(frame);
        item.appendChild(cap);
        grid.appendChild(item);

        // Try to load a real photo; fall back to placeholder.
        const img = new Image();
        img.onload = () => {
            frame.classList.remove('placeholder');
            frame.innerHTML = '';
            frame.style.backgroundImage = `url('${photo.file}')`;
            galleryLoaded[index] = photo.file;
            updateGalleryHint();
        };
        img.onerror = () => { galleryLoaded[index] = null; };
        img.src = photo.file;

        item.addEventListener('click', () => openLightbox(index));
    });

    updateGalleryHint();
}

function updateGalleryHint() {
    const hint = document.getElementById('gallery-hint');
    if (!hint) return;
    const any = galleryLoaded.some(Boolean);
    hint.innerHTML = any
        ? '💡 Tip: add or swap photos by replacing photo1.jpg … photo8.jpg in this folder.'
        : '💡 No photos yet — drop <strong>photo1.jpg</strong> … <strong>photo8.jpg</strong> into this folder and they\'ll appear here automatically.';
}

function animateGalleryIn() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, i) => {
        item.classList.remove('pop-in');
        void item.offsetWidth;
        item.style.animationDelay = (i * 0.07) + 's';
        item.classList.add('pop-in');
    });
}

// ---- Lightbox ----------------------------------------------
let currentPhotoIndex = 0;

function setupLightbox() {
    const close = document.getElementById('close-lightbox-btn');
    const prev = document.getElementById('prev-photo-btn');
    const next = document.getElementById('next-photo-btn');
    const lb = document.getElementById('gallery-lightbox');

    if (close) close.addEventListener('click', closeLightbox);
    if (prev) prev.addEventListener('click', () => openLightbox(Math.max(0, currentPhotoIndex - 1)));
    if (next) next.addEventListener('click', () => openLightbox(Math.min(galleryPhotos.length - 1, currentPhotoIndex + 1)));
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('gallery-lightbox');
        if (!lb || !lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(Math.max(0, currentPhotoIndex - 1));
        if (e.key === 'ArrowRight') openLightbox(Math.min(galleryPhotos.length - 1, currentPhotoIndex + 1));
    });
}

function openLightbox(index) {
    currentPhotoIndex = index;
    const lb = document.getElementById('gallery-lightbox');
    const imgEl = document.getElementById('lightbox-image');
    const capEl = document.getElementById('lightbox-caption');
    const photo = galleryPhotos[index];

    if (galleryLoaded[index]) {
        imgEl.className = 'lightbox-image';
        imgEl.style.backgroundImage = `url('${galleryLoaded[index]}')`;
        imgEl.innerHTML = '';
    } else {
        imgEl.className = 'lightbox-image placeholder';
        imgEl.style.backgroundImage = 'none';
        imgEl.innerHTML = `<div class="gallery-placeholder-icon big">📷</div><div class="lb-ph-text">Photo ${index + 1}</div>`;
    }
    capEl.textContent = photo.caption;
    lb.classList.add('active');
}

function closeLightbox() {
    const lb = document.getElementById('gallery-lightbox');
    if (lb) lb.classList.remove('active');
}

// ============================================================
//  TIMELINE — OUR STORY
// ============================================================
function buildTimeline() {
    const track = document.getElementById('timeline-track');
    if (!track) return;
    track.innerHTML = '';

    timelineMilestones.forEach((m, i) => {
        const node = document.createElement('div');
        node.className = 'timeline-node ' + (i % 2 === 0 ? 'left' : 'right');
        node.style.animationDelay = (i * 0.15) + 's';
        node.innerHTML = `
            <div class="timeline-dot">${m.icon}</div>
            <div class="timeline-card">
                <span class="timeline-date">${m.date}</span>
                <h3 class="timeline-card-title">${m.title}</h3>
                <p class="timeline-card-text">${m.text}</p>
            </div>
        `;
        track.appendChild(node);
    });
}

function animateTimelineIn() {
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach((n, i) => {
        n.classList.remove('reveal');
        void n.offsetWidth;
        n.style.animationDelay = (i * 0.15) + 's';
        n.classList.add('reveal');
    });
}

// ============================================================
//  BACKGROUND MUSIC (local file, else gentle built-in melody)
// ============================================================
let musicPlaying = false;
let musicMode = null;          // 'file' | 'synth'
let audioCtx = null;
let synthTimer = null;
let synthGain = null;

function setupMusic() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });

    // Detect whether a real audio file exists.
    if (audio) {
        audio.addEventListener('canplaythrough', () => { musicMode = 'file'; }, { once: true });
        audio.addEventListener('error', () => { if (musicMode !== 'file') musicMode = 'synth'; });
    }
}

function startMusic() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');

    const tryFile = audio && audio.querySelector('source') && musicMode !== 'synth';
    if (tryFile) {
        audio.volume = 0.0;
        const p = audio.play();
        if (p && p.then) {
            p.then(() => {
                musicMode = 'file';
                fadeAudio(audio, 0.45, 1500);
                setMusicOn(btn);
            }).catch(() => {
                playSynth();
                setMusicOn(btn);
            });
            return;
        }
    }
    playSynth();
    setMusicOn(btn);
}

function setMusicOn(btn) {
    musicPlaying = true;
    if (btn) { btn.classList.add('playing'); btn.textContent = '🎶'; btn.title = 'Pause Music'; }
}

function stopMusic() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    musicPlaying = false;
    if (btn) { btn.classList.remove('playing'); btn.textContent = '🎵'; btn.title = 'Play Music'; }

    if (musicMode === 'file' && audio) {
        fadeAudio(audio, 0, 600, () => audio.pause());
    }
    stopSynth();
}

function fadeAudio(audio, target, ms, done) {
    const steps = 20;
    const start = audio.volume;
    let i = 0;
    const iv = setInterval(() => {
        i++;
        audio.volume = Math.max(0, Math.min(1, start + (target - start) * (i / steps)));
        if (i >= steps) { clearInterval(iv); if (done) done(); }
    }, ms / steps);
}

// ---- Gentle built-in melody (no file needed) ---------------
function playSynth() {
    musicMode = 'synth';
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    synthGain = audioCtx.createGain();
    synthGain.gain.value = 0.0;
    synthGain.connect(audioCtx.destination);
    synthGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1.2);

    // A soft, looping romantic phrase (C major pentatonic feel).
    const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.00, 783.99,
                    698.46, 587.33, 523.25, 659.25];
    const beat = 0.62;
    let step = 0;

    const playNote = () => {
        if (!musicPlaying) return;
        const now = audioCtx.currentTime;
        const freq = melody[step % melody.length];

        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.9, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, now + beat * 0.95);
        osc.connect(g);
        g.connect(synthGain);
        osc.start(now);
        osc.stop(now + beat);

        // soft harmony a third below every other note
        if (step % 2 === 0) {
            const osc2 = audioCtx.createOscillator();
            const g2 = audioCtx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.value = freq / 1.5;
            g2.gain.setValueAtTime(0, now);
            g2.gain.linearRampToValueAtTime(0.4, now + 0.08);
            g2.gain.exponentialRampToValueAtTime(0.01, now + beat * 1.6);
            osc2.connect(g2);
            g2.connect(synthGain);
            osc2.start(now);
            osc2.stop(now + beat * 1.7);
        }
        step++;
        synthTimer = setTimeout(playNote, beat * 1000);
    };
    playNote();
}

function stopSynth() {
    if (synthTimer) { clearTimeout(synthTimer); synthTimer = null; }
    if (synthGain && audioCtx) {
        const now = audioCtx.currentTime;
        synthGain.gain.cancelScheduledValues(now);
        synthGain.gain.setValueAtTime(synthGain.gain.value, now);
        synthGain.gain.linearRampToValueAtTime(0, now + 0.5);
    }
}

// ============================================================
//  KEEPSAKE — sweet card + downloadable image
// ============================================================
function setupKeepsake() {
    const openBtn = document.getElementById('keepsake-btn');
    const closeBtn = document.getElementById('close-keepsake-btn');
    const dlBtn = document.getElementById('download-keepsake-btn');
    const modal = document.getElementById('keepsake-modal');
    const body = document.getElementById('keepsake-body');
    const dateEl = document.getElementById('keepsake-date');

    if (body) body.textContent = keepsakeMessage;
    if (dateEl) dateEl.textContent = formatToday();

    if (openBtn) openBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('active');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    if (dlBtn) dlBtn.addEventListener('click', downloadKeepsake);
}

function formatToday() {
    const d = new Date();
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function downloadKeepsake() {
    const W = 1080, H = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#3a0d3a');
    grad.addColorStop(0.5, '#7a1f4f');
    grad.addColorStop(1, '#ff6b6b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // soft hearts scattered
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 40; i++) {
        ctx.font = (Math.random() * 60 + 20) + 'px serif';
        ctx.fillText('💖', Math.random() * W, Math.random() * H);
    }
    ctx.globalAlpha = 1;

    // inner card
    const m = 90;
    roundRect(ctx, m, m, W - 2 * m, H - 2 * m, 40);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.stroke();

    ctx.textAlign = 'center';

    ctx.font = '120px serif';
    ctx.fillText('💖', W / 2, 320);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 70px Georgia, serif';
    ctx.fillText(`For ${PERSON_NAME}`, W / 2, 430);

    // body text, wrapped
    ctx.font = '40px Georgia, serif';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    wrapText(ctx, keepsakeMessage, W / 2, 560, W - 2 * m - 100, 60);

    // date
    ctx.font = 'italic 38px Georgia, serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(formatToday(), W / 2, H - 200);

    ctx.font = '34px Georgia, serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('— and so our forever begins —', W / 2, H - 140);

    const link = document.createElement('a');
    link.download = `our-moment-${PERSON_NAME}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let yy = y;
    for (let n = 0; n < words.length; n++) {
        const test = line + words[n] + ' ';
        if (ctx.measureText(test).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, yy);
            line = words[n] + ' ';
            yy += lineHeight;
        } else {
            line = test;
        }
    }
    ctx.fillText(line.trim(), x, yy);
}
