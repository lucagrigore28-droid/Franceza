/* ===== vizualizări 1: Acasă, Bazele, Grupele ===== */
const VIEWS = {};
const tk = (word, role, cap, hidden) => {
  const k = ROLE_CLS[role] || 'CC';
  return `<span class="tk${hidden ? ' hid' : ''}"><span class="fr r r-${k}">${word}</span><i class="c-${k}">${cap != null ? cap : (ROLE_LABEL[role] || '')}</i></span>`;
};
const plainTk = (word, cap) => `<span class="tk"><span class="fr">${word}</span><i style="visibility:hidden">·</i></span>`;
const board = (inner, tr) => `<div class="board"><div class="line">${inner}</div>${tr ? `<p class="tr">${tr}</p>` : ''}</div>`;
function lessonFooter(id, prev, next) {
  const done = !!S.done[id];
  return `<div class="pager no-print">
    <div class="btnrow">${prev ? `<a class="btn sec" href="#${prev[0]}">${ICO.back} ${prev[1]}</a>` : ''}</div>
    <div class="btnrow"><button type="button" class="btn ${done ? 'sec' : ''}" data-act="done" data-id="${id}" aria-pressed="${done}">${done ? ICO.check + ' Lecție înțeleasă' : 'Am înțeles lecția'}</button>${next ? `<a class="btn ${done ? '' : 'sec'}" href="#${next[0]}">${next[1]} ${ICO.arrow}</a>` : ''}</div></div>`;
}
ACT['done'] = el => {
  const id = el.dataset.id, now = !S.done[id];
  markDone(id, now);
  el.setAttribute('aria-pressed', String(now));
  el.className = 'btn' + (now ? ' sec' : '');
  el.innerHTML = now ? ICO.check + ' Lecție înțeleasă' : 'Am înțeles lecția';
  if (now) toast('Bravo. Lecție marcată ca înțeleasă.');
};
function nextLesson() {
  const names = { baze: 'Bazele: COD și COI', grupe: 'Grupele de verbe', timpuri: 'Timpurile', participiu: 'Participiul trecut', acord: 'Acordul participiului' };
  const id = LESSONS.find(k => !S.done[k]);
  return id ? [id, names[id]] : ['test', 'Test simulat'];
}

/* ===================== ACASĂ ===================== */
let HERO = 1;
function heroBoard() {
  if (HERO === 0) {
    return board(
      tk('J’', 'S') + tk('ai', 'AUX', 'auxiliar') + tk('acheté', 'PP', 'fără acord') + tk('les fleurs', 'COD', 'COD după verb'),
      'Am cumpărat florile.') + `<p style="margin-top:12px">COD-ul <b class="r-COD r">les fleurs</b> vine <b>după</b> verb. Participiul rămâne <b class="r-AUX r">acheté</b>.</p>`;
  }
  return board(
    tk('Les fleurs', 'ANT', '') + tk('que', 'COD', 'COD înainte') + tk('j’', 'S') + tk('ai', 'AUX', 'auxiliar') + tk('achetées', 'PP', 'acord: -es'),
    'Florile pe care le-am cumpărat.') + `<p style="margin-top:12px"><b class="r-COD r">que</b> înlocuiește <i>les fleurs</i> (feminin plural) și stă <b>înaintea</b> verbului. Participiul se acordă: <b class="r-AUX r">achetées</b>.</p>`;
}
ACT['hero'] = el => {
  HERO = +el.dataset.i;
  $$('#hero [data-act="hero"]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === HERO)));
  $('#hero-b').innerHTML = heroBoard();
};
function planHtml() {
  const days = S.plan.days, plan = C.PLANS[days];
  let total = 0, done = 0;
  const body = plan.map((d, di) => `<div><h4 style="margin:6px 0 8px">${d.day}</h4><div class="stack" style="gap:8px">${d.steps.map((s, si) => {
    const key = `${days}:${di}:${si}`, on = !!S.plan.steps[key];
    total++; if (on) done++;
    return `<label class="todo${on ? ' done' : ''}"><input type="checkbox" data-act="plan-chk" data-key="${key}" ${on ? 'checked' : ''}><span><a href="#" data-act="plan-go" data-id="${s[0]}">${s[1]}</a> <span class="small muted">· ${s[2]} min</span></span></label>`;
  }).join('')}</div></div>`).join('');
  const mins = plan.reduce((a, d) => a + d.steps.reduce((b, s) => b + s[2], 0), 0);
  return { body, total, done, mins };
}
function renderPlan() {
  const p = planHtml();
  $('#plan-b').innerHTML = p.body;
  $('#plan-sum').textContent = `${p.done} din ${p.total} pași · aproximativ ${String(Math.round(p.mins / 60 * 10) / 10).replace('.', ',')} ore în total`;
  $$('#plan-seg button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === S.plan.days)));
}
ACT['plan-days'] = el => { S.plan.days = +el.dataset.d; save(); renderPlan(); };
ACT['plan-chk'] = el => {
  if (el.checked) S.plan.steps[el.dataset.key] = 1; else delete S.plan.steps[el.dataset.key];
  save(); renderPlan();
};
ACT['plan-go'] = (el, e) => {
  e.preventDefault();
  const id = el.dataset.id;
  const sets = { exercitii: 'acord-avoir', exercitii2: 'transform', exercitii3: 'codcoi', exercitii4: S.mistakes.length ? 'mistakes' : 'mixt' };
  if (id === 'exercitii0') { go('exercitii'); setTimeout(() => ACT['flash-start'](), 80); return; }
  if (sets[id]) { go('exercitii'); setTimeout(() => startSet(sets[id]), 80); return; }
  go(id);
};

VIEWS.start = {
  title: 'Acasă',
  render() {
    const pct = progressPct(), nx = nextLesson(), p = planHtml();
    return `
    <span class="eyebrow">Clasa a 11-a · Unitatea 1 · Pregătire pentru test</span>
    <h1 class="page-title">Franceza pentru test, explicată de la zero</h1>
    <p class="lead">Acordul participiului trecut cu COD și COI, plus trecerea între timpuri verbale. Aici găsești teoria, tabelele, exemplele și exercițiile. Nu trebuie să cauți nimic în altă parte.</p>

    <div class="card" id="hero">
      <div class="row" style="justify-content:space-between;margin-bottom:14px">
        <div><b>Ideea întregii lecții, într-un exemplu</b><div class="small muted">Atinge ca să vezi cum se schimbă participiul.</div></div>
        <div class="seg" role="group" aria-label="Poziția COD-ului"><button type="button" data-act="hero" data-i="0" aria-pressed="${HERO === 0}">COD după verb</button><button type="button" data-act="hero" data-i="1" aria-pressed="${HERO === 1}">COD înaintea verbului</button></div>
      </div>
      <div id="hero-b">${heroBoard()}</div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="row" style="gap:22px">
        <div class="ring" style="--p:${pct}" role="img" aria-label="Progres ${pct}%"><span>${pct}%</span></div>
        <div style="flex:1;min-width:220px">
          <h3 style="margin-bottom:6px">${pct === 0 ? 'Începe de aici' : pct >= 90 ? 'Ești aproape gata' : 'Continuă de unde ai rămas'}</h3>
          <p class="muted" style="margin-bottom:12px">Progresul se salvează în acest browser. Cele 5 lecții se parcurg în ordine, fiecare construiește pe cea dinainte.</p>
          <a class="btn" href="#${nx[0]}">${nx[1]} ${ICO.arrow}</a>
        </div>
      </div>
    </div>

    <section class="sec">
      <h2>Cele trei reguli ale acordului</h2>
      <p class="muted prose">Dacă reții doar atât, rezolvi cam 80% din exerciții. Lecția 5 le explică pe fiecare, cu excepții.</p>
      <div class="grid3" style="margin-top:14px">
        <div class="card flat"><span class="badge av">1 · ÊTRE</span><h4 style="margin:10px 0 6px">Se acordă cu subiectul</h4><p class="fr" style="margin:0">Elle est <b class="r-AUX r">partie</b>.</p></div>
        <div class="card flat"><span class="badge g1">2 · AVOIR</span><h4 style="margin:10px 0 6px">Se acordă cu COD-ul, doar dacă e înaintea verbului</h4><p class="fr" style="margin:0">Les fleurs que j’ai <b class="r-AUX r">achetées</b>.<br>J’ai <b class="r-AUX r">acheté</b> les fleurs.</p></div>
        <div class="card flat"><span class="badge g3">3 · COI</span><h4 style="margin:10px 0 6px">Nu declanșează niciodată acordul</h4><p class="fr" style="margin:0">Je leur ai <b class="r-AUX r">parlé</b>.</p></div>
      </div>
    </section>

    <section class="sec">
      <h2>Planul tău până la test</h2>
      <p class="muted prose">Alege câte zile ai. Bifează pașii pe măsură ce îi termini. Apasă pe un pas ca să mergi direct acolo.</p>
      <div class="row" style="margin:14px 0"><div class="seg" id="plan-seg" role="group" aria-label="Zile rămase">${[1, 3, 7].map(d => `<button type="button" data-act="plan-days" data-d="${d}" aria-pressed="${S.plan.days === d}">${d === 1 ? 'O zi' : d + ' zile'}</button>`).join('')}</div><span class="small muted" id="plan-sum">${p.done} din ${p.total} pași · aproximativ ${String(Math.round(p.mins / 60 * 10) / 10).replace('.', ',')} ore în total</span></div>
      <div class="stack" id="plan-b" style="gap:16px">${p.body}</div>
    </section>

    <section class="sec">
      <h2>În ziua testului</h2>
      <div class="grid2" style="margin-top:12px">
        <div class="card flat"><h4>La un exercițiu cu timpuri</h4><ol>
          <li>Subliniază verbul și găsește subiectul.</li><li>Scrie infinitivul și grupa lui.</li><li>Ia rețeta timpului cerut (formula din fișa timpului).</li><li>La timpurile compuse alege auxiliarul, apoi participiul.</li><li>Recitește: <i>-s</i> la <i>tu</i>, <i>-nt</i> la <i>ils</i>, accentele.</li></ol></div>
        <div class="card flat"><h4>La un participiu trecut</h4><ol>
          <li>Care e auxiliarul: avoir sau être?</li><li>Dacă e être: se acordă cu subiectul.</li><li>Dacă e avoir: caută COD-ul (pe cine? ce?).</li><li>Este înaintea verbului? Atunci acordă.</li><li>Este COI sau «en»? Nu acorda.</li></ol></div>
      </div>
    </section>`;
  }
};

/* ===================== BAZELE ===================== */
let AN = { idx: 0, step: 0 };
const AN_STEPS = ['S', 'V', 'COD', 'COI'];
function anSteps(s) { return s.fin ? [...AN_STEPS, 'ACORD'] : AN_STEPS; }
function anRender() {
  const s = C.ANALYZER[AN.idx], steps = anSteps(s), st = AN.step;
  const shown = new Set();
  steps.slice(0, st).forEach(k => {
    if (k === 'V') ['V', 'AUX', 'PP'].forEach(r => shown.add(r)); else shown.add(k);
  });
  const toks = s.t.map(([w, r]) => {
    const vis = shown.has(r) || (r === 'PP' && shown.has('V')) || (r === 'ANT' && st >= 3) || (r === 'CC' && st >= 1);
    const cap = r === 'PP' ? 'participiu' : r === 'AUX' ? 'auxiliar' : r === 'ANT' ? '(antecedent)' : ROLE_LABEL[r];
    if (!vis) return plainTk(esc(w));
    return tk(esc(w), r, cap);
  }).join('');
  const has = r => s.t.some(t => t[1] === r);
  const textOf = r => s.t.filter(t => t[1] === r).map(t => `<b class="r r-${ROLE_CLS[r]}">${esc(t[0])}</b>`).join(' ');
  let panel;
  if (st === 0) panel = `<p><b>Pasul 0.</b> Citește propoziția. Apasă «Pasul următor» ca să o analizăm împreună, un rol pe rând.</p>`;
  else {
    const k = steps[st - 1];
    if (k === 'S') panel = `<p><span class="rb rb-S">1 · Subiect</span></p><p><b>Cine face acțiunea?</b> Răspuns: ${textOf('S')}.</p>`;
    else if (k === 'V') panel = `<p><span class="rb rb-V">2 · Verb</span></p><p><b>Ce face subiectul?</b> ${s.pc ? `Verbul este la passé composé: auxiliar ${textOf('AUX')} + participiu ${textOf('PP')}.` : `Verbul este ${textOf('V')}.`}</p>`;
    else if (k === 'COD') panel = `<p><span class="rb rb-COD">3 · COD</span></p><p><b>Pune după verb «pe cine?» sau «ce?», fără à / de.</b></p><p>${has('COD') ? `Răspuns: ${textOf('COD')}. Deci ${textOf('COD')} este COD.` : 'Nu primești niciun răspuns, deci <b>nu există COD</b>.'}</p>`;
    else if (k === 'COI') panel = `<p><span class="rb rb-COI">4 · COI</span></p><p><b>Pune după verb «cui?», «despre cine?» sau «despre ce?» (cu à / de).</b></p><p>${has('COI') ? `Răspuns: ${textOf('COI')}. Deci ${textOf('COI')} este COI.` : 'Nu există niciun complement introdus de <i>à</i> sau <i>de</i>, deci <b>nu există COI</b>.'}</p>`;
    else panel = `<p><span class="rb rb-AUX">5 · Acordul</span></p><p>${s.fin.why}</p><p style="font-size:1.1rem">Participiul se scrie: <b class="fr r r-AUX" style="font-size:1.35rem">${esc(s.fin.word)}</b></p>`;
    if (st === steps.length && s.note) panel += `<div class="callout tip" style="margin-top:10px"><span class="cl">Reține</span>${s.note}</div>`;
  }
  $('#an-b').innerHTML = `${board(toks, esc(s.ro))}<div class="callout" style="margin-top:14px;min-height:96px">${panel}</div>`;
  $('#an-prev').disabled = st === 0;
  $('#an-next').disabled = st >= steps.length;
  $('#an-count').textContent = `Pasul ${st} / ${steps.length}`;
}
ACT['an-next'] = () => { AN.step++; anRender(); };
ACT['an-prev'] = () => { AN.step = Math.max(0, AN.step - 1); anRender(); };
ACT['an-reset'] = () => { AN.step = 0; anRender(); };
ACT['an-pick'] = el => { AN.idx = +el.dataset.i; AN.step = 0; $$('#an-pills button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === AN.idx))); anRender(); };

const BASE_VERBS = [
  ['COD', 'voir, regarder, écouter, aimer, aider, attendre, chercher, prendre, acheter, manger, finir, lire, inviter, appeler, connaître, perdre, mettre, ouvrir'],
  ['COI', 'parler à, téléphoner à, répondre à, obéir à, plaire à, sourire à, ressembler à, penser à, mentir à, nuire à, convenir à · parler de, se souvenir de, avoir besoin de, s’occuper de, se servir de'],
  ['COD + COI', 'donner qqch à qqn, dire qqch à qqn, écrire qqch à qqn, offrir qqch à qqn, envoyer qqch à qqn, demander qqch à qqn, montrer qqch à qqn, prêter qqch à qqn']
];
VIEWS.baze = {
  title: 'Bazele: COD și COI',
  render() {
    return `
    <span class="eyebrow">Lecția 1</span>
    <h1 class="page-title">Bazele: ce sunt COD și COI</h1>
    <p class="lead">Fără ele nu se poate face acordul participiului. Le luăm de la zero, cu ajutorul limbii române, care are aceleași idei sub alte nume.</p>

    <section class="sec">
      <h2>Părțile unei propoziții</h2>
      <div class="prose"><p>Orice propoziție are un <b>subiect</b> (cine face acțiunea) și un <b>verb</b> (ce face). Restul cuvintelor sunt <b>complemente</b>: ele completează sensul verbului. La test ne interesează două feluri de complemente: <b>COD</b> și <b>COI</b>.</p></div>
      ${board(tk('Marie', 'S') + tk('mange', 'V') + tk('une pomme', 'COD'), 'Marie mănâncă un măr.')}
      <div class="chips" style="margin-top:14px"><span class="rb rb-S">subiect</span><span class="rb rb-V">verb</span><span class="rb rb-COD">COD</span><span class="rb rb-COI">COI</span><span class="rb rb-AUX">auxiliar / participiu</span><span class="small muted" style="align-self:center">Culorile acestea le folosim peste tot în site.</span></div>
    </section>

    <section class="sec">
      <h2>COD: complementul direct</h2>
      <div class="prose">
        <p><b>COD</b> înseamnă <i>complément d’objet direct</i>. Este cuvântul (sau grupul de cuvinte) care răspunde la întrebarea <b>«pe cine?»</b> sau <b>«ce?»</b> pusă după verb. Este legat de verb <b>direct</b>, fără prepoziție între ele.</p>
        <p>În română, COD-ul este de obicei complementul în acuzativ: «mănânc <u>un măr</u>», «văd <u>pe Maria</u>».</p>
      </div>
      ${callout('rule', 'Testul COD', `<p>Pune după verb <b>pe cine?</b> / <b>ce?</b>. Dacă primești un răspuns și între verb și răspuns <b>nu este</b> <i>à</i> sau <i>de</i>, ai găsit COD-ul.</p>`)}
      ${exList([
        [`Nous ${R.V('regardons')} ${R.COD('le film')}.`, 'Ne uităm la film. (regarder qqch: fără prepoziție în franceză)'],
        [`Tu ${R.V('écoutes')} ${R.COD('la musique')}.`, 'Asculți muzica.'],
        [`Il ${R.V('aime')} ${R.COD('ses parents')}.`, 'Își iubește părinții.']
      ])}
    </section>

    <section class="sec">
      <h2>COI: complementul indirect</h2>
      <div class="prose">
        <p><b>COI</b> înseamnă <i>complément d’objet indirect</i>. Răspunde la <b>«cui?»</b>, <b>«despre cine?»</b>, <b>«despre ce?»</b> și este legat de verb printr-o prepoziție: <b>à</b> sau <b>de</b>.</p>
        <p>În română, COI-ul este de obicei complementul în dativ: «dau cartea <u>lui Paul</u>», «telefonez <u>mamei</u>».</p>
      </div>
      ${callout('rule', 'Testul COI', `<p>Pune după verb <b>à qui? / à quoi?</b> sau <b>de qui? / de quoi?</b> (cui? / despre cine? / despre ce?). Dacă răspunsul vine cu <i>à</i> sau <i>de</i>, este COI.</p>`)}
      ${exList([
        [`Paul ${R.V('parle')} ${R.COI('à son frère')}.`, 'Paul vorbește cu fratele lui. (parler À qqn)'],
        [`Elle ${R.V('téléphone')} ${R.COI('à sa mère')}.`, 'Îi telefonează mamei.'],
        [`Ils ${R.V('parlent')} ${R.COI('de leurs vacances')}.`, 'Vorbesc despre vacanța lor. (parler DE qqch)']
      ])}
      <p class="muted">O propoziție poate avea și COD, și COI: <span class="fr">Elle ${R.V('donne')} ${R.COD('un livre')} ${R.COI('à Paul')}.</span> (Îi dă o carte lui Paul.)</p>
    </section>

    <section class="sec">
      <h2>COD sau COI? Comparația rapidă</h2>
      ${tbl(['', 'COD', 'COI'], [
        ['Întrebarea', 'pe cine? / ce?', 'cui? / despre cine? / despre ce?'],
        ['Prepoziție', 'niciuna', 'à sau de'],
        ['În română', 'de obicei acuzativ', 'de obicei dativ'],
        ['Pronume', 'me, te, le, la, l’, nous, vous, les', 'me, te, lui, nous, vous, leur'],
        ['Acordul participiului', 'Declanșează acordul, dacă e înaintea verbului', '<b>Nu</b> declanșează niciodată acordul'],
        ['Exemplu', `<span class="fr">Je ${R.COD('la')} vois.</span>`, `<span class="fr">Je ${R.COI('lui')} parle.</span>`]
      ])}
    </section>

    <section class="sec">
      <h2>Pronumele personale: cine e COD, cine e COI</h2>
      <p class="muted prose">La passé composé, COD-ul apare adesea ca pronume așezat <b>înaintea</b> verbului. Atunci trebuie să-l recunoști.</p>
      ${tbl(['Persoana', 'COD', 'COI'], [
        ['eu', 'me (m’)', 'me (m’)'], ['tu', 'te (t’)', 'te (t’)'], ['el / ea', '<b>le</b> (el), <b>la</b> (ea), <b>l’</b> (înaintea vocalei)', '<b>lui</b>'],
        ['noi', 'nous', 'nous'], ['voi', 'vous', 'vous'], ['ei / ele', '<b>les</b>', '<b>leur</b>']
      ])}
      <div class="grid2" style="margin-top:14px">
        ${callout('tip', 'Ușor', `<p><b>le, la, l’, les</b> sunt <b>doar</b> COD. <b>lui, leur</b> sunt <b>doar</b> COI.</p>`)}
        ${callout('warn', 'Atenție', `<p><b>me, te, nous, vous</b> pot fi și COD, și COI. Rolul depinde de verb: <span class="fr">Je ${R.COD('te')} vois</span> (voir qqn → COD), <span class="fr">Je ${R.COI('te')} parle</span> (parler à qqn → COI).</p>`)}
      </div>
      ${callout('rule', 'Truc pentru persoana a 3-a', `<p>Poți înlocui complementul cu <b>lui</b> / <b>leur</b>? Atunci era COI. Altfel (<b>le, la, les</b>) era COD. <span class="fr">Je parle à Paul → je ${R.COI('lui')} parle.</span> <span class="fr">Je vois Paul → je ${R.COD('le')} vois.</span></p>`)}
    </section>

    <section class="sec">
      <h2>Verbe frecvente</h2>
      <div class="grid3">${BASE_VERBS.map((b, i) => `<div class="card flat"><span class="rb rb-${b[0] === 'COD' ? 'COD' : b[0] === 'COI' ? 'COI' : 'AUX'}">${b[0]}</span><p class="fr" style="margin:10px 0 0;font-size:1.05rem;line-height:1.7">${b[1]}</p></div>`).join('')}</div>
    </section>

    <section class="sec">
      <h2>Capcane: româna și franceza nu se potrivesc mereu</h2>
      <p class="muted prose">Unele verbe cer prepoziție în română, dar nu în franceză (și invers). Regula nu merge prin traducere, ci prin verbul francez.</p>
      ${tbl(['În română', 'În franceză', 'Funcție'], [
        ['a se uita <b>la</b> film', '<span class="fr">regarder le film</span>', '<span class="rb rb-COD">COD</span>'],
        ['a aștepta <b>pe</b> cineva', '<span class="fr">attendre quelqu’un</span>', '<span class="rb rb-COD">COD</span>'],
        ['a căuta <b>după</b> ceva', '<span class="fr">chercher quelque chose</span>', '<span class="rb rb-COD">COD</span>'],
        ['a asculta <b>pe</b> cineva', '<span class="fr">écouter quelqu’un</span>', '<span class="rb rb-COD">COD</span>'],
        ['a ajuta <b>pe</b> cineva', '<span class="fr">aider quelqu’un</span>', '<span class="rb rb-COD">COD</span>'],
        ['a răspunde <b>cuiva</b>', '<span class="fr">répondre à quelqu’un</span>', '<span class="rb rb-COI">COI</span>'],
        ['a telefona <b>cuiva</b>', '<span class="fr">téléphoner à quelqu’un</span>', '<span class="rb rb-COI">COI</span>'],
        ['a-i plăcea <b>cuiva</b>', '<span class="fr">plaire à quelqu’un</span>', '<span class="rb rb-COI">COI</span>'],
        ['a se gândi <b>la</b> ceva', '<span class="fr">penser à quelque chose</span>', '<span class="rb rb-COI">COI</span>']
      ], { noKey: true })}
    </section>

    <section class="sec">
      <h2>Analizator interactiv</h2>
      <p class="muted prose">Alege o propoziție și parcurge-o pas cu pas. Ultimele șase sunt la passé composé și arată cum ajută COD-ul la acord.</p>
      <div class="chips" id="an-pills" style="margin:14px 0" role="group" aria-label="Alege propoziția">${C.ANALYZER.map((s, i) => `<button type="button" class="chip" data-act="an-pick" data-i="${i}" aria-pressed="${i === AN.idx}" title="${esc(s.ro)}">${i + 1}${s.pc ? ' · pc' : ''}</button>`).join('')}</div>
      <div id="an-b"></div>
      <div class="btnrow" style="margin-top:14px"><button type="button" class="btn sec sm" id="an-prev" data-act="an-prev">${ICO.back} Înapoi</button><button type="button" class="btn sm" id="an-next" data-act="an-next">Pasul următor ${ICO.arrow}</button><button type="button" class="btn sec sm" data-act="an-reset">Reia</button><span class="small muted" id="an-count"></span></div>
    </section>

    <section class="sec">
      <h2>Verifică-te</h2>
      <p class="muted prose">Patru propoziții. Apasă pe COD-ul sau COI-ul cerut.</p>
      <div id="mini" style="margin-top:14px"></div>
    </section>
    ${lessonFooter('baze', null, ['grupe', 'Grupele de verbe'])}`;
  },
  after() {
    anRender();
    const mk = () => [...sample(C.TAP.filter(t => t.find === 'COD' && !t.none), 1), ...sample(C.TAP.filter(t => t.find === 'COI' && !t.none), 1), ...sample(C.TAP.filter(t => t.none), 1), ...sample(C.TAP.filter(t => !t.none), 1)].map(tapQ);
    mountRunner($('#mini'), mk(), { mini: true, mode: 'practice', again: mk, focus: false });
  }
};

/* ===================== GRUPELE DE VERBE ===================== */
const SPELL = [
  ['-ger', 'manger', 'Se păstrează <b>e</b> înaintea lui a / o, ca să rămână sunetul moale.', ['present', 3], ['imp', 0]],
  ['-cer', 'commencer', 'c devine <b>ç</b> înaintea lui a / o.', ['present', 3], ['imp', 0]],
  ['-yer', 'nettoyer', 'y devine <b>i</b> înaintea unui e mut (je, tu, il, ils).', ['present', 0], ['present', 3]],
  ['-eler / -eter', 'appeler', 'Consoana se dublează înaintea unui e mut. (Excepții cu è: acheter, geler, peler.)', ['present', 0], ['present', 3]],
  ['e + consoană + er', 'lever', 'e devine <b>è</b> înaintea unui e mut.', ['present', 0], ['present', 3]],
  ['é + consoană + er', 'préférer', 'é devine <b>è</b> înaintea unui e mut. La viitor rămâne é.', ['present', 0], ['fs', 0]]
];
const fm = (inf, t, i) => FR.rows(FR.getVerb(inf), t)[i].full;
let GQ = '';
function groupInfo(input) {
  const vo = FR.getVerb(input);
  if (!vo.v) return `<p class="warnbox">Nu recunosc «${esc(input)}». Scrie un infinitiv francez (de exemplu <i>chanter</i>, <i>partir</i>, <i>prendre</i>).</p>`;
  const v = vo.v;
  let why;
  if (v.g === 1) why = `se termină în <b>-er</b> (și nu e <i>aller</i>) → grupa 1`;
  else if (v.g === 2 && !vo.assumed) why = `se termină în <b>-ir</b> și are <b>-iss-</b> la nous: <i>${fm(vo.inf, 'present', 3)}</i> → grupa 2`;
  else if (v.g === 2) why = `se termină în <b>-ir</b>. Dacă la nous face <i>-issons</i> (nous ${v.pres[3]}…) este grupa 2. Verbele ca <i>partir, dormir, ouvrir</i> sunt grupa 3`;
  else why = v.inf === 'aller' ? '<i>aller</i> se termină în -er, dar este neregulat → grupa 3' : `nu este nici -er, nici -ir cu -issons → grupa 3`;
  return `<p><b class="fr" style="font-size:1.2rem">${esc(vo.inf)}</b> ${groupBadge(v)} ${auxBadge(v)}</p><p>${why}. Forma <i>nous</i>: <b>${fm(vo.inf, 'present', 3)}</b>. Participiu: <b>${esc(v.pp)}</b>.</p>`;
}
ACT['grp-ask'] = () => { const v = $('#grp-in').value.trim(); if (v) $('#grp-out').innerHTML = groupInfo(v); };
ACT['grp-chip'] = el => { $('#grp-in').value = el.dataset.v; $('#grp-out').innerHTML = groupInfo(el.dataset.v); };
function allTenseTable(inf) {
  const T = [['present', 'Prezent'], ['imp', 'Imparfait'], ['fs', 'Futur'], ['cond', 'Condițional'], ['subj', 'Subjonctif'], ['pc', 'Passé composé']];
  const vo = FR.getVerb(inf), rs = T.map(t => FR.rows(vo, t[0]));
  return `<div class="tscroll tbl"><table><thead><tr>${T.map(t => `<th>${t[1]}</th>`).join('')}</tr></thead><tbody>${[0, 1, 2, 3, 4, 5].map(i => `<tr>${rs.map(r => `<td class="fr" style="white-space:nowrap">${esc(r[i].full)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
VIEWS.grupe = {
  title: 'Grupele de verbe',
  render() {
    return `
    <span class="eyebrow">Lecția 2</span>
    <h1 class="page-title">Grupele de verbe</h1>
    <p class="lead">Terminațiile se schimbă după grupa verbului. Dacă știi grupa, știi cum se formează aproape orice timp.</p>

    <section class="sec">
      <h2>Cum e făcut un verb</h2>
      <div class="prose"><p>Forma din dicționar se numește <b>infinitiv</b>: <span class="fr">parler</span> (a vorbi). El are două părți: <b>radicalul</b> (partea care poartă sensul) și <b>terminația</b>. Când conjugi, păstrezi radicalul și schimbi terminația, după persoană și timp.</p></div>
      ${board(`<span class="tk"><span class="fr" style="color:var(--ink)">parl</span><i style="color:var(--ink-3)">radical</i></span><span class="tk"><span class="fr" style="color:var(--v);font-weight:700">er</span><i class="c-V">terminație</i></span>`, 'a vorbi')}
      <h3 class="sub">Cele șase persoane</h3>
      ${tbl(['', 'Singular', 'Plural'], [['Persoana 1', '<span class="fr">je</span> (eu)', '<span class="fr">nous</span> (noi)'], ['Persoana 2', '<span class="fr">tu</span> (tu)', '<span class="fr">vous</span> (voi / dumneavoastră)'], ['Persoana 3', '<span class="fr">il / elle / on</span> (el / ea / se, noi)', '<span class="fr">ils / elles</span> (ei / ele)']])}
      <p class="small muted" style="margin-top:8px"><b>on</b> se conjugă ca <i>il</i>. În vorbirea de zi cu zi înlocuiește adesea <i>nous</i>. Înaintea vocalei, <i>je</i> devine <b>j’</b> (<i>j’aime</i>).</p>
    </section>

    <section class="sec">
      <h2>Cele trei grupe</h2>
      <div class="grid3">
        <div class="card flat"><span class="badge g1">Grupa 1</span><h4 style="margin:10px 0 4px">-er</h4><p class="small">Cea mai mare: ~9 din 10 verbe. Regulate. Singura excepție: <i>aller</i>.</p><p class="fr" style="line-height:1.7">parler, aimer, manger, regarder, travailler, habiter, étudier, chanter, commencer, acheter, appeler</p></div>
        <div class="card flat"><span class="badge g2">Grupa 2</span><h4 style="margin:10px 0 4px">-ir, cu -iss-</h4><p class="small">Regulate. La nous, vous, ils apare <b>-iss-</b>: nous fin<b>iss</b>ons.</p><p class="fr" style="line-height:1.7">finir, choisir, réussir, grandir, obéir, réfléchir, remplir, punir, agir, grossir, maigrir, rougir</p></div>
        <div class="card flat"><span class="badge g3">Grupa 3</span><h4 style="margin:10px 0 4px">Tot restul</h4><p class="small">Neregulate, dar în familii. Le învățați pe cele frecvente.</p><p class="fr" style="line-height:1.7">aller · partir, sortir, dormir, venir, tenir, ouvrir, offrir · voir, savoir, vouloir, pouvoir, devoir, recevoir · prendre, mettre, faire, dire, lire, écrire, vendre, attendre, boire, connaître, croire, vivre · être, avoir</p></div>
      </div>
      ${callout('rule', 'Cum deosebești grupa 2 de grupa 3 la verbele în -ir', `<p>Pune verbul la <b>nous</b>, prezent. <span class="fr">nous fin<b>iss</b>ons</span> → are <i>-iss-</i> → grupa 2. <span class="fr">nous partons</span> → nu are → grupa 3.</p>`)}
      <h3 class="sub">Ce grupă e verbul tău?</h3>
      <div class="row"><input type="text" id="grp-in" placeholder="ex. choisir" aria-label="Verb la infinitiv" style="flex:1;min-width:180px" autocomplete="off" autocapitalize="none" spellcheck="false"><button type="button" class="btn" data-act="grp-ask">Află grupa</button></div>
      <div class="chips" style="margin-top:10px">${['parler', 'finir', 'partir', 'prendre', 'aller', 'vendre', 'ouvrir', 'pouvoir'].map(v => `<button type="button" class="chip" data-act="grp-chip" data-v="${v}">${v}</button>`).join('')}</div>
      <div id="grp-out" class="callout" style="margin-top:12px"><span class="cl">Rezultat</span>${groupInfo('finir')}</div>
    </section>

    <section class="sec">
      <h2>Prezentul pe grupe, una lângă alta</h2>
      <p class="muted prose">Observă că radicalul rămâne, iar terminația (roșu) arată grupa.</p>
      ${legendHtml}
      <div class="conj-grid">${conjHtml('parler', 'present')}${conjHtml('finir', 'present')}${conjHtml('vendre', 'present')}</div>
      <p class="small muted" style="margin-top:8px"><i>vendre</i> aparține grupei 3, dar este regulat: radical + <i>-s, -s, —, -ons, -ez, -ent</i>. La persoana a 3-a nu are terminație.</p>
    </section>

    <section class="sec">
      <h2>Verbe în -er care își schimbă ortografia</h2>
      <p class="muted prose">Sunt tot grupa 1, dar scrierea se adaptează ca pronunția să rămână aceeași. Apar des în exerciții.</p>
      ${tbl(['Tip', 'Regula', 'Exemplu'], SPELL.map(s => [`<span class="fr">${s[0]}</span>`, s[2], `<span class="fr" style="white-space:nowrap">${fm(s[1], s[3][0], s[3][1])}<br>${fm(s[1], s[4][0], s[4][1])}</span>`]), { noKey: true })}
    </section>

    <section class="sec">
      <h2>Cele două verbe de bază: être și avoir</h2>
      <p class="muted prose">Sunt grupa 3 și neregulate, dar le folosești la fiecare timp compus. Merită învățate perfect.</p>
      <h3 class="sub"><span class="fr">être</span> (a fi)</h3>${allTenseTable('être')}
      <h3 class="sub"><span class="fr">avoir</span> (a avea)</h3>${allTenseTable('avoir')}
      <p class="small muted" style="margin-top:8px">La passé composé, <i>être</i> și <i>avoir</i> folosesc <b>avoir</b>: <i>j’ai été, j’ai eu</i>.</p>
    </section>
    ${lessonFooter('grupe', ['baze', 'Bazele'], ['timpuri', 'Timpurile'])}`;
  },
  after() { const i = $('#grp-in'); if (i) i.addEventListener('keydown', e => { if (e.key === 'Enter') ACT['grp-ask'](); }); }
};
