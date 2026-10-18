/* ===== main: schelet, navigare, teme, evenimente ===== */
const NAV = [
  ['start', 'Acasă'],
  { h: 'Lecții, în ordine' },
  ['baze', 'Bazele: COD și COI', 1], ['grupe', 'Grupele de verbe', 2], ['timpuri', 'Timpurile', 3], ['participiu', 'Participiul trecut', 4], ['acord', 'Acordul participiului', 5],
  { h: 'Antrenament' },
  ['exercitii', 'Exerciții'], ['test', 'Test simulat'],
  { h: 'Unelte' },
  ['conjugator', 'Conjugator'], ['fisa', 'Fișă-rezumat']
];
let ROUTE = null, SHOWN = null;
function current() { const id = ROUTE || location.hash.slice(1) || 'start'; return VIEWS[id] ? id : 'start'; }
function updateNav() {
  const cur = current();
  const nav = $('#nav'); if (!nav) return;
  nav.innerHTML = NAV.map(n => {
    if (n.h) return `<div class="nav-h">${n.h}</div>`;
    const done = n[2] && S.done[n[0]];
    const mark = n[2] ? `<span class="n${done ? ' done' : ''}">${done ? ICO.check : n[2]}</span>` : '<span class="n dot"></span>';
    return `<a href="#${n[0]}"${cur === n[0] ? ' aria-current="page"' : ''}>${mark}<span>${n[1]}</span></a>`;
  }).join('');
  const p = progressPct();
  $('#side-pct').textContent = p + '%';
  $('#side-bar').style.width = p + '%';
}
function go(id) {
  if (!VIEWS[id]) return;
  ROUTE = id;
  try { location.hash = id; } catch (e) { /* ignorat */ }
  render();
}
function render() {
  stopTimers(); RUN = null; RUN_QUIT = null; FL = null;
  const id = current(), v = VIEWS[id];
  SHOWN = id;
  const host = $('#view');
  host.innerHTML = v.render();
  if (v.after) v.after();
  updateNav();
  $('#side').classList.remove('open');
  window.scrollTo(0, 0);
}
function applyTheme() {
  const r = document.documentElement;
  if (S.theme) r.setAttribute('data-theme', S.theme); else r.removeAttribute('data-theme');
}
ACT['theme'] = () => {
  const dark = S.theme ? S.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  S.theme = dark ? 'light' : 'dark'; store.set('theme', S.theme); applyTheme();
};
ACT['menu'] = () => { $('#side').classList.add('open'); };
ACT['menu-close'] = () => { $('#side').classList.remove('open'); };
ACT['say'] = el => speak(el.dataset.say);

function boot() {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="app">
    <aside class="side" id="side" aria-label="Navigare">
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap">
        <a class="brand" href="#start"><span class="brand-mark" aria-hidden="true"></span><span><span class="brand-name">Cahier de français</span><div class="brand-sub">pregătire pentru test · clasa a 11-a</div></span></a>
        <button type="button" class="iconbtn only-m" data-act="menu-close" aria-label="Închide meniul">${ICO.close}</button>
      </div>
      <nav class="nav" id="nav" aria-label="Secțiuni"></nav>
      <div class="side-foot">
        <div class="row"><span>Progres</span><b id="side-pct">0%</b></div>
        <div class="bar" role="presentation"><i id="side-bar" style="width:0"></i></div>
        <div class="row" style="margin-top:6px"><span class="small">Tema</span><button type="button" class="iconbtn" data-act="theme" aria-label="Schimbă tema (luminos / întunecat)">${ICO.theme}</button></div>
      </div>
    </aside>
    <div class="main">
      <header class="top">
        <button type="button" class="iconbtn" data-act="menu" aria-label="Deschide meniul">${ICO.menu}</button>
        <a class="brand" href="#start"><span class="brand-name">Cahier de français</span></a>
        <span class="sp"></span>
        <button type="button" class="iconbtn" data-act="theme" aria-label="Schimbă tema (luminos / întunecat)">${ICO.theme}</button>
      </header>
      <main class="wrap" id="view" tabindex="-1"></main>
    </div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`);
  applyTheme();
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el, e);
    const a = e.target.closest('a[href^="#"]');
    if (a && !a.dataset.act) {
      const id = a.getAttribute('href').slice(1);
      if (VIEWS[id]) { e.preventDefault(); go(id); }
    }
  });
  document.addEventListener('input', e => { const el = e.target.closest('[data-act-input]'); if (el && ACT[el.dataset.actInput]) ACT[el.dataset.actInput](el, e); });
  document.addEventListener('change', e => { const el = e.target.closest('[data-act-change]'); if (el && ACT[el.dataset.actChange]) ACT[el.dataset.actChange](el, e); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#side').classList.remove('open'); });
  window.addEventListener('hashchange', () => { ROUTE = null; if (current() !== SHOWN) render(); });
  if (canSpeak) { try { window.speechSynthesis.getVoices(); } catch (e) { /* ignorat */ } }
  render();
}
boot();
