/**
 * Behavior Change Biology Hackathon 2027
 * Interactive Behaviors & Modular UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
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
  const triggers = document.querySelectorAll('.hero-image-wrap, .venue-photo-wrap, .past-photo-wrap, .about-image-wrap');
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
 * 8. Biological Neural Network Constellation (Hero Section)
 * Renders delicate neural nodes connected with synaptic lines,
 * echoing the Brain-Behavior neuroscience motif.
 */
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroSection = canvas.closest('.hero') || canvas.parentElement;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let nodes = [];

  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    radius: 140
  };

  const palette = [
    { r: 56, g: 189, b: 248 },  // Cyan
    { r: 96, g: 165, b: 250 },  // Sky Blue
    { r: 45, g: 175, b: 165 },  // Neural Teal
    { r: 129, g: 140, b: 248 }  // Indigo Soft
  ];

  function resize() {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    createNodes();
  }

  function createNodes() {
    nodes = [];
    const count = width < 768 ? 24 : 46;

    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const isHub = Math.random() < 0.2;
      const baseRadius = isHub ? (Math.random() * 3 + 3.5) : (Math.random() * 2 + 1.8);

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseRadius: baseRadius,
        radius: baseRadius,
        color: color,
        isHub: isHub,
        alpha: isHub ? (Math.random() * 0.3 + 0.4) : (Math.random() * 0.25 + 0.25),
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  const maxDist = 135;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }
    }

    // Update positions & draw connections
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      const n = nodes[i];
      n.pulsePhase += n.pulseSpeed;
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -10) n.x = width + 10;
      if (n.x > width + 10) n.x = -10;
      if (n.y < -10) n.y = height + 10;
      if (n.y > height + 10) n.y = -10;

      // Mouse gentle influence
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 1.2;
          n.y -= (dy / dist) * force * 1.2;
        }
      }

      // Synaptic connection lines between nodes
      for (let j = i + 1; j < len; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(125, 185, 240, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < len; i++) {
      const n = nodes[i];
      const pulse = Math.sin(n.pulsePhase) * 0.5 + 0.5;
      const currentR = n.baseRadius + pulse * 1.0;
      const currentA = n.alpha + pulse * 0.15;

      // Hub outer soft glow
      if (n.isHub) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentR * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${currentA * 0.25})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, currentR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${currentA})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(draw);
  }

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

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

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

