/* ===== exerciții: întrebări, generatoare, runner ===== */
const ACT = {};
let QID = 0;
const mkq = o => Object.assign({ id: 'q' + (++QID) }, o);
const same = (a, b) => {
  const n = s => FR.norm(s).replace(/[.!?]+$/, '').replace(/\s+([,;:.!?])/g, '$1').replace(/\s*-\s*/g, '-');
  return n(a) === n(b);
};
const TNAME = FR.TENSE_NAMES;

/* ---------- întrebări din bănci ---------- */
const BOTH_RE = /\((monter|descendre|sortir|rentrer)\)/;
function fromAcord(it) {
  return mkq({ kind: 'fill', cat: 'acord', ins: 'Accorde le participe passé (între paranteze: infinitivul).', tpl: it[0], ans: [[it[1]]], why: it[3], code: it[2], lv: it[4], both: BOTH_RE.test(it[0]) });
}
const SIM = {
  coi: ['no_cod', 'pron_coi'], no_cod: ['coi', 'pron_coi'], cod_after: ['pron_after'], pron_after: ['cod_after'], pron_coi: ['coi', 'no_cod'],
  etre_subj: ['pron_ess', 'pron_cod'], pron_cod: ['pron_ess', 'etre_subj'], pron_ess: ['pron_cod', 'etre_subj'], cod_before: [], en: []
};
function whyQ(it) {
  const code = it[2], isPron = /^pron_/.test(code);
  let pool = Object.keys(C.REASONS).filter(k => k !== code && !(SIM[code] || []).includes(k));
  if (!isPron) pool = pool.filter(k => !/^pron_/.test(k));
  const opts = shuffle([code, ...sample(pool, 3)]);
  return mkq({
    kind: 'mcq', cat: 'acord', ins: 'De ce se scrie participiul așa?',
    text: esc(it[0]).replace('___', `<b class="ans">${esc(it[1])}</b>`).replace(/\(([^)]+)\)/g, '<span class="hint">($1)</span>'),
    opts: opts.map(k => C.REASONS[k]), ans: opts.indexOf(code), why: it[3], code
  });
}
function tapQ(it) {
  return mkq({ kind: 'tap', cat: 'codcoi', ins: `Apasă pe ${it.find}-ul din propoziție (sau «Nu există»).`, tokens: it.t, find: it.find, none: !!it.none, why: it.why });
}
function timeQ(it) {
  return mkq({ kind: 'mcq', cat: 'timp', ins: 'Alege forma potrivită.', text: esc(it.text).replace('___', '<b class="ans">___</b>'), opts: it.opts, ans: it.ans, why: it.why, frOpts: true });
}
const acordPool = () => C.ACORD;
function byLevel(items) {
  const lv = S.exLevel;
  if (!lv) return items;
  const f = items.filter(x => x[4] === lv);
  return f.length >= 5 ? f : items;
}
const isCode = (...codes) => it => codes.includes(it[2]);

/* ---------- generatoare ---------- */
const TEACH = ['parler', 'finir', 'vendre', 'aller', 'faire', 'prendre', 'venir', 'pouvoir', 'vouloir', 'savoir', 'voir', 'dire', 'mettre', 'devoir', 'manger', 'commencer', 'acheter', 'appeler', 'ouvrir', 'écrire', 'lire', 'boire', 'partir', 'recevoir', 'croire', 'connaître', 'choisir', 'attendre', 'répondre', 'comprendre', 'apprendre', 'envoyer', 'préférer', 'regarder', 'travailler', 'être', 'avoir'];
const HINT_T = {
  present: 'Radical + terminațiile grupei.', pc: 'Auxiliar la prezent + participiu trecut.', imp: 'Radicalul lui <i>nous</i> (prezent, fără -ons) + terminațiile imperfectului.',
  fs: 'Infinitiv (sau radical neregulat de viitor) + ai, as, a, ons, ez, ont.', cond: 'Radicalul viitorului + terminațiile imperfectului.', pqp: 'Auxiliar la imparfait + participiu trecut.',
  subj: '<i>que</i> + radicalul lui <i>ils</i> + e, es, e, ions, iez, ent.', fp: '<i>aller</i> la prezent + infinitiv.', pr: '<i>venir</i> la prezent + de + infinitiv.',
  fa: 'Auxiliar la futur simple + participiu trecut.', condp: 'Auxiliar la conditionnel présent + participiu trecut.', impe: 'Forma de prezent, fără pronume.'
};
const COMPOUND = ['pc', 'pqp', 'fa', 'condp'];
function verbsFor(tid) {
  return TEACH.filter(v => {
    const vo = FR.getVerb(v);
    if (!vo.v) return false;
    if (COMPOUND.includes(tid) && vo.v.aux !== 'avoir') return false;
    if (tid === 'impe' && !vo.v.imper) return false;
    if (tid === 'subj' && !vo.v.subj) return false;
    if (tid === 'pr' && /^(être|avoir|pouvoir|vouloir|savoir|devoir)$/.test(v)) return false;
    return true;
  });
}
const LEVEL_TENSES = { 1: ['present', 'pc', 'imp', 'fs'], 2: ['present', 'pc', 'imp', 'fs', 'fp', 'pr', 'cond', 'pqp'], 3: ['pc', 'imp', 'fs', 'cond', 'pqp', 'subj', 'condp', 'fa'] };
function conjSingle(tid) {
  tid = tid || pick(LEVEL_TENSES[S.exLevel || 2]);
  const inf = pick(verbsFor(tid));
  const vo = FR.getVerb(inf);
  let rows = FR.rows(vo, tid);
  const r = pick(rows.filter(x => x.i !== 2 || Math.random() < .5));
  const ans = FR.flat(r.segs);
  const pre = r.pre;
  const ro = vo.v.ro ? ` (${vo.v.ro})` : '';
  return mkq({
    kind: 'fill', cat: 'conj', ins: `Conjugă «${inf}»${ro} la ${TNAME[tid]}:`, tpl: `${pre}___`, ans: [[ans]], rawPre: pre,
    why: `<b>${r.full}</b>. ${HINT_T[tid] || ''}`
  });
}
function conjTable(tid) {
  tid = tid || pick(['present', 'imp', 'fs', 'cond', 'pc']);
  const inf = pick(verbsFor(tid));
  const vo = FR.getVerb(inf);
  const rows = FR.rows(vo, tid);
  return mkq({
    kind: 'table', cat: 'conj', ins: `Completează tabelul: «${inf}»${vo.v.ro ? ' (' + vo.v.ro + ')' : ''} la ${TNAME[tid]}.`,
    rows: rows.map(r => ({ label: tid === 'impe' ? r.lab : r.pre.trim() ? r.pre : '', ans: FR.flat(r.segs) })),
    ans: rows.map(r => [FR.flat(r.segs)]), why: HINT_T[tid] || ''
  });
}
const PP_REG = [['parler', 'parlé', 'a vorbi'], ['manger', 'mangé', 'a mânca'], ['regarder', 'regardé', 'a privi'], ['choisir', 'choisi', 'a alege'], ['finir', 'fini', 'a termina'],
  ['réussir', 'réussi', 'a reuși'], ['vendre', 'vendu', 'a vinde'], ['attendre', 'attendu', 'a aștepta'], ['répondre', 'répondu', 'a răspunde'], ['perdre', 'perdu', 'a pierde'], ['entendre', 'entendu', 'a auzi'], ['arriver', 'arrivé', 'a ajunge']];
function genPP() {
  const useIrr = Math.random() < .75;
  const e = useIrr ? pick(C.PP) : pick(PP_REG);
  const inf = useIrr ? e[1] : e[0], pp = useIrr ? e[0] : e[1], ro = useIrr ? e[2] : e[2];
  const note = useIrr ? 'Participiu neregulat: învață-l pe de rost.' : 'Participiu regulat: -er → -é, -ir → -i, -re → -u.';
  return mkq({ kind: 'fill', cat: 'pp', ins: `Care este participiul trecut al lui «${inf}» (${ro})?`, tpl: '___', ans: [[pp]], why: `<b>${inf} → ${pp}</b>. ${note}` });
}
const AUX_ETRE = ['devenir', 'revenir', 'rester', 'venir', 'aller', 'naître', 'entrer', 'tomber', 'arriver', 'mourir', 'partir'];
const AUX_AVOIR = ['manger', 'finir', 'parler', 'voir', 'prendre', 'faire', 'dormir', 'courir', 'marcher', 'vivre', 'écrire', 'lire', 'avoir', 'être', 'sourire', 'choisir', 'boire', 'ouvrir', 'comprendre', 'dire'];
const AUX_PRON = ['se laver', 'se lever', 's’habiller', 'se souvenir', 'se promener', 'se coucher'];
function genAux() {
  if (Math.random() < .3) {
    const b = pick(C.BOTH);
    const src = Math.random() < .5 ? b[1] : b[2];
    const m = src.match(/<b>(est|a|sont|ont)<\/b>/);
    if (m) {
      const pair = (m[1] === 'est' || m[1] === 'a') ? ['a', 'est'] : ['ont', 'sont'];
      const opts = shuffle(pair);
      return mkq({
        kind: 'mcq', cat: 'aux', ins: `Alege auxiliarul. «${b[0]}» are două auxiliare, în funcție de COD.`, text: src.replace(m[0], '<b class="ans">___</b>'),
        opts, ans: opts.indexOf(m[1]), frOpts: true,
        why: `<i>${b[0]}</i> se conjugă cu <b>${m[1]}</b> aici: ${m[1] === 'est' || m[1] === 'sont' ? 'nu există COD, deci <b>être</b>' : 'există un COD, deci <b>avoir</b>'}.`
      });
    }
  }
  const kind = pick(['e', 'a', 'a', 'p']);
  const inf = kind === 'e' ? pick(AUX_ETRE) : kind === 'a' ? pick(AUX_AVOIR) : pick(AUX_PRON);
  const etre = kind !== 'a';
  const why = kind === 'e' ? `<i>${inf}</i> este în lista <b>DR &amp; MRS VANDERTRAMP</b> → <b>être</b>.` : kind === 'p' ? 'Toate verbele pronominale se conjugă cu <b>être</b>.' : `<i>${inf}</i> nu este în lista verbelor cu être → <b>avoir</b>.`;
  const opts = shuffle(['avoir', 'être']);
  return mkq({ kind: 'mcq', cat: 'aux', ins: `Cu ce auxiliar se conjugă «${inf}» la passé composé?`, text: `<span class="fr">${esc(inf)}</span>`, opts, ans: opts.indexOf(etre ? 'être' : 'avoir'), why });
}
function genTransform(forceLv) {
  const lv = forceLv || S.exLevel || pick([1, 2, 2, 3]);
  const pairs = C.TR_PAIRS.filter(p => p[0] <= lv);
  for (let tries = 0; tries < 12; tries++) {
    const [, from, to] = pick(pairs);
    const d = pick(C.TR);
    if ((to === 'pr' || from === 'pr') && /^(être|avoir|pouvoir|vouloir|savoir|devoir)$/.test(d.verb)) continue;
    const src = FR.sentence(d, from), ans = FR.sentence(d, to);
    if (src === ans) continue;
    return mkq({
      kind: 'fill', cat: 'transform', wide: true, ins: `Treci la ${TNAME[to]}.`,
      pre: `<span class="badge">${TNAME[from]}</span> <span class="fr">${esc(src)}</span>`, tpl: '___', ans: [[ans]],
      why: `${HINT_T[to] || ''} Răspuns: <b>${esc(ans)}</b>`
    });
  }
  return genTransform(1);
}
function drillFor(tid, n) {
  const out = [];
  if (tid === 'impe') { for (let i = 0; i < Math.min(n, 2); i++) out.push(conjTable('impe')); return out; }
  for (let i = 0; i < n; i++) out.push(i === n - 1 && !['fp', 'pr'].includes(tid) && Math.random() < .5 ? conjTable(tid) : conjSingle(tid));
  return out;
}

/* ---------- seturi ---------- */
const nonPron = it => !/^pron_/.test(it[2]);
const SETS = [
  { id: 'acord-avoir', t: 'Acord cu avoir', d: 'COD înainte sau după verb, COI, «en». Inima testului.', n: 10, cat: 'ACORD', key: true,
    make: () => sample(byLevel(acordPool().filter(isCode('cod_before', 'cod_after', 'coi', 'no_cod', 'en'))), 10).map(fromAcord) },
  { id: 'acord-etre', t: 'Acord cu être', d: 'Acord cu subiectul și verbele cu două auxiliare (monter, sortir…).', n: 10, cat: 'ACORD',
    make: () => sample(byLevel(acordPool().filter(it => it[2] === 'etre_subj' || BOTH_RE.test(it[0]))), 10).map(fromAcord) },
  { id: 'acord-pron', t: 'Verbe pronominale', d: 'se = COD sau COI? Când se acordă și când nu.', n: 10, cat: 'ACORD',
    make: () => sample(byLevel(acordPool().filter(it => /^pron_/.test(it[2]))), 10).map(fromAcord) },
  { id: 'acord-why', t: 'De ce se scrie așa?', d: 'Alegi motivul acordului sau al lipsei lui.', n: 10, cat: 'ACORD',
    make: () => sample(byLevel(acordPool()), 10).map(whyQ) },
  { id: 'codcoi', t: 'Găsește COD și COI', d: 'Apeși pe cuvintele din propoziție. Rolurile se văd după răspuns.', n: 10, cat: 'COD / COI', key: true,
    make: () => sample(C.TAP, 10).map(tapQ) },
  { id: 'pp', t: 'Participii trecute', d: 'Scrii participiul unui verb (regulat sau neregulat).', n: 12, cat: 'PARTICIPIU',
    make: () => Array.from({ length: 12 }, genPP) },
  { id: 'aux', t: 'Avoir sau être?', d: 'Alegi auxiliarul potrivit, inclusiv la verbele cu două auxiliare.', n: 10, cat: 'PARTICIPIU',
    make: () => Array.from({ length: 10 }, genAux) },
  { id: 'conj1', t: 'Conjugă o formă', d: 'O persoană, un timp. Exact ca la o verificare rapidă.', n: 12, cat: 'TIMPURI',
    make: () => Array.from({ length: 12 }, () => conjSingle()) },
  { id: 'conj-table', t: 'Tabele de conjugare', d: 'Completezi toate cele șase persoane.', n: 4, cat: 'TIMPURI',
    make: () => Array.from({ length: 4 }, () => conjTable()) },
  { id: 'transform', t: 'Treci la alt timp', d: 'Rescrii propoziția la timpul cerut. Exact tipul de exercițiu din test.', n: 10, cat: 'TIMPURI', key: true,
    make: () => Array.from({ length: 10 }, () => genTransform()) },
  { id: 'timpul', t: 'Ce timp potrivești?', d: 'Din context alegi imparfait, passé composé, viitor sau condițional.', n: 10, cat: 'TIMPURI',
    make: () => sample(C.TIME, 10).map(timeQ) },
  { id: 'mixt', t: 'Mix general', d: 'Un pic din toate, în ordine amestecată.', n: 15, cat: 'MIX',
    make: () => shuffle([...sample(byLevel(acordPool().filter(nonPron)), 4).map(fromAcord), ...sample(byLevel(acordPool().filter(it => !nonPron(it))), 2).map(fromAcord), ...sample(C.TAP, 3).map(tapQ),
      ...Array.from({ length: 2 }, genPP), ...Array.from({ length: 4 }, () => genTransform())]) }
];
const SETBY = {}; SETS.forEach(s => { SETBY[s.id] = s; });

function makeTest() {
  const A = acordPool();
  const pickBy = (codes, n) => sample(A.filter(isCode(...codes)), n);
  const q = [
    ...pickBy(['cod_before'], 2), ...pickBy(['cod_after'], 1), ...pickBy(['coi', 'pron_coi', 'en'], 1), ...pickBy(['etre_subj'], 1),
    ...pickBy(['pron_cod', 'pron_after', 'pron_ess'], 1), ...sample(A.filter(it => it[4] === 3), 1)
  ].map(fromAcord);
  const why = sample(A, 2).map(whyQ);
  const tap = [...sample(C.TAP.filter(t => t.find === 'COD' && !t.none), 1), ...sample(C.TAP.filter(t => t.find === 'COI' && !t.none), 1), ...sample(C.TAP.filter(t => t.none), 1), ...sample(C.TAP.filter(t => !t.none), 1)].map(tapQ);
  const pps = Array.from({ length: 3 }, genPP);
  const auxs = [genAux(), genAux()];
  const tr = Array.from({ length: 7 }, (_, i) => genTransform(i < 2 ? 1 : i < 5 ? 2 : 3));
  return [...q, ...why, ...tap, ...pps, ...auxs, ...tr];
}

/* ---------- randare întrebări ---------- */
const ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'û', 'ù', 'ç', 'œ', '’', '-'];
const hintify = s => s.replace(/\(([^)]+)\)/g, '<span class="hint">($1)</span>');
function inputHtml(k, ans, wide) {
  const len = Math.min(26, Math.max(8, (ans || '').length + 3));
  return `<input class="fill${wide ? ' wide' : ''}" type="text" data-k="${k}" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="răspuns ${k + 1}" ${wide ? '' : `style="width:${len}ch"`}>`;
}
function qBody(q) {
  const instr = `<div class="q-instr">${q.ins}</div>`;
  const acc = `<div class="accents no-print" aria-label="Litere cu diacritice">${ACCENTS.map(a => `<button type="button" data-act="acc" data-ch="${a}" aria-label="Inserează ${a}">${a}</button>`).join('')}</div>`;
  if (q.kind === 'fill') {
    let k = 0;
    const body = hintify(esc(q.tpl)).replace(/___/g, () => { const h = inputHtml(k, (q.ans[k] || [''])[0], q.wide); k++; return h; });
    return `${instr}${q.pre ? `<p class="q-text">${q.pre}</p>` : ''}<div class="q-text">${body}</div>${acc}`;
  }
  if (q.kind === 'table') {
    return `${instr}<div class="tscroll"><table class="tbl-in"><tbody>${q.rows.map((r, i) => `<tr><td class="pn" style="padding:4px 10px 4px 0;white-space:nowrap;font-family:var(--f-fr);font-size:1.1rem;color:var(--ink-2)">${esc(r.label)}</td><td>${inputHtml(i, r.ans)}</td></tr>`).join('')}</tbody></table></div>${acc}`;
  }
  if (q.kind === 'mcq') {
    return `${instr}<p class="q-text">${q.text}</p><div class="opts">${q.opts.map((o, i) => `<button type="button" class="opt${q.frOpts ? ' fr-o' : ''}" data-act="q-opt" data-i="${i}"><span class="l">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
  }
  if (q.kind === 'tap') {
    return `${instr}<div class="board"><div class="line">${q.tokens.map((t, i) => `<button type="button" class="tk pick hid" data-act="q-tap" data-i="${i}" data-role="${ROLE_CLS[t[1]] || 'CC'}"><span class="fr">${esc(t[0])}</span><i class="c-${ROLE_CLS[t[1]] || 'CC'}">${ROLE_LABEL[t[1]] || ''}</i></button>`).join('')}</div></div>
      <div class="btnrow" style="margin-top:12px"><button type="button" class="chip" data-act="q-none" aria-pressed="false">Nu există ${q.find}</button></div>`;
  }
  return '';
}
function expectedIdx(q) { return q.tokens.map((t, i) => t[1] === q.find ? i : -1).filter(i => i >= 0); }
function solutionHtml(q) {
  if (q.kind === 'fill') {
    let k = 0;
    if (q.wide) return `<span class="ans">${esc(q.ans[0][0])}</span>`;
    return hintify(esc(q.tpl)).replace(/___/g, () => `<b class="ans">${esc(q.ans[k++][0])}</b>`);
  }
  if (q.kind === 'table') return q.rows.map(r => `<span class="ans">${esc((r.label ? r.label + (/['’]$/.test(r.label) ? '' : ' ') : '') + r.ans)}</span>`).join(' · ');
  if (q.kind === 'mcq') return `<b>${esc(q.opts[q.ans])}</b>`;
  if (q.kind === 'tap') { const e = expectedIdx(q); return e.length ? e.map(i => `<b>${esc(q.tokens[i][0])}</b>`).join(' + ') : `<b>nu există ${q.find}</b>`; }
  return '';
}
function userHtml(q, ua) {
  if (ua == null) return '<i>(fără răspuns)</i>';
  if (q.kind === 'fill') return ua.map(x => esc(x || '…')).join(' / ');
  if (q.kind === 'table') return ua.map(x => esc(x || '…')).join(' · ');
  if (q.kind === 'mcq') return q.opts[ua] != null ? esc(q.opts[ua]) : '<i>(fără răspuns)</i>';
  if (q.kind === 'tap') return ua.none ? 'nu există' : (ua.sel.length ? ua.sel.map(i => esc(q.tokens[i][0])).join(' + ') : '<i>(fără răspuns)</i>');
  return '';
}
function grade(q, ua) {
  if (ua == null) return { ok: false };
  if (q.kind === 'fill' || q.kind === 'table') {
    const ok = q.ans.every((alts, k) => alts.some(a => same(ua[k] || '', a)));
    let hint = '';
    if (!ok && q.ans.every((alts, k) => alts.some(a => FR.noAcc(FR.norm(ua[k] || '')).replace(/[.!?]+$/, '') === FR.noAcc(FR.norm(a)).replace(/[.!?]+$/, '')))) hint = 'Aproape! Litera e bună, dar verifică accentele sau apostroful.';
    return { ok, hint };
  }
  if (q.kind === 'mcq') return { ok: ua === q.ans };
  if (q.kind === 'tap') {
    const exp = expectedIdx(q);
    if (!exp.length) return { ok: ua.none && !ua.sel.length };
    return { ok: !ua.none && ua.sel.length === exp.length && exp.every(i => ua.sel.includes(i)) };
  }
  return { ok: false };
}

/* ---------- runner ---------- */
let RUN = null, TICK = null;
function stopTimers() { clearInterval(TICK); TICK = null; }
const fmtT = s => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0')}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

function mountRunner(host, qs, opt) {
  stopTimers();
  const run = { host, qs, i: 0, res: [], mode: opt.mode || 'practice', opt, left: opt.seconds || 0, locked: false };
  RUN = run;
  if (run.mode === 'test' && opt.seconds) {
    TICK = setInterval(() => {
      run.left--;
      const el = $('#timer', host);
      if (el) { el.textContent = fmtT(run.left); el.classList.toggle('low', run.left < 180); }
      if (run.left <= 0) { collectCurrent(run, true); finishRun(run, true); }
    }, 1000);
  }
  drawQ(run);
}
function qState(run) { return run.qs[run.i]; }
function drawQ(run) {
  const q = qState(run), host = run.host;
  run.locked = false; q._sel = q._sel || null; q._none = false; q._tap = [];
  const pct = Math.round(run.i / run.qs.length * 100);
  const timer = run.mode === 'test' && run.opt.seconds ? `<span class="timer${run.left < 180 ? ' low' : ''}" id="timer" aria-label="Timp rămas">${fmtT(run.left)}</span>` : '';
  const catLbl = { acord: 'Acord', codcoi: 'COD / COI', pp: 'Participiu', aux: 'Auxiliar', conj: 'Conjugare', transform: 'Transformare', timp: 'Timp potrivit' }[q.cat] || '';
  host.innerHTML = `
    ${run.opt.title ? `<div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 style="font-size:1.25rem">${esc(run.opt.title)}</h3><button type="button" class="btn sec sm" data-act="q-quit">Ieși</button></div>` : ''}
    <div class="prog"><span>${run.i + 1} / ${run.qs.length}</span><div class="bar"><i style="width:${pct}%"></i></div>${timer}</div>
    <div class="q" id="qcard">
      <div class="q-meta">${badge(catLbl)}${run.mode === 'test' ? '<span class="small muted">Fără feedback până la final</span>' : ''}</div>
      ${qBody(q)}
      <div id="qfb" aria-live="polite"></div>
      <div class="btnrow" id="qctl" style="margin-top:18px">${controlsHtml(run, false)}</div>
    </div>`;
  const first = $('input.fill', host);
  if (first && run.opt.focus !== false) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
}
function controlsHtml(run, checked) {
  const q = qState(run), last = run.i === run.qs.length - 1;
  if (run.mode === 'test') return `<button type="button" class="btn" data-act="q-next">${last ? 'Termină testul' : 'Continuă'} ${ICO.arrow}</button>`;
  if (!checked) {
    const check = q.kind === 'mcq' ? '' : `<button type="button" class="btn" data-act="q-check">Verifică</button>`;
    return `${check}<button type="button" class="btn sec" data-act="q-reveal">Nu știu, arată-mi</button>`;
  }
  return `<button type="button" class="btn" data-act="q-next">${last ? 'Vezi rezultatul' : 'Următoarea'} ${ICO.arrow}</button>`;
}
function collectCurrent(run, silent) {
  const q = qState(run), card = $('#qcard', run.host);
  if (!card) return null;
  let ua = null;
  if (q.kind === 'fill' || q.kind === 'table') ua = $$('input.fill', card).map(i => i.value);
  else if (q.kind === 'mcq') ua = q._sel;
  else if (q.kind === 'tap') ua = { sel: q._tap.slice(), none: !!q._none };
  return ua;
}
function lockUI(run, ok) {
  const q = qState(run), card = $('#qcard', run.host);
  run.locked = true;
  $$('input.fill', card).forEach((inp, k) => {
    inp.readOnly = true;
    const alts = q.ans[k] || [];
    inp.classList.add(alts.some(a => same(inp.value, a)) ? 'ok' : 'no');
  });
  $$('.opt', card).forEach(b => { b.disabled = true; });
  $$('.tk.pick', card).forEach((b, i) => {
    b.disabled = true; b.classList.remove('hid');
    const w = b.querySelector('.fr'); if (w) w.classList.add('r', 'r-' + b.dataset.role);
    const exp = expectedIdx(q), picked = q._tap.includes(i), want = exp.includes(i);
    if (picked && want) b.classList.add('good'); else if (picked && !want) b.classList.add('wrong'); else if (!picked && want && !q._none) b.classList.add('miss');
  });
  $('.accents', card) && ($('.accents', card).style.display = 'none');
}
function showFeedback(run, ok, g) {
  const q = qState(run);
  $('#qfb', run.host).innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><div class="ft">${ok ? ICO.check + ' Corect' : ICO.x + ' Nu chiar'}</div>${ok ? '' : `<p>Răspuns corect: ${solutionHtml(q)}</p>`}${g && g.hint ? `<p>${g.hint}</p>` : ''}${q.why ? `<p>${q.why}</p>` : ''}</div>`;
  $('#qctl', run.host).innerHTML = controlsHtml(run, true);
  const nb = $('[data-act="q-next"]', run.host);
  if (nb) { try { nb.focus({ preventScroll: true }); } catch (e) { /* ignorat */ } }
}
function record(run, ua, ok) {
  const q = qState(run);
  if (!run.res[run.i]) run.res[run.i] = { q, ua, ok };
}
ACT['q-check'] = () => {
  const run = RUN; if (!run || run.locked) return;
  const q = qState(run), ua = collectCurrent(run);
  if (q.kind === 'fill' || q.kind === 'table') {
    if (ua.every(x => !x.trim())) { toast('Scrie un răspuns, sau apasă «Nu știu»'); return; }
  }
  if (q.kind === 'tap' && !ua.sel.length && !ua.none) { toast('Apasă pe un cuvânt sau pe «Nu există»'); return; }
  const g = grade(q, ua);
  record(run, ua, g.ok); lockUI(run, g.ok); showFeedback(run, g.ok, g);
};
ACT['q-reveal'] = () => {
  const run = RUN; if (!run || run.locked) return;
  const q = qState(run), ua = collectCurrent(run);
  record(run, ua, false); lockUI(run, false);
  if (q.kind === 'tap') { expectedIdx(q).forEach(i => $$('.tk.pick', run.host)[i].classList.add('miss')); }
  showFeedback(run, false, null);
};
ACT['q-opt'] = el => {
  const run = RUN; if (!run || run.locked) return;
  const q = qState(run), i = +el.dataset.i;
  q._sel = i;
  if (run.mode === 'test') { $$('.opt', run.host).forEach(b => b.classList.toggle('on', b === el)); $$('.opt .l', run.host).forEach((l, k) => { l.style.background = k === i ? 'var(--navy)' : ''; l.style.color = k === i ? 'var(--on-navy)' : ''; l.style.borderColor = k === i ? 'var(--navy)' : ''; }); return; }
  const g = grade(q, i);
  record(run, i, g.ok); lockUI(run, g.ok);
  $$('.opt', run.host).forEach((b, k) => { if (k === q.ans) b.classList.add('ok'); else if (k === i) b.classList.add('no'); });
  showFeedback(run, g.ok, g);
};
ACT['q-tap'] = el => {
  const run = RUN; if (!run || run.locked) return;
  const q = qState(run), i = +el.dataset.i;
  const at = q._tap.indexOf(i);
  if (at >= 0) q._tap.splice(at, 1); else q._tap.push(i);
  el.classList.toggle('sel', at < 0);
  if (q._tap.length) { q._none = false; const nb = $('[data-act="q-none"]', run.host); if (nb) nb.setAttribute('aria-pressed', 'false'), nb.classList.remove('on'); }
};
ACT['q-none'] = el => {
  const run = RUN; if (!run || run.locked) return;
  const q = qState(run);
  q._none = !q._none;
  el.setAttribute('aria-pressed', String(q._none)); el.classList.toggle('on', q._none);
  if (q._none) { q._tap = []; $$('.tk.pick', run.host).forEach(b => b.classList.remove('sel')); }
};
ACT['q-next'] = () => {
  const run = RUN; if (!run) return;
  if (run.mode === 'test') {
    const ua = collectCurrent(run), g = grade(qState(run), ua);
    record(run, ua, g.ok);
  } else if (!run.locked) return;
  if (run.i >= run.qs.length - 1) { finishRun(run, false); return; }
  run.i++; drawQ(run);
  const card = $('#qcard', run.host);
  if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};
ACT['q-quit'] = () => { stopTimers(); RUN = null; if (RUN_QUIT) RUN_QUIT(); };
let RUN_QUIT = null;
ACT['acc'] = el => {
  const run = RUN;
  const inp = window.__lastFill && document.body.contains(window.__lastFill) ? window.__lastFill : $('input.fill:not([readonly])');
  if (!inp) return;
  const s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + el.dataset.ch + inp.value.slice(e);
  inp.focus(); const p = s + el.dataset.ch.length; try { inp.setSelectionRange(p, p); } catch (er) { /* ignorat */ }
};

function serializeQ(q) { return JSON.parse(JSON.stringify(q, (k, v) => (k[0] === '_' ? undefined : v))); }
const qSig = q => JSON.stringify([q.kind, q.tpl || q.text || q.tokens, q.ans, q.pre || '']);
function finishRun(run, timeout) {
  stopTimers();
  const host = run.host, total = run.qs.length;
  // întrebările fără răspuns (test) = greșite
  run.qs.forEach((q, i) => { if (!run.res[i]) run.res[i] = { q, ua: null, ok: false }; });
  const correct = run.res.filter(r => r.ok).length, pct = Math.round(correct / total * 100);
  const sid = run.opt.setId;
  if (sid && sid !== 'mistakes') S.best[sid] = Math.max(S.best[sid] || 0, pct);
  // greșeli
  const wrong = run.res.filter(r => !r.ok).map(r => serializeQ(r.q));
  const sigsWrong = new Set(wrong.map(qSig));
  const right = new Set(run.res.filter(r => r.ok).map(r => qSig(r.q)));
  let ms = S.mistakes.filter(m => !right.has(qSig(m)) || sigsWrong.has(qSig(m)));
  wrong.forEach(w => { if (!ms.some(m => qSig(m) === qSig(w))) ms.push(w); });
  S.mistakes = ms.slice(-80);
  save();
  const test = run.mode === 'test';
  const grd = Math.round((1 + 9 * correct / total) * 10) / 10;
  const msg = pct >= 90 ? 'Excelent. Ești gata pentru test.' : pct >= 70 ? 'Bine. Mai repetă ce ai greșit și e perfect.' : pct >= 50 ? 'Ai o bază. Recitește lecția și reia seria.' : 'Mai ai de lucrat. Reia lecția de la început, apoi încearcă din nou.';
  const items = run.res.map((r, i) => `<details class="acc"${r.ok ? '' : ' open'}><summary><span style="color:${r.ok ? 'var(--ok)' : 'var(--bad)'}">${r.ok ? ICO.check : ICO.x}</span><span class="small" style="font-weight:600">Întrebarea ${i + 1}</span></summary>
      <div class="acc-b"><div class="q-instr">${r.q.ins}</div>${r.q.pre ? `<p>${r.q.pre}</p>` : ''}${r.q.text ? `<p class="fr">${r.q.text}</p>` : r.q.kind === 'fill' ? `<p class="fr">${solutionHtml(r.q)}</p>` : ''}
      <p class="small"><b>Răspunsul tău:</b> ${userHtml(r.q, r.ua)}</p>${r.ok ? '' : `<p class="small"><b>Corect:</b> ${solutionHtml(r.q)}</p>`}${r.q.why ? `<p class="small">${r.q.why}</p>` : ''}</div></details>`).join('');
  const mini = run.opt.mini;
  host.innerHTML = mini ? `<div class="card flat"><div class="row"><span class="score" style="font-size:2.4rem">${correct}/${total}</span><div><b>${msg}</b></div></div>
      <div class="btnrow" style="margin-top:14px"><button type="button" class="btn sm" data-act="q-again">Încă o serie</button>${wrong.length ? `<button type="button" class="btn sec sm" data-act="q-show-review">Vezi greșelile</button>` : ''}</div>
      <div id="rv" hidden style="margin-top:14px">${items}</div></div>` : `
    <div class="card" style="margin-bottom:18px">
      ${timeout ? '<p class="warnbox" style="margin-bottom:14px">Timpul a expirat. Întrebările rămase au fost numărate ca greșite.</p>' : ''}
      <div class="row" style="gap:22px"><div><div class="score">${test ? String(grd).replace('.', ',') : correct + '/' + total}</div><div class="small muted">${test ? `${correct} din ${total} corecte · notă estimată` : `${pct}% corecte`}</div></div>
      <div style="flex:1;min-width:220px"><h3 style="margin-bottom:6px">${msg}</h3>${test ? '<p class="small muted">Nota reală depinde de baremul profesoarei. Aceasta e doar o estimare liniară (1 punct din oficiu).</p>' : ''}</div></div>
      <div class="btnrow" style="margin-top:18px"><button type="button" class="btn" data-act="q-again">${test ? 'Un test nou' : 'Reia seria'}</button>${wrong.length ? `<button type="button" class="btn sec" data-act="q-mistakes">Antrenează greșelile (${wrong.length})</button>` : ''}<button type="button" class="btn sec" data-act="q-quit">Înapoi la exerciții</button></div>
    </div>
    <h3 class="sub">Revizuire</h3>${items}`;
  if (!mini) host.scrollIntoView({ block: 'start', behavior: 'smooth' });
  updateNav();
}
ACT['q-show-review'] = () => { const rv = $('#rv', RUN ? RUN.host : document); if (rv) rv.hidden = !rv.hidden; };
ACT['q-again'] = () => { const run = RUN; if (!run) return; const o = run.opt; mountRunner(run.host, o.again ? o.again() : run.qs.map(q => Object.assign({}, q, { id: 'q' + (++QID) })), o); };
ACT['q-mistakes'] = () => { startSet('mistakes'); };

document.addEventListener('focusin', e => { if (e.target && e.target.classList && e.target.classList.contains('fill')) window.__lastFill = e.target; });
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const t = e.target;
  if (!t || !t.classList || !t.classList.contains('fill') || !RUN) return;
  e.preventDefault();
  const inputs = $$('input.fill', RUN.host), at = inputs.indexOf(t);
  if (RUN.locked) { ACT['q-next'](); return; }
  if (RUN.mode === 'test') { if (at < inputs.length - 1) inputs[at + 1].focus(); else ACT['q-next'](); return; }
  if (at < inputs.length - 1 && !inputs[at + 1].value) { inputs[at + 1].focus(); return; }
  ACT['q-check']();
});

/* ---------- pornirea seturilor ---------- */
let CUR_SET = null;
function startSet(id) {
  CUR_SET = id;
  const host = $('#runner');
  if (!host) { go('exercitii'); setTimeout(() => startSet(id), 60); return; }
  let qs, title, again;
  if (id === 'mistakes') {
    if (!S.mistakes.length) { toast('Nu ai greșeli salvate încă. Fă mai întâi o serie.'); return; }
    again = () => S.mistakes.map(m => Object.assign({}, m, { id: 'q' + (++QID), _sel: null }));
    qs = shuffle(again()).slice(0, 15); title = 'Greșelile mele';
  } else {
    const set = SETBY[id]; title = set.t; again = () => set.make(); qs = set.make();
  }
  $('#sets').hidden = true; host.hidden = false;
  RUN_QUIT = () => { host.hidden = true; host.innerHTML = ''; $('#sets').hidden = false; refreshSetCards(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  mountRunner(host, qs, { title, setId: id, again });
  host.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
ACT['set'] = el => startSet(el.dataset.id);
function refreshSetCards() {
  $$('.setcard').forEach(c => {
    const id = c.dataset.id, b = S.best[id], m = c.querySelector('.best');
    if (m) m.textContent = id === 'mistakes' ? `${S.mistakes.length} salvate` : b != null ? `Cel mai bun: ${b}%` : 'Neîncercat';
  });
}
