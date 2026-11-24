/* Hero background: small white constellations drifting over the night sky photo (assets/hero-sky.webp,
   set in CSS on .hero with a dark overlay). Canvas 2D, no dependency.
   The canvas sits behind the hero content (pointer-events: none); the mouse is followed on the hero,
   so buttons and the question bar stay clickable.
   Paused when the tab is hidden or the hero is off screen; static with prefers-reduced-motion. */
(function(){
  'use strict';

  /* ---------- Particles ---------- */
  const PARTICLES_DESKTOP = 220;
  const PARTICLES_MOBILE = 90;             // screens narrower than MOBILE_WIDTH
  const MOBILE_WIDTH = 640;
  const CLUSTERS = 20;                     // small groups drifting together (fewer on phones)
  const CLUSTERED_SHARE = 0.55;            // share of particles born in a group (the rest are loose)
  const CLUSTER_SPREAD = 60;               // px around a group centre
  const PARTICLE_SIZE = [1.4, 2.6];            // radius, px
  const PARTICLE_OPACITY = [0.85, 1];
  const PARTICLE_COLOR = '255,255,255';
  const SPEED = [0.1, 0.3];                // px per frame at 60 fps: very slow drift

  /* ---------- Links: short, so they only join close points into small triangles ---------- */
  const LINK_DISTANCE = 105;                // px
  const LINK_COLOR = '255,255,255';
  const LINK_OPACITY = 0.6;               // at distance 0, fades to 0 at LINK_DISTANCE
  const LINK_WIDTH = 0.9;

  /* ---------- Mouse ---------- */
  const MOUSE_RADIUS = 140;                // px
  const MOUSE_LINK_COLOR = '255,255,255';
  const MOUSE_LINK_OPACITY = 0.75;
  const MOUSE_LINK_WIDTH = 1;
  const MOUSE_PULL = 0.002;                // gentle attraction (negative = soft repulsion)
  const CLICK_PARTICLES = [3, 4];
  const MAX_PARTICLES = 280;

  const hero = document.getElementById('top');
  const cv = document.getElementById('neural');
  if (!hero || !cv || !cv.getContext) return;
  const g = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, particles = [];
  let mouse = null, onScreen = true, frame = 0, last = 0;
  const rand = (a, b) => a + Math.random() * (b - a);

  function particle(x, y, vx, vy){
    const angle = Math.random() * Math.PI * 2, speed = rand(SPEED[0], SPEED[1]);
    return {
      x: x ?? Math.random() * W, y: y ?? Math.random() * H,
      vx: vx ?? Math.cos(angle) * speed, vy: vy ?? Math.sin(angle) * speed,
      r: rand(PARTICLE_SIZE[0], PARTICLE_SIZE[1]), a: rand(PARTICLE_OPACITY[0], PARTICLE_OPACITY[1]),
    };
  }

  // Part of the particles start in small groups sharing one drift direction: they read as constellations
  function makeParticles(){
    const mobile = W < MOBILE_WIDTH, count = mobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP;
    const clustered = Math.round(count * CLUSTERED_SHARE), list = [];
    const groups = Array.from({length: mobile ? Math.ceil(CLUSTERS / 2) : CLUSTERS}, () => {
      const angle = Math.random() * Math.PI * 2, speed = rand(SPEED[0], SPEED[1]);
      return {x: Math.random() * W, y: Math.random() * H, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
    });
    for (let i = 0; i < clustered; i++){
      const c = groups[i % groups.length], d = Math.random() * CLUSTER_SPREAD, t = Math.random() * Math.PI * 2;
      list.push(particle(c.x + Math.cos(t) * d, c.y + Math.sin(t) * d, c.vx + rand(-0.02, 0.02), c.vy + rand(-0.02, 0.02)));
    }
    for (let i = clustered; i < count; i++) list.push(particle());
    return list;
  }

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newW = hero.clientWidth, newH = hero.clientHeight, widthChanged = newW !== W;
    W = newW; H = newH;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // A height-only change is the mobile address bar: keep the same particles
    if (widthChanged || !particles.length) particles = makeParticles();
    if (!running()) draw();
  }

  function move(dt){
    for (const p of particles){
      if (mouse){
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < MOUSE_RADIUS && d > 1){ p.vx += dx / d * MOUSE_PULL * dt; p.vy += dy / d * MOUSE_PULL * dt; }
      }
      const s = Math.hypot(p.vx, p.vy) || 1, k = Math.min(SPEED[1], Math.max(SPEED[0], s)) / s;
      p.vx *= k; p.vy *= k;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const m = 12;   // leave on one side, come back on the other
      if (p.x < -m) p.x = W + m; else if (p.x > W + m) p.x = -m;
      if (p.y < -m) p.y = H + m; else if (p.y > H + m) p.y = -m;
    }
  }

  function draw(){
    g.clearRect(0, 0, W, H);

    const L2 = LINK_DISTANCE * LINK_DISTANCE;
    g.lineWidth = LINK_WIDTH;
    for (let i = 0; i < particles.length; i++){
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++){
        const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > L2) continue;
        g.strokeStyle = `rgba(${LINK_COLOR},${(1 - Math.sqrt(d2) / LINK_DISTANCE) * LINK_OPACITY})`;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      }
    }

    if (mouse){
      g.lineWidth = MOUSE_LINK_WIDTH;
      for (const p of particles){
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d > MOUSE_RADIUS) continue;
        g.strokeStyle = `rgba(${MOUSE_LINK_COLOR},${(1 - d / MOUSE_RADIUS) * MOUSE_LINK_OPACITY})`;
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(mouse.x, mouse.y); g.stroke();
      }
    }

    for (const p of particles){
      g.fillStyle = `rgba(${PARTICLE_COLOR},${p.a})`;
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill();
    }
  }

  /* ---------- Loop: only while the tab is visible and the hero on screen ---------- */
  const running = () => !reduce && onScreen && !document.hidden;
  function loop(t){
    frame = 0;
    if (!running()) return;
    const dt = Math.min(3, (t - (last || t)) / 16.67 || 1);   // 1 = one 60 fps frame
    last = t;
    move(dt);
    draw();
    frame = requestAnimationFrame(loop);
  }
  function start(){ if (running() && !frame){ last = 0; frame = requestAnimationFrame(loop); } }

  if ('IntersectionObserver' in window){
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; start(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', start);

  /* ---------- Mouse: followed on the hero; a click on empty space adds a few particles ---------- */
  const local = e => { const r = hero.getBoundingClientRect(); return {x: e.clientX - r.left, y: e.clientY - r.top}; };
  hero.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') mouse = local(e); }, {passive: true});
  hero.addEventListener('pointerleave', () => { mouse = null; });
  hero.addEventListener('click', e => {
    if (e.target.closest('a, button, input, textarea, select, label, form, nav')) return;
    const {x, y} = local(e), n = Math.round(rand(CLICK_PARTICLES[0], CLICK_PARTICLES[1]));
    for (let i = 0; i < n && particles.length < MAX_PARTICLES; i++) particles.push(particle(x + rand(-8, 8), y + rand(-8, 8)));
    if (!running()) draw();
  });

  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

  resize();
  start();
})();
