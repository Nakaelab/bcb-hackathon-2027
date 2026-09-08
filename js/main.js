/**
 * Behavior Change Biology Hackathon 2027
 * Interactive Behaviors & Modular UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScheduleTabs();
  initFaqAccordion();
  initImageLightbox();
  initScrollAnimations();
  initHeroParticles();
});

/**
 * 1. Global Navigation & Mobile Menu
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile Menu Toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.classList.toggle('active');
    });

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
      });
    });
  }

  // Header background elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 4px 20px -2px rgba(27, 35, 51, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Smooth Active Nav Highlighting
  const sections = document.querySelectorAll('section[id]');
  const highlightCurrentNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightCurrentNav, { passive: true });
}


/**
 * 3. Schedule Tab Switching
 */
function initScheduleTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('hidden', 'true');
      });

      // Activate clicked tab
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.removeAttribute('hidden');
      }
    });
  });
}

/**
 * 4. FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Optional: Close other FAQs for cleaner reading
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 5. Entry Modal & Registration Form Handling
 */
function initEntryModal() {
  const modal = document.getElementById('entry-modal');
  const openButtons = document.querySelectorAll('[data-open-modal="entry"]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const entryForm = document.getElementById('entry-form');
  const toast = document.getElementById('toast-msg');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (entryForm) {
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(entryForm);
      const data = Object.fromEntries(formData.entries());

      // Save locally to simulate registration state
      try {
        const registrations = JSON.parse(localStorage.getItem('hackathon2027_entries') || '[]');
        registrations.push({ ...data, date: new Date().toISOString() });
        localStorage.setItem('hackathon2027_entries', JSON.stringify(registrations));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      closeModal();
      entryForm.reset();

      // Show toast confirmation
      showToast('参加事前登録を受け付けました。ご案内メールをお送りします。');
    });
  }

  function showToast(message) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/**
 * 6. Subtle Scroll Reveal Animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.tech-card, .pillar-card, .guide-box, .step-card, .member-card, .host-box'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }
}

/**
 * 7. Photo Lightbox (Hero & Venue photos)
 */
function initImageLightbox() {
  const triggers = document.querySelectorAll('.hero-image-wrap, .venue-photo-wrap');
  const lightbox = document.getElementById('image-lightbox');
  if (!triggers.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 8. Antigravity-Style Ambient Floating Orbs (Hero Section Only)
 * True to antigravity.google: Soft, organic, morphing blurred light spheres
 * that slowly drift, breathe in size and opacity, and gently steer away from the cursor.
 * NO connecting web lines. Clean, modern, atmospheric depth.
 */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroSection = canvas.closest('.hero') || canvas.parentElement;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let orbs = [];

  // Mouse tracking with smooth damping
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    radius: 180
  };

  // Color palette matching Antigravity & Behavior Change Biology:
  // Soft Google Blue, Neural Teal, Bio Mint, Lavender
  const palette = [
    { r: 13, g: 148, b: 136 },  // Neural Teal
    { r: 37, g: 99, b: 235 },   // Google Blue
    { r: 16, g: 185, b: 129 },  // Emerald / Bio Mint
    { r: 99, g: 102, b: 241 },  // Indigo
    { r: 56, g: 189, b: 248 }   // Cyan Sky
  ];

  function resize() {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    createOrbs();
  }

  function createOrbs() {
    orbs = [];
    // 12 to 20 large soft luminous floating spheres
    const count = width < 768 ? 10 : 16;

    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const baseRadius = (Math.random() * 90 + 60) * (width < 768 ? 0.7 : 1.0);

      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseRadius: baseRadius,
        currentRadius: baseRadius,
        radiusPulseSpeed: Math.random() * 0.015 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        color: color,
        maxAlpha: Math.random() * 0.22 + 0.12,
        alphaPulseSpeed: Math.random() * 0.01 + 0.005
      });
    }
  }

  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.02;

    // Smooth mouse damping
    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }
    }

    // Draw each floating glowing orb with radial gradients
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];

      // Organic subtle breathing motion
      orb.pulsePhase += orb.radiusPulseSpeed;
      const radiusOffset = Math.sin(orb.pulsePhase) * (orb.baseRadius * 0.18);
      orb.currentRadius = orb.baseRadius + radiusOffset;

      const alpha = orb.maxAlpha * (0.8 + 0.2 * Math.sin(time + i));

      // Drift motion
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Soft boundary wrap/turnaround with margin
      const margin = orb.baseRadius;
      if (orb.x < -margin) orb.x = width + margin;
      if (orb.x > width + margin) orb.x = -margin;
      if (orb.y < -margin) orb.y = height + margin;
      if (orb.y > height + margin) orb.y = -margin;

      // Gentle interactive repulsion from cursor (floating away smoothly)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius + orb.baseRadius) {
          const force = (mouse.radius + orb.baseRadius - dist) / (mouse.radius + orb.baseRadius);
          const angle = Math.atan2(dy, dx);
          orb.x -= Math.cos(angle) * force * 1.5;
          orb.y -= Math.sin(angle) * force * 1.5;
        }
      }

      // Render radial glow gradient (antigravity-like soft ambient sphere)
      const grad = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, Math.max(1, orb.currentRadius)
      );
      grad.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${alpha})`);
      grad.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);

      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, Math.max(1, orb.currentRadius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  // Mouse tracking inside hero section
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.x = null;
    mouse.y = null;
  });

  // Resize listener with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Pause when off-screen for battery/performance
  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) draw();
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection);
  } else {
    draw();
  }

  resize();
}

