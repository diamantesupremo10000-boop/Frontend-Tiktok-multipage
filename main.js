/* main.js — Behavior: menu toggle, carousel, filters, form validation, small accessibility helpers. */
document.addEventListener('DOMContentLoaded', () => {
  // Update years in footer
  const year = new Date().getFullYear();
  for (let i=1;i<=6;i++){
    const el = document.getElementById('year'+(i===1? '' : i));
    if (el) el.textContent = year;
  }
  const year0 = document.getElementById('year');
  if (year0) year0.textContent = year;

  // Nav toggle for small screens
  const navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const menuId = btn.getAttribute('aria-controls') || btn.nextElementSibling?.id;
      const menu = menuId ? document.getElementById(menuId) : btn.nextElementSibling;
      if (menu) menu.style.display = expanded ? 'none' : 'flex';
    });
  });

  // Simple carousel
  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(car => {
    const track = car.querySelector('.carousel-track');
    const prev = car.querySelector('.carousel-prev');
    const next = car.querySelector('.carousel-next');
    if (!track) return;
    const step = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : 260;
    prev?.addEventListener('click', () => track.scrollBy({left:-step, behavior:'smooth'}));
    next?.addEventListener('click', () => track.scrollBy({left:step, behavior:'smooth'}));
  });

  // Publications filters (client-side simple)
  const pubList = document.getElementById('pub-list');
  if (pubList) {
    const typeSel = document.getElementById('filter-type');
    const topicSel = document.getElementById('filter-topic');
    const q = document.getElementById('filter-search');
    const apply = () => {
      const t = typeSel?.value || 'all';
      const top = topicSel?.value || 'all';
      const qv = q?.value?.toLowerCase?.() || '';
      Array.from(pubList.children).forEach(li => {
        const matchesType = t === 'all' || li.dataset.type === t;
        const matchesTopic = top === 'all' || li.dataset.topic === top;
        const text = (li.textContent || '').toLowerCase();
        const matchesQuery = qv === '' || text.includes(qv);
        li.style.display = (matchesType && matchesTopic && matchesQuery) ? '' : 'none';
      });
    };
    [typeSel, topicSel].forEach(el => el && el.addEventListener('change', apply));
    q && q.addEventListener('input', debounce(apply, 180));
  }

  // Contact form validation
  const form = document.getElementById('contact');
  if (form){
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      clearErrors();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      let ok = true;
      if (!name.value.trim()){ setError('err-name','Por favor ingresa tu nombre'); ok=false; }
      if (!validateEmail(email.value)){ setError('err-email','Introduce un correo válido'); ok=false; }
      if (message.value.trim().length < 10){ setError('err-message','Mensaje demasiado corto'); ok=false; }

      const status = document.getElementById('form-status');
      if (!ok){ if(status) status.textContent = 'Hay errores en el formulario.'; return; }
      // Simulate success (no backend)
      if(status) status.textContent = 'Mensaje enviado (simulado). Gracias.';
      form.reset();
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const el = document.querySelector(href);
      if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); el.focus({preventScroll:true}); }
    });
  });

  // helpers
  function setError(id,msg){
    const el = document.getElementById(id);
    if (el){ el.textContent = msg; const input = el.previousElementSibling || document.querySelector(`#${id.replace('err-','')}`); if (input) input.setAttribute('aria-invalid','true'); }
  }
  function clearErrors(){
    document.querySelectorAll('.form-error').forEach(e=> e.textContent='');
    document.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
  }
  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function debounce(fn, wait){
    let t; return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); };
  }
});