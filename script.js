// =============================================
// HEADER & NAVIGATION
// =============================================
const header = document.getElementById('main-header');
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('toggle');
});

// =============================================
// STECKBRIEF HORIZONTAL SCROLL
// =============================================
const track       = document.getElementById('steckbrief-track');
const progressFill = document.getElementById('sb-progress');

if (track) {
    const panels     = track.querySelectorAll('.sb-panel');
    const totalPanels = panels.length;

    function updateSteckbrief() {
        const section    = document.getElementById('steckbrief');
        if (!section) return;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const sectionH   = section.offsetHeight;

        let progress = (window.scrollY - sectionTop) / (sectionH - window.innerHeight);
        progress = Math.max(0, Math.min(1, progress));

        track.style.transform = `translateX(${progress * -(totalPanels - 1) * 100}vw)`;
        if (progressFill) progressFill.style.width = `${progress * 100}%`;
    }

    window.addEventListener('scroll', updateSteckbrief, { passive: true });
    window.addEventListener('resize', updateSteckbrief);
}

// =============================================
// TIMELINE — SCROLL-TRIGGERED ANIMATIONS
// =============================================
const tlItems    = document.querySelectorAll('[data-tl]');
const spineFill  = document.getElementById('timeline-spine-fill');

function updateTimeline() {
    if (!tlItems.length) return;

    // Animate individual items in
    tlItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.78;
        if (rect.top < triggerPoint) {
            item.classList.add('tl-visible');
        }
    });

    // Animate the spine fill based on section scroll progress
    if (spineFill) {
        const section = document.getElementById('sportlicher-weg');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;
        // Start filling when section enters, finish when section exits
        let progress = (-rect.top + window.innerHeight * 0.5) / (sectionH * 0.85);
        progress = Math.max(0, Math.min(1, progress));
        spineFill.style.height = `${progress * 100}%`;
    }
}

window.addEventListener('scroll', updateTimeline, { passive: true });
window.addEventListener('load', updateTimeline);

// =============================================
// CANVAS BACKGROUND (aktivierbar)
// =============================================
(function () {
    const c = document.getElementById('bg-canvas');
    if (!c) return;

    const ctx = c.getContext('2d');
    let W, H, t = 0;
    const mx  = { x: .5, y: .5 };
    const tgt = { x: .5, y: .5 };

    function resize() {
        W = c.width  = window.innerWidth;
        H = c.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { tgt.x = e.clientX / W; tgt.y = e.clientY / H; });

    const CLUSTERS = [
        { cx: .18, cy: .25 }, { cx: .72, cy: .18 }, { cx: .45, cy: .55 },
        { cx: .12, cy: .72 }, { cx: .80, cy: .65 }, { cx: .55, cy: .88 },
        { cx: .30, cy: .42 }, { cx: .88, cy: .38 }, { cx: .62, cy: .30 },
        { cx: .22, cy: .58 },
    ];

    const pts = Array.from({ length: 380 }, () => {
        const cl    = CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist  = Math.pow(Math.random(), .5) * .12;
        return {
            x: cl.cx + Math.cos(angle) * dist,
            y: cl.cy + Math.sin(angle) * dist,
            r: Math.random() * .9 + .2,
            speedX: (Math.random() - .5) * .00008,
            speedY: (Math.random() - .5) * .00008,
            driftAmp:  Math.random() * .003 + .001,
            driftFreq: Math.random() * .3   + .1,
            driftOff:  Math.random() * Math.PI * 2,
            depth:     Math.random() * .5   + .15,
            hue:       Math.round(Math.random() * 18 + 198),
            sat:       Math.round(Math.random() * 18 + 52),
            lig:       Math.round(Math.random() * 18 + 38),
            alpha:     Math.random() * .30  + .12,
        };
    });

    function draw() {
        t += 1;
        mx.x += (tgt.x - mx.x) * .04;
        mx.y += (tgt.y - mx.y) * .04;
        ctx.clearRect(0, 0, W, H);
        const bg = ctx.createLinearGradient(0, 0, W * .4, H);
        bg.addColorStop(0, '#d4ecf7'); bg.addColorStop(.5, '#b8ddf0'); bg.addColorStop(1, '#c5e5f4');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        for (const p of pts) {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < -.02) p.x = 1.02; if (p.x > 1.02) p.x = -.02;
            if (p.y < -.02) p.y = 1.02; if (p.y > 1.02) p.y = -.02;
            const drift = Math.sin(t * p.driftFreq * .01 + p.driftOff) * p.driftAmp;
            const px = (mx.x - .5) * p.depth * .022;
            const py = (mx.y - .5) * p.depth * .016;
            ctx.beginPath();
            ctx.arc((p.x + drift + px) * W, (p.y + py) * H, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lig}%,${p.alpha})`;
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();









// =============================================
// ERFOLGE — Scroll Reveal für Cards
// =============================================
 
function revealCards() {
    const cards = document.querySelectorAll('[data-reveal]');
    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
            card.classList.add('revealed');
        }
    });
}
 
window.addEventListener('scroll', revealCards, { passive: true });
window.addEventListener('load', revealCards);