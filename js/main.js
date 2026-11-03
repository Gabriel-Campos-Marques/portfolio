/**
 * GABRIEL MARQUES — CONTEMPORARY MINIMALIST PORTFOLIO
 * Linear / Vercel / Raycast Interactive Behaviors
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCardSpotlight();
  initMobileNav();
  initScrollSpy();
  initCommandPalette();
  initYear();
});

/* ==========================================================================
   1. THEME TOGGLE (OBSIDIAN DARK DEFAULT / EDITORIAL LIGHT)
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('gm_minimal_theme') || 'dark';

  if (saved === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('gm_minimal_theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  if (!icon) return;
  icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
}

/* ==========================================================================
   2. SUBTLE MOUSE SPOTLIGHT ON SURFACE CARDS (LINEAR STYLE)
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.surface-card');
  if (!cards.length) return;

  document.addEventListener('mousemove', (e) => {
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('navLinks');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/* ==========================================================================
   4. SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ==========================================================================
   5. COMMAND PALETTE (⌘K / CTRL+K — RAYCAST STYLE)
   ========================================================================== */
function initCommandPalette() {
  const trigger = document.getElementById('cmdTrigger');
  const backdrop = document.getElementById('cmdBackdrop');
  const input = document.getElementById('cmdInput');
  const items = Array.from(document.querySelectorAll('.cmd-item'));

  if (!backdrop || !input) return;

  let selectedIndex = 0;

  function getVisibleItems() {
    return items.filter(item => item.style.display !== 'none');
  }

  function updateSelection() {
    const visible = getVisibleItems();
    visible.forEach((item, idx) => {
      item.classList.toggle('selected', idx === selectedIndex);
    });
  }

  function openCmd() {
    backdrop.classList.add('open');
    input.value = '';
    filterItems('');
    selectedIndex = 0;
    updateSelection();
    setTimeout(() => input.focus(), 40);
  }

  function closeCmd() {
    backdrop.classList.remove('open');
  }

  function filterItems(query) {
    const q = query.trim().toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
      const match = !q || text.includes(q) || keywords.includes(q);
      item.style.display = match ? 'flex' : 'none';
    });
    selectedIndex = 0;
    updateSelection();
  }

  function executeItem(item) {
    if (!item) return;
    const action = item.getAttribute('data-action');
    const target = item.getAttribute('data-target');

    closeCmd();

    if (action === 'scroll' && target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'link' && target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else if (action === 'copy-email') {
      window.copyToClipboard('gabriel@gmdevwoks.com.br', 'E-mail');
    } else if (action === 'copy-phone') {
      window.copyToClipboard('+5519984291707', 'WhatsApp');
    } else if (action === 'theme') {
      toggleTheme();
    }
  }

  if (trigger) {
    trigger.addEventListener('click', openCmd);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeCmd();
  });

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  items.forEach(item => {
    item.addEventListener('click', () => executeItem(item));
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closeCmd();
      } else {
        openCmd();
      }
      return;
    }

    if (!backdrop.classList.contains('open')) return;

    const visible = getVisibleItems();
    if (e.key === 'Escape') {
      e.preventDefault();
      closeCmd();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visible.length) {
        selectedIndex = (selectedIndex + 1) % visible.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (visible.length) {
        selectedIndex = (selectedIndex - 1 + visible.length) % visible.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visible[selectedIndex]) {
        executeItem(visible[selectedIndex]);
      }
    }
  });
}

/* ==========================================================================
   6. CLIPBOARD COPY & MINIMAL TOAST
   ========================================================================== */
window.copyToClipboard = function(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copiado para a área de transferência`);
    }).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`${label} copiado para a área de transferência`);
  } catch (_) {
    showToast('Não foi possível copiar automaticamente');
  }
  document.body.removeChild(ta);
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   7. CURRENT YEAR
   ========================================================================== */
function initYear() {
  const el = document.getElementById('yearSpan');
  if (el) el.textContent = new Date().getFullYear();
}
