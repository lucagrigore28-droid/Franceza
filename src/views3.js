/* ===== vizualizări 3: Exerciții, Test, Conjugator, Fișă ===== */

/* ===================== EXERCIȚII ===================== */
const CAT_ORDER = ['ACORD', 'COD / COI', 'PARTICIPIU', 'TIMPURI', 'MIX'];
const CAT_DESC = {
  'ACORD': 'Inima testului: acordul participiului trecut.',
  'COD / COI': 'Recunoaște complementele înainte să acorzi.',
  'PARTICIPIU': 'Formarea participiului și alegerea auxiliarului.',
  'TIMPURI': 'Conjugări și treceri între timpuri verbale.',
  'MIX': 'Un pic din toate.'
};
function setCard(s) {
  const b = S.best[s.id];
  return `<button type="button" class="setcard" data-act="set" data-id="${s.id}" data-best="1"><div class="row" style="justify-content:space-between;gap:8px;flex-wrap:nowrap"><h4>${s.t}</h4>${s.key ? badge('important', 'ess') : ''}</div><p>${s.d}</p><span class="meta"><span>${s.n} întrebări</span><span>·</span><span class="best">${b != null ? 'Cel mai bun: ' + b + '%' : 'Neîncercat'}</span></span></button>`;
}
ACT['lvl'] = el => {
  S.exLevel = +el.dataset.l;
  $$('[data-act="lvl"]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.l === S.exLevel)));
};
VIEWS.exercitii = {
  title: 'Exerciții',
  render() {
    return `
    <span class="eyebrow">Antrenament</span>
    <h1 class="page-title">Exerciții</h1>
    <p class="lead">Alege o serie. După fiecare întrebare primești răspunsul și explicația. Greșelile se salvează și le poți reface oricând din «Greșelile mele».</p>
    <div id="sets">
      <div class="row" style="margin-bottom:6px"><span class="small muted" style="font-weight:700">NIVEL (pentru acord și transformări)</span>
        <div class="seg" role="group" aria-label="Nivel">${[[0, 'Mixt'], [1, 'Ușor'], [2, 'Mediu'], [3, 'Greu']].map(l => `<button type="button" data-act="lvl" data-l="${l[0]}" aria-pressed="${S.exLevel === l[0]}">${l[1]}</button>`).join('')}</div></div>
      <div class="grid2" style="margin-top:16px">
        <button type="button" class="setcard" data-act="set" data-id="mistakes" data-best="1" style="border-color:var(--navy)"><h4>Greșelile mele</h4><p>Reia întrebările la care ai greșit, în ordine amestecată.</p><span class="meta"><span class="best">${S.mistakes.length} salvate</span></span></button>
        <button type="button" class="setcard" data-act="flash-start" style="border-color:var(--navy)"><h4>Cartonașe: participii neregulate</h4><p>Întorci cartonașul și verifici: infinitiv pe față, participiu pe verso.</p><span class="meta"><span>${C.PP.length} cartonașe</span></span></button>
      </div>
      ${CAT_ORDER.map(cat => `<section class="sec" style="margin-top:30px"><h2 style="font-size:1.3rem">${cat === 'COD / COI' ? 'COD și COI' : cat.charAt(0) + cat.slice(1).toLowerCase()}</h2><p class="small muted" style="margin-bottom:12px">${CAT_DESC[cat]}</p><div class="grid-auto">${SETS.filter(s => s.cat === cat).map(setCard).join('')}</div></section>`).join('')}
    </div>
    <div id="runner" hidden></div>
    <div id="flash" hidden></div>`;
  },
  after() { refreshSetCards(); }
};

/* ---- cartonașe ---- */
let FL = null;
function flashShow(on) { $('#flash').hidden = !on; $('#sets').hidden = on; $('#runner').hidden = true; }
ACT['flash-start'] = () => {
  if (!$('#flash')) { go('exercitii'); setTimeout(ACT['flash-start'], 80); return; }
  FL = { deck: shuffle(C.PP.slice()), i: 0, flip: false, known: 0, again: [], total: C.PP.length };
  flashShow(true); flashRender();
  $('#flash').scrollIntoView({ block: 'start' });
};
function flashRender() {
  const h = $('#flash'), f = FL;
  if (f.i >= f.deck.length) {
    h.innerHTML = `<div class="card"><h3>Gata runda</h3><p class="lead" style="margin-bottom:14px">Știai ${f.known} din ${f.deck.length}.${f.again.length ? ` Mai ai ${f.again.length} de repetat.` : ' Toate sunt bifate.'}</p>
      <div class="btnrow">${f.again.length ? `<button type="button" class="btn" data-act="flash-redo">Repetă cele ${f.again.length} rămase</button>` : ''}<button type="button" class="btn sec" data-act="flash-start">Rundă nouă</button><button type="button" class="btn sec" data-act="flash-quit">Înapoi</button></div></div>`;
    return;
  }
  const c = f.deck[f.i], aux = c[4];
  const exm = aux === 'etre' ? `il est ${c[0]}` : aux === 'both' ? `il est ${c[0]} / il a ${c[0]}` : `il a ${c[0]}`;
  const face = f.flip
    ? `<div class="flash-face"><span class="small muted" style="font-weight:700;letter-spacing:.1em">PARTICIPIU</span><div class="big r-AUX r">${c[0]}</div><div class="fr" style="color:var(--ink-2)">${exm}</div>${aux === 'etre' ? badge('cu être', 'av') : aux === 'both' ? badge('avoir sau être', 'av') : ''}</div>`
    : `<div class="flash-face"><span class="small muted" style="font-weight:700;letter-spacing:.1em">INFINITIV</span><div class="big">${c[1]}</div><div class="muted">${c[2]}</div><div class="small muted" style="margin-top:10px">Atinge pentru a întoarce</div></div>`;
  h.innerHTML = `
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 style="font-size:1.25rem">Cartonașe: participii</h3><button type="button" class="btn sec sm" data-act="flash-quit">Ieși</button></div>
    <div class="prog"><span>${f.i + 1} / ${f.deck.length}</span><div class="bar"><i style="width:${Math.round(f.i / f.deck.length * 100)}%"></i></div></div>
    <div class="flash"><button type="button" class="flash-in" style="width:100%;border:0;background:transparent;padding:0;text-align:center" data-act="flash-flip" aria-label="Întoarce cartonașul">${face}</button></div>
    <div class="btnrow" style="margin-top:14px;justify-content:center">${f.flip ? `<button type="button" class="btn sec" data-act="flash-no">Mai repet</button><button type="button" class="btn" data-act="flash-yes">Știu</button>` : `<button type="button" class="btn" data-act="flash-flip">Arată participiul</button>`}</div>
    ${canSpeak ? `<div class="btnrow" style="margin-top:10px;justify-content:center">${f.flip ? sayBtn(exm.split(' / ')[0]) : sayBtn(c[1])}</div>` : ''}`;
}
ACT['flash-flip'] = () => { if (!FL) return; FL.flip = !FL.flip; flashRender(); };
ACT['flash-yes'] = () => { FL.known++; FL.i++; FL.flip = false; flashRender(); };
ACT['flash-no'] = () => { FL.again.push(FL.deck[FL.i]); FL.i++; FL.flip = false; flashRender(); };
ACT['flash-redo'] = () => { FL = { deck: shuffle(FL.again), i: 0, flip: false, known: 0, again: [], total: FL.total }; flashRender(); };
ACT['flash-quit'] = () => { FL = null; flashShow(false); window.scrollTo({ top: 0 }); };

/* ===================== TEST SIMULAT ===================== */
VIEWS.test = {
  title: 'Test simulat',
  render() {
    const b = S.best.test;
    return `
    <span class="eyebrow">Antrenament</span>
    <h1 class="page-title">Test simulat</h1>
    <p class="lead">Ca la clasă: întrebări amestecate, timp limitat, fără indicii. Răspunsurile și explicațiile le vezi abia la sfârșit.</p>
    <div id="test-intro">
      <div class="grid2">
        <div class="card"><h3 style="margin-bottom:10px">Ce primești</h3><ul>
          <li><b>25 de întrebări</b>, noi la fiecare test</li><li><b>30 de minute</b>, cronometru în colț</li><li>Acord cu avoir, être și pronominale</li><li>COD și COI</li><li>Participii și alegerea auxiliarului</li><li>7 transformări între timpuri</li></ul></div>
        <div class="card"><h3 style="margin-bottom:10px">Cum te pregătești</h3><ul>
          <li>Citește lecțiile 1 și 5 înainte.</li><li>Ține la îndemână doar o foaie de ciornă.</li><li>Scrie accentele cu butoanele de sub întrebare.</li><li>La final, refă întrebările greșite din «Greșelile mele».</li></ul>
          ${b != null ? `<p class="small muted">Cel mai bun scor al tău: <b>${b}%</b></p>` : ''}</div>
      </div>
      <div class="btnrow" style="margin-top:20px"><button type="button" class="btn" data-act="test-start">Începe testul ${ICO.arrow}</button></div>
    </div>
    <div id="runner" hidden></div>`;
  },
  after() { }
};
ACT['test-start'] = () => {
  const host = $('#runner'), intro = $('#test-intro');
  intro.hidden = true; host.hidden = false;
  RUN_QUIT = () => { host.hidden = true; host.innerHTML = ''; intro.hidden = false; window.scrollTo({ top: 0 }); };
  CUR_SET = 'test';
  mountRunner(host, makeTest(), { mode: 'test', seconds: 1800, title: 'Test simulat', setId: 'test', again: makeTest });
  host.scrollIntoView({ block: 'start' });
};

/* ===================== CONJUGATOR ===================== */
const CJ = { inf: 'prendre', aux: null, bonus: true };
function lev(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
const KNOWN = Array.from(new Set([...Object.keys(FR.VERBS), ...Object.keys(FR.RO)])).sort((a, b) => a.localeCompare(b, 'fr'));
function cjRender() {
  const out = $('#cj-out'); if (!out) return;
  const raw = CJ.inf, vo = FR.getVerb(raw);
  if (!vo.v) {
    const base = FR.noAcc(FR.norm(raw)).replace(/^se |^s'/, '');
    const sug = KNOWN.map(k => [k, lev(FR.noAcc(k), base)]).filter(x => x[1] <= 2).sort((a, b) => a[1] - b[1]).slice(0, 6).map(x => x[0]);
    out.innerHTML = `<div class="callout warn"><span class="cl">Nu recunosc verbul</span><p>${vo.reason === 'empty' ? 'Scrie un verb la infinitiv.' : `«${esc(raw)}» nu pare un infinitiv francez pe care îl pot conjuga. Scrie verbul la infinitiv (de exemplu <i>chanter</i>, <i>finir</i>, <i>prendre</i>).`}</p>
      ${sug.length ? `<p>Poate ai vrut: ${sug.map(s => `<button type="button" class="chip" data-act="cj-chip" data-v="${esc(s)}">${esc(s)}</button>`).join(' ')}</p>` : ''}</div>`;
    return;
  }
  const v = vo.v, both = v.aux === 'both' && !vo.refl;
  const aux = CJ.aux && both ? CJ.aux : null;
  const o = aux ? { aux } : {};
  const label = (vo.refl ? 'se ' : '') + vo.inf;
  const eff = vo.refl ? 'etre' : (aux || (v.aux === 'both' ? 'etre' : v.aux));
  const T = (ids) => ids.map(id => conjHtml(raw, id, Object.assign({ title: `${TNAME[id]}`, sub: FR.TENSE_RO[id] }, o))).join('');
  const ess = ['present', 'pc', 'imp', 'pqp', 'fs', 'fp', 'pr', 'cond', 'impe'], bon = ['condp', 'subj', 'fa', 'ps'];
  const pp = v.pp, forms = FR.ppForms(pp);
  const notes = [];
  if (vo.assumed) notes.push(`Verbul nu este în baza mea de verbe neregulate. Am presupus <b>grupa 2</b> (-ir, cu -iss-). Dacă la <i>nous</i> face altceva decât <i>-issons</i>, e grupa 3 și formele pot fi greșite.`);
  else if (vo.generic && v.g === 3) notes.push('Verb din grupa 3, conjugat după regula familiei lui (nu e în lista de neregulate). Verifică dacă are forme speciale.');
  if (vo.refl) notes.push('Verb pronominal: auxiliarul este mereu <b>être</b>. Pronumele reflexiv (me, te, se, nous, vous) apare înaintea verbului.');
  out.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px">
        <div><h2 class="fr" style="font-size:2rem;font-family:var(--f-fr);font-weight:600;letter-spacing:0;display:flex;align-items:center;gap:10px">${esc(label)} ${sayBtn(label)}</h2><div class="muted">${esc(v.ro || '')}</div></div>
        <div class="chips">${groupBadge(v)}${vo.refl ? badge('être', 'av') : auxBadge(v)}</div>
      </div>
      <div class="grid2" style="margin-top:14px">
        <div><div class="small muted" style="font-weight:700">PARTICIPIU TRECUT</div><div class="fr" style="font-size:1.3rem"><b class="r r-AUX">${esc(pp)}</b></div><div class="small muted fr">${[...new Set(forms)].map(esc).join(' · ')}</div></div>
        <div><div class="small muted" style="font-weight:700">PARTICIPIU PREZENT</div><div class="fr" style="font-size:1.3rem">${esc(v.ppres)}</div><div class="small muted">nous: ${esc(v.pres[3])}</div></div>
      </div>
      ${both ? `<div class="row" style="margin-top:14px"><span class="small">La passé composé, <b>${esc(vo.inf)}</b> folosește:</span><div class="seg" role="group" aria-label="Auxiliar"><button type="button" data-act="cj-aux" data-a="etre" aria-pressed="${eff === 'etre'}">être (fără COD)</button><button type="button" data-act="cj-aux" data-a="avoir" aria-pressed="${eff === 'avoir'}">avoir (cu COD)</button></div></div>` : ''}
      ${notes.map(n => `<p class="warnbox" style="margin-top:12px">${n}</p>`).join('')}
    </div>
    ${legendHtml}
    <h3 class="sub">Timpurile esențiale</h3>
    <div class="conj-grid">${T(ess)}</div>
    <div class="row" style="margin:26px 0 10px;justify-content:space-between"><h3 class="sub" style="margin:0">Timpuri bonus</h3><button type="button" class="btn sec sm" data-act="cj-bonus">${CJ.bonus ? 'Ascunde' : 'Arată'}</button></div>
    ${CJ.bonus ? `<div class="conj-grid">${T(bon)}</div>` : ''}
    ${eff === 'etre' ? `<p class="small muted" style="margin-top:12px">La timpurile cu <i>être</i>, (e) și (s) arată posibilul acord. Scrii doar ce se potrivește subiectului.</p>` : ''}`;
}
ACT['cj-go'] = () => { CJ.inf = $('#cj-in').value; CJ.aux = null; cjRender(); };
ACT['cj-chip'] = el => { $('#cj-in').value = el.dataset.v; ACT['cj-go'](); };
ACT['cj-aux'] = el => { CJ.aux = el.dataset.a; cjRender(); };
ACT['cj-bonus'] = () => { CJ.bonus = !CJ.bonus; cjRender(); };
VIEWS.conjugator = {
  title: 'Conjugator',
  render() {
    return `
    <span class="eyebrow">Unelte</span>
    <h1 class="page-title">Conjugator</h1>
    <p class="lead">Scrie un verb la infinitiv și primești toate timpurile, cu radicalul și terminațiile evidențiate. Merge și pentru verbe pronominale (<i>se laver</i>).</p>
    <div class="row" style="align-items:stretch">
      <input type="search" id="cj-in" list="cj-list" value="${esc(CJ.inf)}" placeholder="ex. prendre, finir, se laver…" aria-label="Verb la infinitiv" style="flex:1;min-width:200px;font-size:1.1rem" autocomplete="off" autocapitalize="none" spellcheck="false">
      <button type="button" class="btn" data-act="cj-go">Conjugă</button>
    </div>
    <datalist id="cj-list">${KNOWN.map(k => `<option value="${esc(k)}">`).join('')}</datalist>
    <div class="chips" style="margin:12px 0 22px">${['être', 'avoir', 'aller', 'faire', 'prendre', 'venir', 'pouvoir', 'vouloir', 'finir', 'manger', 'se laver', 'partir'].map(v => `<button type="button" class="chip" data-act="cj-chip" data-v="${v}">${v}</button>`).join('')}</div>
    <div id="cj-out"></div>`;
  },
  after() {
    cjRender();
    const i = $('#cj-in');
    i.addEventListener('keydown', e => { if (e.key === 'Enter') ACT['cj-go'](); });
    i.addEventListener('change', () => ACT['cj-go']());
  }
};

/* ===================== FIȘĂ-REZUMAT ===================== */
const GLOSAR = [
  ['subiect', 'cine face acțiunea'], ['verb', 'ce face subiectul'], ['COD', 'complement direct: pe cine? / ce? (fără prepoziție)'], ['COI', 'complement indirect: cui? / despre cine? (cu à / de)'],
  ['infinitiv', 'forma din dicționar (parler)'], ['radical', 'verbul fără terminația infinitivului (parl-)'], ['terminație', 'partea care se schimbă la conjugare'],
  ['auxiliar', 'avoir sau être, la timpurile compuse'], ['participiu trecut', 'forma după auxiliar (mangé, parti)'], ['antecedent', 'cuvântul pe care îl înlocuiește un pronume (les fleurs → que)'],
  ['pronume reflexiv', 'me, te, se, nous, vous la verbe pronominale'], ['acord', 'adăugarea lui -e / -s după gen și număr']
];
VIEWS.fisa = {
  title: 'Fișă-rezumat',
  render() {
    const ids = ['present', 'pc', 'imp', 'pqp', 'fs', 'fp', 'pr', 'cond', 'condp', 'subj', 'fa', 'impe'];
    const rec = ids.map(id => { const t = C.TENSE_BY[id], r = FR.rows(FR.getVerb('parler'), id); return [`<b>${t.fr}</b>`, formulaTxt(t), `<span class="fr">${esc(r[0].full)}</span>`]; });
    const irrFs = C.TENSE_BY.fs.irregular.map(r => `${r[0]} → ${r[1]}`).join(' · ');
    return `
    <span class="eyebrow">Unelte</span>
    <div class="row" style="justify-content:space-between;align-items:flex-start"><h1 class="page-title">Fișă-rezumat</h1><button type="button" class="btn sec no-print" data-act="fisa-copy">Copiază ca text</button></div>
    <p class="lead">Tot ce contează, pe o singură pagină. Citește-o în autobuz, înainte de test, sau copiaz-o ca text.</p>
    <div id="fisa-doc">
    <section class="sec" style="margin-top:20px"><h2>1. Acordul participiului trecut</h2>
      ${tbl(['Auxiliar', 'Situația', 'Acord'], [
        ['ÊTRE', 'verb cu être (aller, partir, arriver…)', 'cu <b>subiectul</b>: <i>elle est partie</i>'],
        ['AVOIR', 'COD <b>înaintea</b> verbului (le, la, l’, les, me, te, nous, vous, que, quel…)', 'cu <b>COD-ul</b>: <i>les fleurs que j’ai achetées</i>'],
        ['AVOIR', 'COD după verb · fără COD · doar COI · <b>en</b>', '<b>invariabil</b>: <i>j’ai acheté les fleurs</i>, <i>je leur ai parlé</i>'],
        ['PRONOMINAL', 'se = COD · esențial pronominal', 'cu subiectul: <i>elle s’est lavée</i>, <i>ils se sont souvenus</i>'],
        ['PRONOMINAL', 'se = COI · COD după verb', 'invariabil: <i>ils se sont parlé</i>, <i>elle s’est lavé les mains</i>'],
        ['PRONOMINAL', 'COD înaintea verbului (que)', 'cu acel COD: <i>les mains qu’elle s’est lavées</i>']
      ], { noKey: false })}
      <p class="small muted" style="margin-top:8px">Forme: +e feminin · +s plural · +es feminin plural. <i>été</i> nu se acordă. COI: <b>niciodată</b>.</p></section>

    <section class="sec"><h2>2. COD sau COI?</h2>
      ${tbl(['', 'COD', 'COI'], [['Întrebare', 'pe cine? / ce?', 'cui? / despre cine?'], ['Prepoziție', 'niciuna', 'à / de'], ['Pronume', 'me, te, <b>le, la, l’, les</b>, nous, vous', 'me, te, <b>lui, leur</b>, nous, vous']])}</section>

    <section class="sec"><h2>3. Participiul trecut</h2>
      ${tbl(['Verbul', 'Participiul'], [['-er (grupa 1)', '-é: parlé'], ['-ir (grupa 2)', '-i: fini'], ['-dre regulat', '-u: vendu'], ['neregulate', '<span class="fr">pris, mis, fait, dit, écrit, ouvert, offert, vu, eu, été, pu, voulu, su, dû, né, mort, venu, tenu, reçu, lu, bu, cru, connu, vécu</span>']])}
      <p style="margin-top:10px"><b>Cu être:</b> <span class="fr">Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir</span> + toate verbele pronominale. Cu COD, <i>monter, descendre, sortir, rentrer, retourner, passer</i> iau avoir.</p></section>

    <section class="sec"><h2>4. Formula fiecărui timp</h2>${tbl(['Timp', 'Formula', 'Exemplu'], rec, { noKey: true })}</section>

    <section class="sec"><h2>5. Terminații (prezent)</h2>
      ${tbl(['', 'je', 'tu', 'il', 'nous', 'vous', 'ils'], C.TENSE_BY.present.endings.rows)}
      <p class="small muted" style="margin-top:8px">Imparfait: radicalul lui <i>nous</i> + ais, ais, ait, ions, iez, aient (être → ét-). Viitor: infinitiv + ai, as, a, ons, ez, ont. Condițional: radical de viitor + terminațiile imperfectului. Subjonctif: radicalul lui <i>ils</i> + e, es, e, ions, iez, ent.</p></section>

    <section class="sec"><h2>6. Radicale neregulate de viitor</h2><p class="fr">${irrFs}</p></section>

    <section class="sec"><h2>7. Propoziții cu SI</h2>
      ${tbl(['SI +', 'Rezultat'], [['présent', 'futur simple'], ['imparfait', 'conditionnel présent'], ['plus-que-parfait', 'conditionnel passé']])}</section>

    <section class="sec"><h2>8. Cuvinte de timp</h2>
      ${tbl(['Cuvinte', 'Timp'], [['hier, il y a…, soudain, un jour, une fois', 'passé composé'], ['autrefois, souvent, toujours, d’habitude, quand j’étais petit', 'imparfait'], ['déjà, la veille, auparavant', 'plus-que-parfait'], ['demain, bientôt, la semaine prochaine', 'futur simple'], ['tout de suite, dans cinq minutes', 'futur proche'], ['à l’instant, tout à l’heure', 'passé récent']], { noKey: true })}</section>

    <section class="sec"><h2>9. Verbe neregulate frecvente</h2>
      <p class="small muted" style="margin-bottom:8px">Prezent (je / nous / ils), imparfait (je), viitor (je), participiu și auxiliar.</p>
      <div class="conj-t tscroll tbl"><table><thead><tr><th>Infinitiv</th><th>Prezent</th><th>Imparfait</th><th>Viitor</th><th>Participiu</th></tr></thead><tbody>${IRR.map(inf => { const vo = FR.getVerb(inf), v = vo.v, pr = FR.rows(vo, 'present'), im = FR.rows(vo, 'imp'), fu = FR.rows(vo, 'fs'); const aux = v.aux === 'both' ? 'avoir / être' : v.aux === 'etre' ? 'être' : 'avoir'; return `<tr><td class="k"><span class="fr">${esc(inf)}</span></td><td class="fr" style="white-space:nowrap">${esc(pr[0].full)} · ${esc(pr[3].full)} · ${esc(pr[5].full)}</td><td class="fr" style="white-space:nowrap">${esc(im[0].full)}</td><td class="fr" style="white-space:nowrap">${esc(fu[0].full)}</td><td class="fr" style="white-space:nowrap"><b class="r r-AUX">${esc(v.pp)}</b> <span class="small muted">(${aux})</span></td></tr>`; }).join('')}</tbody></table></div>
      <p class="small" style="margin-top:8px"><b>Același model:</b> ${IRR_FAM}.</p></section>

    <section class="sec"><h2>10. Glosar</h2>${tbl(['Termen', 'Înseamnă'], GLOSAR)}</section>
    </div>`;
  },
  after() { }
};
ACT['fisa-copy'] = async () => {
  const el = $('#fisa-doc'); if (!el) return;
  try { await navigator.clipboard.writeText(el.innerText); toast('Fișa a fost copiată ca text.'); }
  catch (e) {
    const r = document.createRange(); r.selectNodeContents(el);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    toast('Textul e selectat. Apasă Ctrl / ⌘ + C.');
  }
};
