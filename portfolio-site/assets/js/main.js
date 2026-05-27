// Basic interactions: nav toggle, theme, filters, modal, smooth scroll
(function(){
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  navToggle && navToggle.addEventListener('click', ()=>{
    nav.classList.toggle('open');
  });

  // Theme toggle (persist in localStorage)
  const themeToggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  if(stored === 'light') document.body.classList.add('light');
  if(themeToggle) themeToggle.textContent = document.body.classList.contains('light') ? '🌞' : '🌙';
  themeToggle && themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '🌞' : '🌙';
  });

  // Year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Dynamic subtitle rotation
  const subtitleEl = document.getElementById('dynamic-subtitle');
  if(subtitleEl) {
    const subtitles = [
      'Software Engineering Student',
      'Android Developer',
      'Problem Solver',
      'Full-Stack Developer',
      'Lifelong Learner'
    ];
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % subtitles.length;
      subtitleEl.textContent = subtitles[currentIndex];
      subtitleEl.style.animation = 'none';
      setTimeout(() => {
        subtitleEl.style.animation = 'fadeIn 0.5s ease-in';
      }, 10);
    }, 3000);
  }

  // Scroll progress bar
  const progressBar = document.getElementById('scroll-progress-bar');
  const updateProgress = ()=>{
    if(!progressBar) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const percent = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    progressBar.style.width = `${percent}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href && href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        nav && nav.classList.remove('open');
      }
    });
  });

  const isHomePage = (location.pathname.split('/').pop() || 'index.html') === 'index.html';
  const navLinks = Array.from(document.querySelectorAll('.nav a'));

  function setActiveLink(activeHref){
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if(href === activeHref || href.endsWith(activeHref)) link.classList.add('active');
    });
  }

  if(isHomePage){
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if(sections.length){
      const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const id = `#${entry.target.id}`;
            setActiveLink(id);
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0.1 });
      sections.forEach(section => observer.observe(section));
      setActiveLink('#home');
    }
  } else {
    const current = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const targetFile = href.split('/').pop().split('#')[0];
      if(targetFile === current) link.classList.add('active');
    });
  }

  // Reveal on scroll
  const revealItems = document.querySelectorAll('[data-reveal], .section-reveal, .reveal');
  if('IntersectionObserver' in window && revealItems.length){
    const revealObserver = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  // Typing animation
  const typingEl = document.getElementById('typing-text');
  if(typingEl){
    const phrases = ['Android Developer', 'Problem Solver', 'Lifelong Learner'];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = ()=>{
      const phrase = phrases[phraseIndex];
      if(!deleting){
        charIndex += 1;
        typingEl.textContent = phrase.slice(0, charIndex);
        if(charIndex === phrase.length){
          deleting = true;
          setTimeout(type, 1200);
          return;
        }
      } else {
        charIndex -= 1;
        typingEl.textContent = phrase.slice(0, charIndex);
        if(charIndex === 0){
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 60 : 110);
    };
    typingEl.textContent = '';
    setTimeout(type, 450);
  }

  // Project filters
  const filters = document.querySelectorAll('.filter');
  filters.forEach(f=>f.addEventListener('click', ()=>{
    filters.forEach(b=>b.classList.remove('active'));
    f.classList.add('active');
    const filter = f.dataset.filter;
    document.querySelectorAll('.project').forEach(p=>{
      p.style.display = (filter==='all' || p.dataset.type===filter) ? 'flex' : 'none';
    });
  }));

  // Project modal
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  document.querySelectorAll('.project .btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const slug = btn.dataset.slug || 'project';
      openModal(slug);
    });
  });
  modalClose && modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  function openModal(slug){
    if(!modal || !modalBody) return;
    modalBody.innerHTML = `<h3>${slug.replace(/-/g,' ')}</h3><p>This is a demo project detail. Replace with your project content, screenshots, and links.</p>`;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ if(modal) modal.setAttribute('aria-hidden','true'); }

  // Contact form: attach handler always, dynamically load EmailJS if needed
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    async function loadEmailJSSDK() {
      if (typeof emailjs !== 'undefined') return;
      // Try local copy first to avoid third-party tracking/storage blocks
      const localSrc = '/assets/js/emailjs.min.js';
      const cdnSrc = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';

      function load(src){
        return new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            if (existing.getAttribute('data-loaded') === 'true') return resolve();
            existing.addEventListener('load', () => { existing.setAttribute('data-loaded','true'); resolve(); });
            existing.addEventListener('error', () => reject(new Error('EmailJS SDK failed to load: '+src)));
            return;
          }
          const s = document.createElement('script');
          s.src = src;
          s.async = true;
          s.onload = () => { s.setAttribute('data-loaded','true'); resolve(); };
          s.onerror = () => reject(new Error('EmailJS SDK failed to load: '+src));
          document.head.appendChild(s);
        });
      }

      // Try local file then multiple CDN paths (some distributions use different filenames)
      const cdnCandidates = [localSrc, cdnSrc, 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js', 'https://unpkg.com/@emailjs/browser@3/dist/email.min.js'];
      let lastErr = null;
      for (const src of cdnCandidates) {
        try {
          await load(src);
          return;
        } catch (err) {
          lastErr = err;
          // try next
        }
      }
      throw lastErr || new Error('EmailJS SDK failed to load from all known locations');
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // always prevent native submit
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      try {
        // Ensure EmailJS SDK is available
        if (typeof emailjs === 'undefined') {
          await loadEmailJSSDK();
        }

        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS SDK not available');
        }

        // Initialize EmailJS (public key already included in code)
        try { emailjs.init('nQEnXXpqX7Y_Ix9fj'); } catch (initErr) { /* ignore if already initialized */ }

        const formData = new FormData(contactForm);
        const payload = {
          to_email: 'nimashisankhapala@gmail.com',
          from_name: formData.get('name') || 'Anonymous',
          from_email: formData.get('email') || '',
          message: formData.get('message') || '',
          reply_to: formData.get('email') || ''
        };

        const response = await emailjs.send('service_al3xyet', 'template_pmkdgte', payload);

        // EmailJS returns an object; some environments respond with status, others don't.
        if ((response && response.status === 200) || response === 'OK' || response === undefined) {
          contactForm.reset();
          showSuccessModal();
        } else {
          console.warn('Unexpected EmailJS response:', response);
          // still treat as success for many EmailJS setups, but notify if not
          showSuccessModal();
        }
      } catch (error) {
        console.error('Email send failed:', error);
        // Try to extract a helpful message from EmailJS response wrapper
        let errText = (error && (error.text || error.message)) ? (error.text || error.message) : String(error);
        // Show specific error if available, otherwise a generic troubleshooting hint
        alert('Failed to send message: ' + errText + '\n\nCheck Service ID / Template ID / Public Key and EmailJS dashboard email history.');
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Success modal functions
  function showSuccessModal(){
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('success-modal-close');
    if(modal) modal.setAttribute('aria-hidden', 'false');
    
    if(closeBtn){
      closeBtn.addEventListener('click', ()=>{
        if(modal) modal.setAttribute('aria-hidden', 'true');
      });
    }
    
    if(modal){
      modal.addEventListener('click', (e)=>{
        if(e.target === modal) modal.setAttribute('aria-hidden', 'true');
      });
    }

    // Auto close after 5 seconds
    setTimeout(()=>{
      if(modal) modal.setAttribute('aria-hidden', 'true');
    }, 5000);
  }
})();
