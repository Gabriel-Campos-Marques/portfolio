/**
 * GABRIEL MARQUES — CYBER-ENGINEERING PORTFOLIO
 * Interactive Cyber Scripts, Smooth Scroll & Screen Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberGridCanvas();
  initNavScroll();
  initScrollProgressBar();
  initSmoothScrollWithEffect();
  initMobileMenu();
  initThemeToggle();
  initScrollSpy();
  initCurrentYear();
});

/* ==========================================================================
   1. INTERACTIVE CYBER GRID CANVAS (Derived from capa-linkedin.jpeg)
   ========================================================================== */
function initCyberGridCanvas() {
  const canvas = document.getElementById('cyberGridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDist: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const isMobile = window.innerWidth <= 768;
    const divisor = isMobile ? 36000 : 18000;
    const count = Math.max(16, Math.floor((width * height) / divisor));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        radius: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.3 ? '#00e5ff' : '#3b82f6'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw Subtle Cyber Grid Lines
    const isLight = document.body.classList.contains('light-mode');
    const lineColor = isLight ? 'rgba(0, 150, 200, 0.04)' : 'rgba(0, 229, 255, 0.025)';
    const gridSize = 60;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect particles with cyan nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = isLight ? 0 : 8;
      ctx.shadowColor = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 110) * (isLight ? 0.08 : 0.16);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  resize();
  draw();
}

/* ==========================================================================
   2. NAVBAR SCROLL & BACKDROP
   ========================================================================== */
function initNavScroll() {
  const nav = document.getElementById('cyberNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR (Under Navbar)
   ========================================================================== */
function initScrollProgressBar() {
  const nav = document.getElementById('cyberNav');
  if (!nav) return;

  let progressBar = nav.querySelector('.cyber-scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'cyber-scroll-progress-bar';
    nav.appendChild(progressBar);
  }

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   4. SMOOTH SCROLL WITH SCREEN TRANSITION EFFECT
   ========================================================================== */
function initSmoothScrollWithEffect() {
  const links = document.querySelectorAll('a[href^="#"]');
  const nav = document.getElementById('cyberNav');

  // Create Cyber Nav Beam element for screen sweep effect
  let beam = document.querySelector('.cyber-nav-beam');
  if (!beam) {
    beam = document.createElement('div');
    beam.className = 'cyber-nav-beam';
    document.body.appendChild(beam);
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;

      const targetSection = document.querySelector(href);
      if (!targetSection) return;

      e.preventDefault();

      // 1. Trigger Screen Cyber Beam Flash Sweep
      beam.classList.remove('active');
      void beam.offsetWidth; // Trigger reflow for restart
      beam.classList.add('active');

      // 2. Pulse Highlight on the Target Section
      document.querySelectorAll('.section-target-highlight').forEach(el => el.classList.remove('section-target-highlight'));
      targetSection.classList.add('section-target-highlight');
      setTimeout(() => {
        targetSection.classList.remove('section-target-highlight');
      }, 1600);

      // 3. Calculate target position considering fixed navigation
      const navHeight = nav ? nav.offsetHeight : 76;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (navHeight + 14);

      // 4. Smoothly scroll to target
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });

      // 5. Update active link in navigation immediately
      document.querySelectorAll('.nav-item-link').forEach(l => l.classList.remove('active'));
      if (link.classList.contains('nav-item-link')) {
        link.classList.add('active');
      } else {
        const correspondingNav = document.querySelector(`.nav-item-link[href="${href}"]`);
        if (correspondingNav) correspondingNav.classList.add('active');
      }

      // 6. Close mobile menu if open
      if (window.closeMobileMenu) {
        window.closeMobileMenu();
      }

      // 7. Update URL without causing a jump
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE MENU & SIDE DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navDrawer = document.getElementById('navDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  if (!toggleBtn || !navDrawer) return;

  // Create or select backdrop overlay
  let backdrop = document.getElementById('menuBackdrop') || document.querySelector('.cyber-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'menuBackdrop';
    backdrop.className = 'cyber-menu-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    navDrawer.classList.add('active');
    backdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-times';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navDrawer.classList.remove('active');
    backdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    const icon = toggleBtn.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (navDrawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  backdrop.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
      closeMenu();
    }
  });

  // Make closeMenu available globally
  window.closeMobileMenu = closeMenu;
}

/* ==========================================================================
   6. THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('gm_cyber_theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
  }

  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('gm_cyber_theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    const icon = themeBtn.querySelector('i');
    if (!icon) return;
    if (isLight) {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }
}

/* ==========================================================================
   7. COPY TO CLIPBOARD HELPER & CYBER TOAST
   ========================================================================== */
window.copyToClipboard = function(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCyberToast(`${label} copiado com sucesso!`);
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showCyberToast(`${label} copiado com sucesso!`);
  } catch (err) {
    showCyberToast('Não foi possível copiar automaticamente.');
  }
  document.body.removeChild(textArea);
}

function showCyberToast(message) {
  const toast = document.getElementById('cyberToast');
  const textElem = document.getElementById('toastMsg');
  if (!toast) return;

  if (textElem) textElem.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   8. SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');
  const nav = document.getElementById('cyberNav');

  window.addEventListener('scroll', () => {
    const navHeight = nav ? nav.offsetHeight : 76;
    let currentId = '';
    const scrollY = window.pageYOffset + navHeight + 80;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = sectionId;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   9. CURRENT YEAR
   ========================================================================== */
function initCurrentYear() {
  const yr = document.getElementById('yearSpan');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }
}
