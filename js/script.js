'use strict';
const EVENTS = [
  {id:1,name:'AI/ML Bootcamp',date:'2026-11-14T10:00:00+05:30',venue:'Seminar Hall A',cat:'Workshop',desc:'Hands-on introduction to supervised learning with scikit-learn.'},
  {id:2,name:'CodeSprint 24h Hackathon',date:'2026-12-05T09:00:00+05:30',venue:'Computer Lab 3',cat:'Hackathon',desc:'Build a working prototype in 24 hours with mentors on call.'},
  {id:3,name:'Industry Talk: GenAI in Production',date:'2026-12-18T15:00:00+05:30',venue:'Auditorium',cat:'Talk',desc:'Practitioners share lessons from shipping LLM products.'},
  {id:4,name:'Data Viz Workshop',date:'2027-01-22T11:00:00+05:30',venue:'Lab 5',cat:'Workshop',desc:'Turn raw datasets into clear, honest charts.'},
  {id:5,name:'Project Expo 2027',date:'2027-02-12T10:00:00+05:30',venue:'Main Atrium',cat:'Expo',desc:'Students demo semester projects to faculty and visitors.'},
  {id:6,name:'Tech Quiz Night',date:'2027-03-06T17:30:00+05:30',venue:'Seminar Hall B',cat:'Talk',desc:'Team quiz on CS, AI history and current tech news.'}
];
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = (d, o) => new Date(d).toLocaleString('en-IN', {timeZone:'Asia/Kolkata', ...o});

/* Dark / light mode */
const root = document.documentElement;
let saved = null; try { saved = localStorage.getItem('theme'); } catch(e){}
root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
$('#themeBtn').onclick = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch(e){}
};

/* Mobile navigation */
const menu = $('#menu'), mb = $('#menuBtn');
mb.onclick = () => mb.setAttribute('aria-expanded', menu.classList.toggle('open'));
$$('#menu a').forEach(a => a.onclick = () => { menu.classList.remove('open'); mb.setAttribute('aria-expanded','false'); });
const links = $$('#menu a');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), {rootMargin:'-40% 0px -55% 0px'});
$$('main section').forEach(s => io.observe(s));

/* Events: render + filter + dropdown */
const cats = ['All', ...new Set(EVENTS.map(e => e.cat))];
function renderEvents(cat='All') {
  $('#eventList').innerHTML = EVENTS.filter(e => cat === 'All' || e.cat === cat).map(e => `
    <article class="event">
      <div class="date"><b>${fmt(e.date,{day:'2-digit'})}</b>${fmt(e.date,{month:'short'})}</div>
      <div><h3>${e.name}</h3><p>${fmt(e.date,{hour:'numeric',minute:'2-digit'})} · ${e.venue}</p><p>${e.desc}</p></div>
      <span class="tag">${e.cat}</span></article>`).join('');
}
$('#chips').innerHTML = cats.map((c,i) => `<button class="chip${i?'':' on'}" data-c="${c}">${c}</button>`).join('');
$('#chips').onclick = e => {
  const b = e.target.closest('.chip'); if (!b) return;
  $$('.chip').forEach(c => c.classList.toggle('on', c === b)); renderEvents(b.dataset.c);
};
$('#eventSelect').insertAdjacentHTML('beforeend', EVENTS.map(e => `<option value="${e.id}">${e.name}</option>`).join(''));
renderEvents();

/* Clock + countdown */
function tick() {
  const now = new Date();
  $('#clock').textContent = now.toLocaleTimeString('en-IN', {timeZone:'Asia/Kolkata', hour12:false});
  const next = EVENTS.map(e => ({...e, t:new Date(e.date)})).filter(e => e.t > now).sort((a,b) => a.t-b.t)[0];
  if (!next) { $('#cdName').textContent = 'No upcoming events'; return; }
  let s = Math.floor((next.t - now) / 1000);
  $('#cdName').textContent = next.name;
  $('#cdD').textContent = Math.floor(s/86400); s %= 86400;
  $('#cdH').textContent = String(Math.floor(s/3600)).padStart(2,'0'); s %= 3600;
  $('#cdM').textContent = String(Math.floor(s/60)).padStart(2,'0');
  $('#cdS').textContent = String(s%60).padStart(2,'0');
}
tick(); setInterval(tick, 1000);

/* Validation */
const rules = {
  name:  v => /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v) || 'Enter a valid name (letters only).',
  roll:  v => /^\d{10}$/.test(v) || 'Roll number must be exactly 10 digits.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address.',
  phone: v => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v) || 'Enter a valid 10-digit Indian mobile number.',
  dept:  v => !!v || 'Please select a department.',
  event: v => !!v || 'Please select an event.',
  gender:v => !!v || 'Please choose an option.',
  msg:   v => v.length >= 10 || 'Feedback must be at least 10 characters.'
};
const value = (form, n) => form.elements[n].value.trim();
function check(form, n) {
  const res = rules[n](value(form, n));
  const el = form.elements[n], isGroup = el instanceof RadioNodeList;
  const box = (isGroup ? el[0] : el).closest('label, fieldset');
  const msg = $('.err', box);
  if (msg) msg.textContent = res === true ? '' : res;
  if (!isGroup) el.classList.toggle('invalid', res !== true);
  return res === true;
}
function wire(form, okEl, okText) {
  const names = [...new Set([...form.elements].map(e => e.name).filter(n => rules[n]))];
  form.addEventListener('input', e => { if (rules[e.target.name] && (e.target.classList.contains('invalid') || e.target.type === 'radio')) check(form, e.target.name); });
  form.addEventListener('change', e => { if (rules[e.target.name]) check(form, e.target.name); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = names.map(n => check(form, n)).every(Boolean);
    okEl.textContent = ok ? okText(form) : '';
    if (ok) form.reset(); else $('.invalid', form)?.focus();
  });
}
wire($('#regForm'), $('#regOk'), f => {
  const ev = EVENTS.find(e => e.id == f.elements.event.value);
  return `Thanks ${value(f,'name')}! You're registered for ${ev ? ev.name : 'the event'}. (Demo only: no server.)`;
});
wire($('#fbForm'), $('#fbOk'), () => 'Thanks for your feedback! (Demo only: no server.)');
