/* ═══════════════════════════════════════════════
   ESCOLA DE MÚSICA ARENA RP — MAIN SCRIPTS
   ═══════════════════════════════════════════════ */

/* ─── NAV SCROLL ─────────────────────────────── */
(function(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const check = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

/* ─── MOBILE MENU ─────────────────────────────── */
(function(){
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('nav-overlay');
  if (!burger || !overlay) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── ACTIVE NAV LINK ─────────────────────────── */
(function(){
  const links = document.querySelectorAll('.nav-links a, .nav-overlay a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ─── SCROLL ANIMATIONS ───────────────────────── */
(function(){
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ─── CHAT WIDGET ─────────────────────────────── */
(function(){
  const btn = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
})();

/* ─── NUMBER COUNTER ──────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

(function(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.count));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
})();

/* ─── PARTICLES CANVAS ────────────────────────── */
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const notes = ['♩','♪','♫','♬','𝄞','🎵'];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 28 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vy: -0.3 - Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.15 + 0.05,
    size: 12 + Math.random() * 18,
    note: notes[Math.floor(Math.random() * notes.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = '#FFD000';
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillText(p.note, 0, 0);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (p.y < -30) { p.y = canvas.height + 30; p.x = Math.random() * canvas.width; }
      if (p.x < -30) p.x = canvas.width + 30;
      if (p.x > canvas.width + 30) p.x = -30;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── ACCORDION ───────────────────────────────── */
(function(){
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ─── TABS ────────────────────────────────────── */
(function(){
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]');
      if (!group) return;
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = group.querySelector(`[data-pane="${target}"]`);
      if (pane) pane.classList.add('active');
    });
  });
})();

/* ─── TOAST NOTIFICATION ──────────────────────── */
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(60px);
    background:${type==='success'?'#141414':'#1a0808'};
    border:1px solid ${type==='success'?'rgba(0,255,163,0.3)':'rgba(255,61,107,0.3)'};
    color:${type==='success'?'#00FFA3':'#FF3D6B'};
    padding:0.85rem 1.5rem;border-radius:50px;font-size:0.88rem;font-weight:600;
    z-index:9999;transition:transform 0.4s,opacity 0.4s;opacity:0;white-space:nowrap;
    font-family:'Space Grotesk',sans-serif;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(60px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ─── FORM SUBMIT (Contact) ───────────────────── */
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      showToast('✅ Mensagem enviada! Retornaremos em breve.');
      form.reset();
      btn.textContent = 'Enviar mensagem';
      btn.disabled = false;
    }, 1800);
  });
})();
