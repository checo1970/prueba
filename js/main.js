/* ===== main.js ===== */

// Navbar: active link & scroll effect
(function () {
  const navbar   = document.querySelector('.navbar');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const current  = location.pathname.split('/').pop() || 'index.html';

  // Mark active link
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Close nav when clicking a link (mobile)
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      toggle && toggle.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
    });
  });
})();

// Animated counters in stats strip
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const run = el => {
    const target   = +el.dataset.count;
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const step     = Math.ceil(duration / target);
    let count = 0;

    const timer = setInterval(() => {
      count += Math.max(1, Math.ceil(target / 60));
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = count + suffix;
    }, step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); observer.unobserve(e.target); } });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// Skill bars animation
(function () {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
})();

// FAQ accordion
(function () {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn && btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// Contact form validation
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');

  const rules = {
    name:    { required: true, minLen: 2 },
    email:   { required: true, email: true },
    subject: { required: true },
    message: { required: true, minLen: 10 },
  };

  function showError(field, msg) {
    field.classList.add('error');
    let errEl = field.parentElement.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'form-error';
      field.after(errEl);
    }
    errEl.textContent = msg;
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.parentElement.querySelector('.form-error');
    if (errEl) errEl.textContent = '';
  }

  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;
    const val = field.value.trim();

    if (rule.required && !val) { showError(field, 'Este campo es obligatorio.'); return false; }
    if (rule.minLen && val.length < rule.minLen) { showError(field, `Mínimo ${rule.minLen} caracteres.`); return false; }
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(field, 'Ingresa un correo válido.'); return false; }

    clearError(field);
    return true;
  }

  // Live validation
  Object.keys(rules).forEach(name => {
    const field = form.elements[name];
    if (field) field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(name => {
      const field = form.elements[name];
      if (field && !validateField(field)) valid = false;
    });

    if (valid) {
      successMsg && successMsg.classList.add('visible');
      form.reset();
      setTimeout(() => successMsg && successMsg.classList.remove('visible'), 5000);
    }
  });
})();
