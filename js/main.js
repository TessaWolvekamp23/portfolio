/**
 * TESSA WOLVEKAMP - PORTFOLIO INTERACTION LOGIC
 * Communication & Multimedia Design (CMD) - Avans Hogeschool
 * Slogan: "More than meets the eye."
 * Focus: Immersive Storytelling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation & Header Scroll State
  initNavigation();

  // 2. Active Link Highlighting
  highlightActiveLink();

  // 3. Scroll Reveal Animations
  initScrollReveals();

  // 4. Blooming Flowers Ambient Animation
  initFloralCanvas();

  // 5. Hero Project Showcase Card (Right side of Hero)
  initHeroShowcase();

  // 6. Lucky Bird Interactive Sprite Viewer (Forward Direction)
  initSpriteViewer();

  // 7. Playable Story Journey Experience ("The Discovery Lens")
  initWASDNavigation();

  // 8. Projects Filter on Projects Page
  initProjectFilter();

  // 9. Contact Form & Copy Email
  initContactInteractions();
});

/* -------------------------------------------------------------
   1. NAVIGATION & MOBILE MENU
   ------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen 
        ? `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* -------------------------------------------------------------
   2. ACTIVE LINK HIGHLIGHTING
   ------------------------------------------------------------- */
function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPath.startsWith('project-') && href === 'projects.html') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   ------------------------------------------------------------- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/* -------------------------------------------------------------
   4. BLOOMING FLOWERS ANIMATION ("Bloemen groeien animatie")
   Subtle floating blossoms and blooming petal trails
   ------------------------------------------------------------- */
function initFloralCanvas() {
  const container = document.querySelector('.hero-floral-canvas-wrap');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-floral-canvas';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  container.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let petals = [];

  function resize() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Color palette matching design system
  const colors = [
    'rgba(213, 85, 102, 0.45)', // primary pink
    'rgba(225, 180, 184, 0.55)', // secondary pink
    'rgba(188, 189, 127, 0.40)', // secondary green
    'rgba(95, 109, 61, 0.30)'    // primary green
  ];

  class Petal {
    constructor(x, y, isBloom = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.size = isBloom ? 1 : Math.random() * 8 + 6;
      this.maxSize = Math.random() * 10 + 10;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = isBloom ? (Math.random() - 0.5) * 0.8 : Math.random() * 0.5 + 0.3;
      this.growth = isBloom ? 0.4 : 0;
      this.opacity = isBloom ? 0.9 : Math.random() * 0.5 + 0.3;
      this.isBloom = isBloom;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.isBloom) {
        if (this.size < this.maxSize) {
          this.size += this.growth;
        }
        this.opacity -= 0.008;
      } else {
        if (this.y > height + 20) this.y = -20;
        if (this.x > width + 20) this.x = -20;
        if (this.x < -20) this.x = width + 20;
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      // Draw graceful organic petal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.5, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.5, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create ambient drifting petals
  for (let i = 0; i < 22; i++) {
    petals.push(new Petal());
  }

  // Unified leaf/petal bloom trigger for both Mouse Mode and WASD Mode
  window.spawnLeafBloom = function(clientX, clientY) {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      if (Math.random() < 0.32) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        petals.push(new Petal(x, y, true));
        if (petals.length > 60) {
          petals.splice(0, petals.length - 60);
        }
      }
    }
  };

  container.addEventListener('mousemove', (e) => {
    window.spawnLeafBloom(e.clientX, e.clientY);
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = petals.length - 1; i >= 0; i--) {
      petals[i].update();
      petals[i].draw(ctx);
      if (petals[i].isBloom && petals[i].opacity <= 0) {
        petals.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------
   5. HERO PROJECT SHOWCASE CARD (Automatic Cross-fader)
   Cycles strictly through the 3 project images smoothly
   ------------------------------------------------------------- */
function initHeroShowcase() {
  const showcaseContainer = document.querySelector('.hero-showcase-container');
  if (!showcaseContainer) return;

  const slides = showcaseContainer.querySelectorAll('.hero-showcase-slide');
  const dots = showcaseContainer.querySelectorAll('.showcase-dot');
  if (!slides.length) return;

  let currentIndex = 0;
  let intervalTimer = null;
  const cycleInterval = 4500; // 4.5 seconds per project image

  function goToSlide(index) {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    currentIndex = index;
  }

  function nextSlide() {
    const nextIdx = (currentIndex + 1) % slides.length;
    goToSlide(nextIdx);
  }

  function startAutoCycle() {
    if (intervalTimer) clearInterval(intervalTimer);
    intervalTimer = setInterval(nextSlide, cycleInterval);
  }

  function pauseAutoCycle() {
    if (intervalTimer) {
      clearInterval(intervalTimer);
      intervalTimer = null;
    }
  }

  // Dot navigation click
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(idx);
      startAutoCycle();
    });
  });

  // Clicking the showcase navigates to the active project
  showcaseContainer.addEventListener('click', () => {
    const activeSlide = slides[currentIndex];
    const targetUrl = activeSlide?.getAttribute('data-project-url');
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  });

  // Pause on hover
  showcaseContainer.addEventListener('mouseenter', pauseAutoCycle);
  showcaseContainer.addEventListener('mouseleave', startAutoCycle);

  // Initialize first slide and start timer
  goToSlide(0);
  startAutoCycle();
}

/* -------------------------------------------------------------
   6. LUCKY BIRD INTERACTIVE SPRITE ANIMATION VIEWER
   Plays in forward flight sequence!
   ------------------------------------------------------------- */
function initSpriteViewer() {
  const spriteBox = document.getElementById('lucky-bird-sprite');
  if (!spriteBox) return;

  const playBtn = document.getElementById('sprite-play-btn');
  const stepBtn = document.getElementById('sprite-step-btn');
  const speedBtn = document.getElementById('sprite-speed-btn');
  const frameDisplay = document.getElementById('sprite-frame-display');

  // The sprite sheet has 8 frames
  const totalFrames = 8;
  let currentFrame = 0;
  let isPlaying = true;
  let fps = 8; // 8 frames per second
  let timer = null;

  function updateFrame() {
    // Forward playback calculation:
    // Stepping backwards from index 7 down to 0 in background-position-x plays the wing stroke forward
    const forwardIndex = (totalFrames - 1) - currentFrame;
    const posX = (forwardIndex / (totalFrames - 1)) * 100;
    spriteBox.style.backgroundPosition = `${posX}% 50%`;
    if (frameDisplay) {
      frameDisplay.textContent = `Frame ${currentFrame + 1} / ${totalFrames}`;
    }
  }

  function nextFrame() {
    currentFrame = (currentFrame + 1) % totalFrames;
    updateFrame();
  }

  function startAnimation() {
    if (timer) clearInterval(timer);
    timer = setInterval(nextFrame, 1000 / fps);
    isPlaying = true;
    if (playBtn) playBtn.textContent = 'Pause Animation';
  }

  function pauseAnimation() {
    if (timer) clearInterval(timer);
    timer = null;
    isPlaying = false;
    if (playBtn) playBtn.textContent = 'Play Animation';
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) pauseAnimation();
      else startAnimation();
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      pauseAnimation();
      nextFrame();
    });
  }

  if (speedBtn) {
    const speeds = [4, 8, 14];
    let speedIdx = 1;
    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      fps = speeds[speedIdx];
      speedBtn.textContent = `Speed: ${fps === 4 ? 'Slow' : fps === 8 ? 'Normal' : 'Fast'}`;
      if (isPlaying) startAnimation();
    });
  }

  // Initial start
  updateFrame();
  startAnimation();
}

/* -------------------------------------------------------------
   7. PLAYABLE STORY JOURNEY ("The Discovery Lens")
   A non-intrusive, playable interactive exploration layer
   ------------------------------------------------------------- */
/* -------------------------------------------------------------
   7. PERMANENT PINK CURSOR & PERSISTENT WASD NAVIGATION
   - Pink dot cursor is visible ALL the time across the website
   - Mouse Mode (Default): Pink dot follows physical mouse via mousemove
   - WASD Mode: Pink dot is controlled via W/A/S/D keyboard input
   - Persists selected mode across pages via localStorage
   ------------------------------------------------------------- */
function initWASDNavigation() {
  const toggleButtons = document.querySelectorAll('.btn-mode-toggle, #wasd-mode-toggle');
  let cursorEl = document.getElementById('custom-cursor');
  let hudEl = document.getElementById('wasd-hud');

  if (!cursorEl) {
    cursorEl = document.createElement('div');
    cursorEl.id = 'custom-cursor';
    cursorEl.className = 'custom-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorEl);
  }
  if (!hudEl) {
    hudEl = document.createElement('div');
    hudEl.id = 'wasd-hud';
    hudEl.className = 'wasd-hud';
    hudEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(hudEl);
  }

  // Set HUD content with full and minimized states
  hudEl.innerHTML = '<span class="hud-full-text"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Move • <kbd>SPACE</kbd> Interact • <kbd>ESC</kbd> Mouse</span><span class="hud-mini-text"><kbd>WASD</kbd> Active</span>';

  let isWasdActive = false;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  const speed = 9.5;
  const keys = {
    KeyW: false, KeyA: false, KeyS: false, KeyD: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
  };
  let animId = null;
  let currentHoverElement = null;
  let minimizeTimeout = null;

  function scheduleHudMinimize() {
    if (minimizeTimeout) clearTimeout(minimizeTimeout);
    hudEl.classList.remove('minimized');
    minimizeTimeout = setTimeout(() => {
      if (isWasdActive) {
        hudEl.classList.add('minimized');
      }
    }, 3500);
  }

  hudEl.addEventListener('mouseenter', () => {
    hudEl.classList.remove('minimized');
  });

  hudEl.addEventListener('mouseleave', () => {
    if (isWasdActive) {
      scheduleHudMinimize();
    }
  });

  hudEl.addEventListener('click', () => {
    hudEl.classList.toggle('minimized');
  });

  function updateCursorPosition() {
    cursorEl.style.left = cursorX + 'px';
    cursorEl.style.top = cursorY + 'px';
    checkHover();

    // Trigger hero leaf/petal bloom in both Mouse Mode and WASD Mode
    if (typeof window.spawnLeafBloom === 'function') {
      window.spawnLeafBloom(cursorX, cursorY);
    }
  }

  function checkHover() {
    const target = document.elementFromPoint(cursorX, cursorY);
    const clickable = target ? target.closest('a, button, .btn, .nav-link, .project-filter-btn, .project-card, .hero-showcase-card, .showcase-dot, input, textarea, select, [tabindex], [role="button"], .hero-wasd-discover-chip') : null;

    // In WASD Mode, apply .wasd-hover to simulate visual hover on elements under the virtual cursor
    if (clickable !== currentHoverElement) {
      if (currentHoverElement) {
        currentHoverElement.classList.remove('wasd-hover');
      }
      currentHoverElement = clickable;
      if (currentHoverElement) {
        currentHoverElement.classList.add('wasd-hover');
      }
    }

    if (clickable) {
      cursorEl.classList.add('hovering');
    } else {
      cursorEl.classList.remove('hovering');
    }
  }

  function setMode(active, showNotice = true) {
    isWasdActive = active;
    document.body.classList.toggle('wasd-mode-active', isWasdActive);

    // Save mode to localStorage so it persists across page navigation
    try {
      localStorage.setItem('tessa_nav_mode', isWasdActive ? 'wasd' : 'mouse');
    } catch(e) {}

    toggleButtons.forEach(btn => {
      btn.classList.toggle('active', isWasdActive);
      btn.setAttribute('aria-pressed', isWasdActive ? 'true' : 'false');
      const icon = btn.querySelector('.mode-icon');
      const text = btn.querySelector('.mode-text');
      const tag = btn.querySelector('.mode-hint-tag');
      if (icon && text) {
        if (isWasdActive) {
          icon.textContent = '⌨️';
          text.textContent = 'WASD Mode';
          if (tag) tag.textContent = 'Active';
        } else {
          icon.textContent = '🖱️';
          text.textContent = 'Mouse Mode';
          if (tag) tag.textContent = 'Try WASD ✦';
        }
      }
    });

    if (isWasdActive) {
      updateCursorPosition();
      startLoop();
      scheduleHudMinimize();
      if (showNotice) showToast('WASD Mode Active: Use W/A/S/D to move, Space to interact, ESC to exit.');
    } else {
      stopLoop();
      Object.keys(keys).forEach(k => { keys[k] = false; });
      if (currentHoverElement) {
        currentHoverElement.classList.remove('wasd-hover');
        currentHoverElement = null;
      }
      if (minimizeTimeout) clearTimeout(minimizeTimeout);
      hudEl.classList.remove('minimized');
      if (showNotice) showToast('Mouse Mode Active: Physical mouse enabled.');
    }
  }

  function toggleMode() {
    setMode(!isWasdActive, true);
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMode();
    });
  });

  // Wire discoverability chips
  document.querySelectorAll('.hero-wasd-discover-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      setMode(true, true);
    });
  });

  function step() {
    if (!isWasdActive) return;

    let dx = 0;
    let dy = 0;

    if (keys.KeyW || keys.ArrowUp) dy -= speed;
    if (keys.KeyS || keys.ArrowDown) dy += speed;
    if (keys.KeyA || keys.ArrowLeft) dx -= speed;
    if (keys.KeyD || keys.ArrowRight) dx += speed;

    if (dx !== 0 || dy !== 0) {
      cursorX = Math.max(12, Math.min(window.innerWidth - 12, cursorX + dx));
      cursorY = Math.max(12, Math.min(window.innerHeight - 12, cursorY + dy));
      updateCursorPosition();

      // Viewport edge auto-scrolling
      const edgeThreshold = 80;
      const scrollSpeed = 12;
      if (cursorY < edgeThreshold) {
        window.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
      } else if (cursorY > window.innerHeight - edgeThreshold) {
        window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
      }
    }

    animId = requestAnimationFrame(step);
  }

  function startLoop() {
    if (!animId) animId = requestAnimationFrame(step);
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isTyping = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable);

    if (e.key === 'Escape' && isWasdActive) {
      setMode(false, true);
      return;
    }

    if (!isWasdActive) return;
    if (isTyping) return;

    if (e.code in keys) {
      e.preventDefault();
      keys[e.code] = true;
      scheduleHudMinimize();
    }

    if (e.code === 'Space') {
      e.preventDefault();
      cursorEl.classList.add('clicking');
      setTimeout(() => cursorEl.classList.remove('clicking'), 160);

      const target = document.elementFromPoint(cursorX, cursorY);
      if (target) {
        const clickable = target.closest('a, button, .btn, .nav-link, .project-filter-btn, .project-card, .hero-showcase-card, .showcase-dot, input, textarea, select, [tabindex], [role="button"], .hero-wasd-discover-chip');
        if (clickable) {
          if (clickable.tagName.toLowerCase() === 'input' || clickable.tagName.toLowerCase() === 'textarea') {
            clickable.focus();
          } else {
            clickable.click();
          }
        }
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
  });

  // Physical mouse controls pink cursor in Mouse Mode ONLY
  // When WASD Mode is active, physical mouse is completely disabled from moving cursor
  window.addEventListener('mousemove', (e) => {
    if (!isWasdActive) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      updateCursorPosition();
    }
  }, { passive: true });

  // In WASD Mode: Disable hardware mouse clicks on page elements
  // Except on the mode toggle button, allowing users to return to mouse mode at any time
  document.addEventListener('click', (e) => {
    if (isWasdActive) {
      if (e.target.closest('#wasd-mode-toggle, .btn-mode-toggle, .hero-wasd-discover-chip')) {
        return; // Allow clicking the toggle
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  document.addEventListener('mousedown', (e) => {
    if (!isWasdActive) {
      cursorEl.classList.add('clicking');
    } else {
      if (e.target.closest('#wasd-mode-toggle, .btn-mode-toggle, .hero-wasd-discover-chip')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  window.addEventListener('mouseup', () => {
    cursorEl.classList.remove('clicking');
  });

  // Load persisted navigation mode from localStorage (default: mouse for new visitors)
  try {
    const savedMode = localStorage.getItem('tessa_nav_mode');
    if (savedMode === 'wasd') {
      setMode(true, false);
    } else {
      setMode(false, false);
    }
  } catch(e) {
    setMode(false, false);
  }

  function showToast(message) {
    const toast = document.getElementById('toast-notice');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.filterable-project');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active', 'btn-2');
        b.classList.add('btn-2-secondary');
      });
      btn.classList.remove('btn-2-secondary');
      btn.classList.add('active', 'btn-2');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   9. CONTACT PAGE INTERACTIONS
   ------------------------------------------------------------- */
function initContactInteractions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notice');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'tessa.wolvekamp@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('tessa.wolvekamp@outlook.com');
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const name = contactForm.elements['name']?.value?.trim();
      const email = contactForm.elements['email']?.value?.trim();
      const subject = contactForm.elements['subject']?.value?.trim();
      const message = contactForm.elements['message']?.value?.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending message...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          contactForm.reset();
          showToast(data.message || 'Thanks! Your message has been sent.');
        } else {
          showToast(data.error || 'Something went wrong while sending your message. Please try again.');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        showToast('Something went wrong while sending your message. Please check your connection or email tessa.wolvekamp@outlook.com directly.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}
