/* Hero background: night sky (radial gradient, faint milky way, ~200 stars) with drifting particles
   linked like constellations / a neural network. Canvas 2D, no dependency.
   The canvas sits behind the hero content (pointer-events: none); the mouse is followed on the hero,
   so buttons and the question bar stay clickable.
   Paused when the tab is hidden or the hero is off screen; static with prefers-reduced-motion. */
(function(){
  'use strict';

  /* ---------- Sky ---------- */
  const SKY_CENTER = '#141c33';            // radial gradient: centre ...
  const SKY_EDGE = '#0a0f1e';              // ... to edges
  const PAGE_BG = '#0c0c0c';               // the hero bottom fades into the page colour (--bg)
  const MILKY_WAY_COLOR = '170,190,255';
  const MILKY_WAY_OPACITY = 0.1;           // 0.08-0.12: barely visible diagonal band
  const STARS = 200;                       // tiny fixed stars (fewer on small screens, see below)
  const STAR_SIZE = [0.5, 1];              // px
  const STAR_OPACITY = [0.2, 0.75];
  const STAR_COLOR = '225,232,255';
  const TWINKLING_SHARE = 0.3;             // share of stars that twinkle slowly
  const TWINKLE_SPEED = [0.0005, 0.0014];  // radians per ms

  /* ---------- Particles ---------- */
  const PARTICLES_DESKTOP = 120;
  const PARTICLES_MOBILE = 45;             // screens narrower than MOBILE_WIDTH
  const MOBILE_WIDTH = 640;
  const CLUSTERS = 9;                      // groups that drift together and read as constellations
  const CLUSTERED_SHARE = 0.6;             // share of particles born in a group (the rest are loose)
  const CLUSTER_SPREAD = 90;               // px around a group centre
  const PARTICLE_SIZE = [1.5, 3];          // radius, px
  const PARTICLE_OPACITY = [0.7, 1];
  const PARTICLE_COLOR = '255,255,255';
  const PARTICLE_GLOW = 4;                 // shadowBlur, px
  const TINTED_SHARE = 0.15;               // particles in the portfolio accent colours
  const TINT_COLORS = ['118,33,176', '0,166,166'];   // violet #7621B0, cyan #00A6A6
  const SPEED = [0.2, 0.45];               // px per frame at 60 fps: slow, never agitated

  /* ---------- Links ---------- */
  const LINK_DISTANCE = 140;               // px
  const LINK_COLOR = '255,255,255';
  const LINK_OPACITY = 0.45;               // at distance 0, fades to 0 at LINK_DISTANCE
  const LINK_WIDTH = 0.7;

  /* ---------- Mouse ---------- */
  const MOUSE_RADIUS = 160;                // px
  const MOUSE_LINK_COLOR = '77,124,255';   // accent #1F5BFF, slightly lightened to read on night blue
  const MOUSE_LINK_OPACITY = 0.85;
  const MOUSE_LINK_WIDTH = 1;
  const MOUSE_PULL = 0.003;                // gentle attraction (negative = soft repulsion)
  const CLICK_PARTICLES = [3, 4];
  const MAX_PARTICLES = 180;

  const hero = document.getElementById('top');
  const cv = document.getElementById('neural');
  if (!hero || !cv || !cv.getContext) return;
  const g = cv.getContext('2d');
  const sky = document.createElement('canvas');      // gradient + milky way + fixed stars, redrawn on resize only
  const sg = sky.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, dpr = 1, particles = [], twinkling = [];
  let mouse = null, onScreen = true, frame = 0, last = 0;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.random() * arr.length | 0];

  function particle(x, y, vx, vy){
    const angle = Math.random() * Math.PI * 2, speed = rand(SPEED[0], SPEED[1]);
    return {
      x: x ?? Math.random() * W, y: y ?? Math.random() * H,
      vx: vx ?? Math.cos(angle) * speed, vy: vy ?? Math.sin(angle) * speed,
      r: rand(PARTICLE_SIZE[0], PARTICLE_SIZE[1]), a: rand(PARTICLE_OPACITY[0], PARTICLE_OPACITY[1]),
      c: Math.random() < TINTED_SHARE ? pick(TINT_COLORS) : PARTICLE_COLOR,
    };
  }

  // Part of the particles start in groups sharing one drift direction, so constellations hold together a while
  function makeParticles(){
    const count = W < MOBILE_WIDTH ? PARTICLES_MOBILE : PARTICLES_DESKTOP;
    const clustered = Math.round(count * CLUSTERED_SHARE), list = [];
    const groups = Array.from({length: W < MOBILE_WIDTH ? Math.ceil(CLUSTERS / 2) : CLUSTERS}, () => {
      const angle = Math.random() * Math.PI * 2, speed = rand(SPEED[0], SPEED[1]);
      return {x: Math.random() * W, y: Math.random() * H, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed};
    });
    for (let i = 0; i < clustered; i++){
      const c = groups[i % groups.length], d = Math.random() * CLUSTER_SPREAD, t = Math.random() * Math.PI * 2;
      list.push(particle(c.x + Math.cos(t) * d, c.y + Math.sin(t) * d, c.vx + rand(-0.04, 0.04), c.vy + rand(-0.04, 0.04)));
    }
    for (let i = clustered; i < count; i++) list.push(particle());
    return list;
  }

  function paintSky(){
    sky.width = cv.width; sky.height = cv.height;
    sg.setTransform(dpr, 0, 0, dpr, 0, 0);
    // radial night blue, lighter in the centre
    const rg = sg.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.hypot(W, H) * 0.6);
    rg.addColorStop(0, SKY_CENTER); rg.addColorStop(1, SKY_EDGE);
    sg.fillStyle = rg; sg.fillRect(0, 0, W, H);
    // milky way: a soft diagonal band
    sg.save();
    sg.translate(W / 2, H / 2); sg.rotate(-0.42);
    const band = Math.max(W, H) * 0.22;
    const mg = sg.createLinearGradient(0, -band, 0, band);
    mg.addColorStop(0, `rgba(${MILKY_WAY_COLOR},0)`);
    mg.addColorStop(0.5, `rgba(${MILKY_WAY_COLOR},${MILKY_WAY_OPACITY})`);
    mg.addColorStop(1, `rgba(${MILKY_WAY_COLOR},0)`);
    sg.filter = 'blur(18px)';
    sg.fillStyle = mg; sg.fillRect(-W, -band, W * 2, band * 2);
    sg.restore();
    // stars: fixed ones baked here, twinkling ones drawn each frame
    const n = Math.round(STARS * Math.min(1, W * H / (1280 * 800)));
    twinkling = [];
    for (let i = 0; i < n; i++){
      const s = {x: Math.random() * W, y: Math.random() * H, r: rand(STAR_SIZE[0], STAR_SIZE[1]), a: rand(STAR_OPACITY[0], STAR_OPACITY[1])};
      if (!reduce && Math.random() < TWINKLING_SHARE){ s.phase = Math.random() * Math.PI * 2; s.speed = rand(TWINKLE_SPEED[0], TWINKLE_SPEED[1]); twinkling.push(s); continue; }
      sg.fillStyle = `rgba(${STAR_COLOR},${s.a})`;
      sg.beginPath(); sg.arc(s.x, s.y, s.r, 0, Math.PI * 2); sg.fill();
    }
    // bottom fade into the rest of the page
    const fg = sg.createLinearGradient(0, H * 0.82, 0, H);
    fg.addColorStop(0, 'rgba(12,12,12,0)'); fg.addColorStop(1, PAGE_BG);
    sg.fillStyle = fg; sg.fillRect(0, H * 0.82, W, H * 0.18);
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newW = hero.clientWidth, newH = hero.clientHeight, widthChanged = newW !== W;
    W = newW; H = newH;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintSky();
    // A height-only change is the mobile address bar: keep the same particles
    if (widthChanged || !particles.length) particles = makeParticles();
    if (!running()) draw(performance.now());
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

  function draw(t){
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(sky, 0, 0);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const s of twinkling){
      g.fillStyle = `rgba(${STAR_COLOR},${s.a * (0.55 + 0.45 * Math.sin(s.phase + t * s.speed))})`;
      g.beginPath(); g.arc(s.x, s.y, s.r, 0, Math.PI * 2); g.fill();
    }

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

    g.shadowBlur = PARTICLE_GLOW;
    for (const p of particles){
      g.fillStyle = g.shadowColor = `rgba(${p.c},${p.a})`;
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, Math.PI * 2); g.fill();
    }
    g.shadowBlur = 0;
  }

  /* ---------- Loop: only while the tab is visible and the hero on screen ---------- */
  const running = () => !reduce && onScreen && !document.hidden;
  function loop(t){
    frame = 0;
    if (!running()) return;
    const dt = Math.min(3, (t - (last || t)) / 16.67 || 1);   // 1 = one 60 fps frame
    last = t;
    move(dt);
    draw(t);
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
    if (!running()) draw(performance.now());
  });

  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

  resize();
  start();
})();
