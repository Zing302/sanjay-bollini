'use strict';

/* --- NAV SCROLL --- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* --- MOBILE MENU --- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});

/* --- TERMINAL ANIMATION --- */
const lines = [
  { type: 'cmd',     text: 'python quantum_password_gen.py' },
  { type: 'out',     text: '↳ Initializing 16-qubit circuit...', cls: 'info' },
  { type: 'out',     text: '↳ Applying Hadamard gates (|+⟩ state)', cls: '' },
  { type: 'out',     text: '↳ Measuring superposition states...', cls: '' },
  { type: 'out',     text: '↳ Mapping to charset [A-Za-z0-9!@#$%]', cls: '' },
  { type: 'blank' },
  { type: 'out',     text: '✓ Generated in 0.34s', cls: 'success' },
  { type: 'out',     text: '  Entropy: 128 bits (quantum-random)', cls: 'info' },
  { type: 'out',     text: '  Result:  xQ#7mK!2vR@9nZ$4p', cls: 'warn' },
  { type: 'blank' },
  { type: 'cmd',     text: 'python quantum_predictor.py --year 2026' },
  { type: 'out',     text: '↳ Loading NCAA stats (2010–2025)...', cls: '' },
  { type: 'out',     text: '↳ Encoding win-probs as amplitudes...', cls: 'info' },
  { type: 'out',     text: '↳ QUBO optimization (384 variables)...', cls: '' },
  { type: 'blank' },
  { type: 'out',     text: '✓ Optimal bracket found!', cls: 'success' },
];

const body = document.getElementById('terminalBody');
const cursor = document.getElementById('termCursor');
let lineIdx = 0;

function addLine(lineData) {
  const div = document.createElement('div');
  div.className = 't-line';
  if (lineData.type === 'blank') {
    div.innerHTML = '&nbsp;';
    body.appendChild(div);
    return;
  }
  if (lineData.type === 'cmd') {
    div.innerHTML = `<span class="t-prompt">$</span><span class="t-cmd"> ${escHtml(lineData.text)}</span>`;
  } else {
    const cls = lineData.cls ? ` ${lineData.cls}` : '';
    div.innerHTML = `<span class="t-out${cls}">${escHtml(lineData.text)}</span>`;
  }
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function runTerminal() {
  if (lineIdx >= lines.length) {
    // Loop after a pause
    setTimeout(() => {
      body.innerHTML = '';
      lineIdx = 0;
      setTimeout(runTerminal, 600);
    }, 4000);
    return;
  }
  const line = lines[lineIdx++];
  const delay = line.type === 'cmd' ? 90 : line.type === 'blank' ? 180 : 60;
  addLine(line);
  const pause = line.type === 'cmd' ? 700 : line.type === 'blank' ? 300 : 180;
  setTimeout(runTerminal, pause);
}

setTimeout(runTerminal, 800);

/* --- SCROLL REVEAL --- */
const reveals = document.querySelectorAll('.project-card, .about-bio, .about-timeline, .stack-group, .contact-left, .contact-form, .tl-group');

// Only animate if user hasn't requested reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  reveals.forEach(el => el.classList.add('reveal'));
}

// Hard fallback at 800ms — covers slow devices, headless browsers, etc.
const revealFallback = setTimeout(() => {
  reveals.forEach(el => el.classList.add('visible'));
}, 800);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 50);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

reveals.forEach(el => observer.observe(el));

/* --- ACTIVE NAV LINK --- */
const sections = document.querySelectorAll('section[id], .section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--sky)';
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* --- CONTACT FORM --- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sent!';
    btn.style.background = 'var(--emerald)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}
