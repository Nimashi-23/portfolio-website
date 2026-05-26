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

  // Contact form: build a mailto link from form values and open user's email client
  const contactForm = document.querySelector('.contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || 'Anonymous';
      const fromEmail = formData.get('email') || '';
      const message = formData.get('message') || '';
      const to = 'nimashisankhapala@gmail.com';
      const subject = `Portfolio message from ${name}`;
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${fromEmail}`,
        '',
        message
      ];
      const body = bodyLines.join('\r\n');
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      // Open mail client with prefilled message
      window.location.href = mailto;
    });
  }
})();
