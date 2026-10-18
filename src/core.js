/* ===== core: utilitare, stare, voce, componente de afișare ===== */
const FR = window.FR, C = window.C;
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/'/g, '\u2019');
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sample = (a, n) => shuffle(a).slice(0, n);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- stocare (doar confort per-utilizator; totul merge și fără ea) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('cf1:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('cf1:' + k, JSON.stringify(v)); } catch (e) { /* ignorat */ } }
};
const S = {
  done: store.get('done', {}),
  best: store.get('best', {}),
  mistakes: store.get('mistakes', []),
  plan: store.get('plan', { days: 3, steps: {} }),
  theme: store.get('theme', null),
  exLevel: 0
};
const save = () => { store.set('done', S.done); store.set('best', S.best); store.set('mistakes', S.mistakes); store.set('plan', S.plan); };

/* ---------- vocală ---------- */
const canSpeak = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
function speak(text) {
  if (!canSpeak) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ' ').replace(/\([es]+\)/g, ''));
    u.lang = 'fr-FR'; u.rate = .9;
    const v = synth.getVoices().find(x => /^fr/i.test(x.lang));
    if (v) u.voice = v;
    synth.speak(u);
  } catch (e) { /* ignorat */ }
}
const ICO = {
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  theme: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};
const sayBtn = t => canSpeak ? `<button type="button" class="say" data-act="say" data-say="${esc(t)}" aria-label="Ascultă pronunția">${ICO.speaker}</button>` : '';

/* ---------- bucăți de HTML reutilizabile ---------- */
const R = {
  S: t => `<span class="r r-S">${t}</span>`, V: t => `<span class="r r-V">${t}</span>`,
  COD: t => `<span class="r r-COD">${t}</span>`, COI: t => `<span class="r r-COI">${t}</span>`, AUX: t => `<span class="r r-AUX">${t}</span>`
};
const ROLE_LABEL = { S: 'subiect', V: 'verb', COD: 'COD', COI: 'COI', AUX: 'auxiliar', PP: 'participiu', ANT: 'antecedent', CC: 'circumstanțial' };
const ROLE_CLS = { S: 'S', V: 'V', COD: 'COD', COI: 'COI', AUX: 'AUX', PP: 'AUX' };
const callout = (type, label, body) => `<div class="callout ${type}"><span class="cl">${label}</span>${body}</div>`;
const ex = (fr, ro) => `<div class="ex"><div><p class="fr">${fr}</p>${ro ? `<p class="ro">${ro}</p>` : ''}</div>${sayBtn(fr.replace(/<[^>]+>/g, ''))}</div>`;
const exList = items => `<div class="ex-list">${items.map(i => ex(i[0], i[1])).join('')}</div>`;
const badge = (txt, cls) => `<span class="badge ${cls || ''}">${txt}</span>`;
const tbl = (head, rows, o) => {
  o = o || {};
  return `<div class="tscroll tbl"><table>${head ? `<thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${i === 0 && !o.noKey ? 'k' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
};
const segsHtml = segs => segs.map(([t, c]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join('');
const groupBadge = v => v.g === 1 ? badge('grupa 1', 'g1') : v.g === 2 ? badge('grupa 2', 'g2') : badge('grupa 3', 'g3');
const auxBadge = v => v.aux === 'etre' ? badge('être', 'av') : v.aux === 'both' ? badge('avoir / être', 'av') : badge('avoir', 'av');

/* masă de conjugare */
function conjHtml(input, tid, o) {
  o = o || {};
  const vo = FR.getVerb(input);
  if (!vo.v) return '';
  const rows = FR.rows(vo, tid, o);
  if (!rows) return '';
  const v = vo.v;
  const label = (vo.refl ? 'se ' : '') + vo.inf;
  const head = o.title
    ? `<h4><span>${esc(o.title)}${o.sub ? ` <small class="muted" style="font-weight:500">· ${esc(o.sub)}</small>` : ''}</span></h4>`
    : `<h4><span>${esc(label)}${v.ro ? ` <small class="muted" style="font-weight:500">· ${esc(v.ro)}</small>` : ''}</span><span>${groupBadge(v)}</span></h4>`;
  const body = rows.map(r => {
    const txt = r.full;
    if (tid === 'impe') return `<tr><td class="pn">${r.lab}</td><td>${segsHtml(r.segs)}</td><td class="sayrow">${sayBtn(txt)}</td></tr>`;
    return `<tr><td><span class="pn">${esc(r.pre)}</span>${segsHtml(r.segs)}</td><td class="sayrow">${sayBtn(txt)}</td></tr>`;
  }).join('');
  return `<div class="conj">${head}<table><tbody>${body}</tbody></table></div>`;
}
const legendHtml = `<div class="legend"><span><b class="st">radical</b> = partea care rămâne</span><span><b style="color:var(--v)">terminație</b> = partea care se schimbă</span><span><b style="color:var(--aux)">auxiliar + participiu</b></span></div>`;

/* propoziție cu verbul evidențiat */
function sentHtml(d, tid) {
  const p = FR.sentenceParts(d, tid);
  const first = (p.subj + p.verb + p.post);
  const subj = cap(p.subj);
  return `${esc(subj)}<span class="r r-V">${esc(p.verb)}</span>${esc(p.post)}.`.replace(/\s+\./, '.');
}

/* toast */
let toastT;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200);
}

/* progres */
const LESSONS = ['baze', 'grupe', 'timpuri', 'participiu', 'acord'];
function progressPct() {
  const l = LESSONS.filter(k => S.done[k]).length;
  const b = ['acord-avoir', 'codcoi', 'transform', 'test'].filter(k => (S.best[k] || 0) >= 70).length;
  return Math.round(((l / LESSONS.length) * 0.7 + (b / 4) * 0.3) * 100);
}
function markDone(id, on) {
  if (on) S.done[id] = 1; else delete S.done[id];
  save(); updateNav();
}
