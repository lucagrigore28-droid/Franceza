/* ===== vizualizări 2: Timpurile, Participiul, Acordul ===== */

/* ===================== TIMPURILE ===================== */
const TP = { sel: 'map', models: {}, same: 0 };
const TP_MAP = [
  ['Trecut', ['pc', 'imp', 'pqp', 'pr', 'ps']],
  ['Prezent', ['present', 'impe']],
  ['Viitor', ['fs', 'fp', 'fa']],
  ['Ipoteză, dorință, sfat', ['cond', 'condp', 'subj']]
];
const CMP = [['cmp-imp-pc', 'Imparfait sau passé composé?'], ['cmp-si', 'Propoziții cu SI'], ['cmp-how', 'Cum transformi o propoziție'], ['cmp-same', 'Aceeași propoziție în toate timpurile'], ['cmp-recap', 'Tabel recapitulativ']];
function tpTabs() {
  const ess = C.TENSES.filter(t => t.lvl === 'ess'), bon = C.TENSES.filter(t => t.lvl === 'bon');
  const chip = (id, label) => `<button type="button" class="chip" data-act="tp" data-id="${id}" aria-pressed="${TP.sel === id}">${label}</button>`;
  return `<div class="stack" style="gap:12px" id="tp-tabs">
    <div class="chips">${chip('map', 'Harta timpurilor')}</div>
    <div><div class="small muted" style="margin-bottom:6px;font-weight:700">ESENȚIALE</div><div class="chips">${ess.map(t => chip(t.id, t.fr.replace(/^L[ae’'] ?|^Le |^La /, ''))).join('')}</div></div>
    <div><div class="small muted" style="margin-bottom:6px;font-weight:700">BONUS (dacă le-ai făcut la clasă)</div><div class="chips">${bon.map(t => chip(t.id, t.fr.replace(/^L[ae’'] ?|^Le |^La /, ''))).join('')}</div></div>
    <div><div class="small muted" style="margin-bottom:6px;font-weight:700">COMPARAȚII ȘI METODĂ</div><div class="chips">${CMP.map(c => chip(c[0], c[1])).join('')}</div></div>
  </div>`;
}
const formulaTxt = t => t.formula.filter(f => f[1] !== 'op').map(f => f[0]).join(' + ');
function tpMap() {
  const ex = (id) => { const r = FR.rows(FR.getVerb('parler'), id); return r ? r[0].full : ''; };
  return `
    <div class="prose"><p>Timpurile se așază pe o axă: ce s-a întâmplat, ce se întâmplă, ce se va întâmpla, și ce <i>ar</i> fi. Alege un timp ca să îi vezi fișa completă.</p></div>
    ${TP_MAP.map(g => `<h3 class="sub">${g[0]}</h3><div class="grid-auto">${g[1].map(id => { const t = C.TENSE_BY[id]; return `<button type="button" class="setcard" data-act="tp" data-id="${id}"><div class="row" style="justify-content:space-between;gap:8px"><h4>${t.fr}</h4>${t.lvl === 'ess' ? badge('esențial', 'ess') : badge('bonus', 'bon')}</div><p>${t.ro}</p><p class="fr" style="color:var(--ink);font-size:1.15rem">${esc(ex(id))}</p><span class="meta" style="text-transform:none;letter-spacing:0;font-weight:600;color:var(--ink-3)">${formulaTxt(t)}</span></button>`; }).join('')}</div>`).join('')}
    <h3 class="sub">Cum alegi timpul?</h3>
    ${tbl(['Te întrebi…', 'Atunci folosești'], [
      ['S-a întâmplat și s-a terminat, ca un eveniment?', '<b>passé composé</b>'],
      ['Descriu cum era sau ce se făcea de obicei?', '<b>imparfait</b>'],
      ['S-a terminat înaintea altei acțiuni din trecut?', '<b>plus-que-parfait</b>'],
      ['S-a terminat chiar acum?', '<b>passé récent</b> (venir de + inf.)'],
      ['Se întâmplă acum sau mereu?', '<b>présent</b>'],
      ['Urmează curând / am de gând?', '<b>futur proche</b> (aller + inf.)'],
      ['Se va întâmpla, mai târziu?', '<b>futur simple</b>'],
      ['Aș face / ar fi / politețe / sfat?', '<b>conditionnel présent</b>'],
      ['Ar fi fost / regret?', '<b>conditionnel passé</b>'],
      ['După «il faut que», «vouloir que», «pour que»?', '<b>subjonctif présent</b>']
    ], { noKey: true })}`;
}
function modelChips(id, t) {
  const sel = TP.models[id] || t.models.slice(0, 3);
  return `<div class="chips" role="group" aria-label="Alege verbele afișate">${t.models.map(m => `<button type="button" class="chip" data-act="tp-model" data-t="${id}" data-v="${esc(m)}" aria-pressed="${sel.includes(m)}">${esc(m)}</button>`).join('')}</div>`;
}

/* ---------- verbe neregulate la fiecare timp ---------- */
const IRR = ['être', 'avoir', 'aller', 'faire', 'dire', 'prendre', 'mettre', 'voir', 'venir', 'pouvoir', 'vouloir', 'savoir', 'devoir', 'recevoir', 'partir', 'sortir', 'dormir', 'ouvrir', 'offrir', 'écrire', 'lire', 'boire', 'connaître', 'croire', 'vivre', 'courir', 'naître', 'mourir', 'suivre', 'plaire', 'rire', 'tenir', 'envoyer'];
const IRR_FAM = 'comprendre, apprendre, surprendre, reprendre → ca <b>prendre</b> · permettre, promettre, remettre, admettre → ca <b>mettre</b> · devenir, revenir, parvenir → ca <b>venir</b> (cu être) · retenir, obtenir, appartenir → ca <b>tenir</b> · couvrir, découvrir → ca <b>ouvrir</b> · reconnaître → ca <b>connaître</b> · décrire → ca <b>écrire</b> · sourire → ca <b>rire</b> · revoir → ca <b>voir</b>';
function irregHtml(id) {
  const vcell = inf => { const v = FR.getVerb(inf).v; return `<td class="k"><span class="fr">${esc(inf)}</span><div class="small muted" style="font-weight:500">${esc(v.ro || '')}</div></td>`; };
  const SIMPLE = ['present', 'imp', 'fs', 'cond', 'subj', 'ps'], COMP = ['pc', 'pqp', 'condp', 'fa'];
  let head, body, note = '';
  if (SIMPLE.includes(id)) {
    const labs = id === 'subj' ? ['que je', 'que tu', 'qu’il', 'que nous', 'que vous', 'qu’ils'] : ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
    head = ['Verbul', ...labs];
    body = IRR.map(inf => { const rows = FR.rows(FR.getVerb(inf), id); return `<tr>${vcell(inf)}${rows.map(r => `<td class="fr" style="white-space:nowrap">${segsHtml(r.segs)}</td>`).join('')}</tr>`; });
    if (id === 'present') note = 'Verbele din grupa 3 nu au o regulă unică. Cele frecvente trebuie știute pe de rost, mai ales <i>être, avoir, aller, faire</i> și cele cu radical care se schimbă (<i>prendre → nous prenons, ils prennent</i>).';
    if (id === 'imp') note = 'Imperfectul este cel mai regulat timp: radicalul lui <i>nous</i> + terminațiile. Singura excepție este <b>être → ét-</b>.';
    if (id === 'fs' || id === 'cond') note = 'Observă radicalele de viitor neregulate (<i>ser-, aur-, ir-, fer-, verr-, pourr-, voudr-, saur-, devr-, viendr-, enverr-, courr-, mourr-</i>). Terminațiile rămân aceleași.';
    if (id === 'subj') note = 'Neregulate complet: <i>être, avoir, aller, faire, pouvoir, savoir, vouloir</i>. La celelalte, <i>nous</i> și <i>vous</i> arată ca la imparfait (<i>que nous prenions</i>).';
    if (id === 'ps') note = 'Doar de recunoscut. Majoritatea verbelor neregulate au radical propriu (<i>fus, eus, fis, vins, vis, pris, mis, dis, pus, voulus, dus, sus</i>).';
  } else if (COMP.includes(id)) {
    const auxWord = { pc: 'prezent', pqp: 'imparfait', condp: 'conditionnel', fa: 'futur' }[id];
    head = ['Verbul', 'Participiul', 'Auxiliar', 'je…', 'nous…'];
    body = IRR.map(inf => {
      const vo = FR.getVerb(inf), v = vo.v, rows = FR.rows(vo, id);
      const aux = v.aux === 'both' ? 'avoir / être' : v.aux === 'etre' ? 'être' : 'avoir';
      return `<tr>${vcell(inf)}<td class="fr"><b class="r r-AUX">${esc(v.pp)}</b></td><td>${badge(aux, 'av')}</td><td class="fr" style="white-space:nowrap">${esc(rows[0].full)}</td><td class="fr" style="white-space:nowrap">${esc(rows[3].full)}</td></tr>`;
    });
    note = `La acest timp neregulat este <b>participiul</b>; auxiliarul se conjugă la ${auxWord}, la fel pentru toate verbele (tabelul de mai sus). Participiul rămâne la fel la toate persoanele, iar acordul îl faci după regulile din lecția 5.`;
  } else if (id === 'fp' || id === 'pr') {
    head = ['Verbul', 'je…', 'nous…'];
    body = IRR.map(inf => { const rows = FR.rows(FR.getVerb(inf), id); return `<tr>${vcell(inf)}<td class="fr" style="white-space:nowrap">${esc(rows[0].full)}</td><td class="fr" style="white-space:nowrap">${esc(rows[3].full)}</td></tr>`; });
    note = id === 'fp' ? 'Aici nu există forme neregulate de învățat pentru verbul principal: rămâne la <b>infinitiv</b>. Neregulat este doar <i>aller</i> (vais, vas, va, allons, allez, vont).' : 'Verbul principal rămâne la <b>infinitiv</b>. Neregulat este doar <i>venir</i> (viens, viens, vient, venons, venez, viennent).';
  } else if (id === 'impe') {
    head = ['Verbul', 'tu', 'nous', 'vous'];
    body = IRR.map(inf => { const r = FR.rows(FR.getVerb(inf), 'impe'); const f = i => { const x = r.find(y => y.i === i); return x ? segsHtml(x.segs) : '<span class="muted">—</span>'; }; return `<tr>${vcell(inf)}<td class="fr">${f(1)}</td><td class="fr">${f(3)}</td><td class="fr">${f(4)}</td></tr>`; });
    note = 'Imperativul se ia din prezent, cu patru excepții: <b>être, avoir, savoir, vouloir</b>. <i>pouvoir</i> nu are imperativ. La grupa 1, <i>aller</i>, <i>ouvrir</i>, <i>offrir</i>, <i>tu</i> nu are -s.';
  } else return '';
  return `<details class="acc" open><summary>Verbe neregulate la ${esc(TNAME[id])} <span class="small muted" style="font-weight:500">· ${IRR.length} verbe, toate persoanele</span></summary>
    <div class="acc-b"><div class="conj-t tscroll tbl"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${body.join('')}</tbody></table></div>
    <p class="small muted" style="margin-top:10px">${note}</p>
    <p class="small" style="margin-top:10px"><b>Același model:</b> ${IRR_FAM}.</p>
    <p class="small muted">Alt verb? Încearcă <a href="#conjugator">Conjugatorul</a>.</p></div></details>`;
}

function modelsHtml(id) {
  const t = C.TENSE_BY[id], sel = TP.models[id] || t.models.slice(0, 3);
  const compound = ['pc', 'pqp', 'condp', 'fa'].includes(id);
  return `<div class="conj-grid">${sel.map(v => conjHtml(v, id)).join('')}</div>${compound ? `<p class="small muted" style="margin-top:8px">(e), (s) arată posibilul acord al participiului. Scrii doar ce se potrivește subiectului: <i>elle est allée</i>, <i>ils sont allés</i>.</p>` : ''}`;
}
ACT['tp-model'] = el => {
  const id = el.dataset.t, t = C.TENSE_BY[id];
  let sel = (TP.models[id] || t.models.slice(0, 3)).slice();
  const v = el.dataset.v, at = sel.indexOf(v);
  if (at >= 0) { if (sel.length > 1) sel.splice(at, 1); } else sel.push(v);
  TP.models[id] = sel;
  $('#tp-models').innerHTML = modelsHtml(id);
  $$('#tp-chips [data-act="tp-model"]').forEach(b => b.setAttribute('aria-pressed', String(sel.includes(b.dataset.v))));
};
function tenseHtml(id) {
  const t = C.TENSE_BY[id];
  const formula = `<div class="formula">${t.formula.map(f => f[1] === 'op' ? `<span class="fxop">${f[0]}</span>` : `<span class="fx ${f[1] === 'a' ? 'a' : f[1] === 'v' ? 'v' : ''}">${f[0]}</span>`).join('')}</div>`;
  let endings = '';
  if (t.endings) endings = `<h3 class="sub">Terminațiile</h3>${tbl(t.endings.head, t.endings.rows)}${t.endings.note ? `<p class="small muted" style="margin-top:8px">${t.endings.note}</p>` : ''}`;
  let irr = '';
  if (t.irregular) irr = `<h3 class="sub">Forme neregulate de reținut</h3>${tbl(id === 'subj' ? ['Verb', 'Forma lui je', 'Forma lui nous'] : ['Verb', 'Radical', 'Exemplu'], t.irregular.map(r => [`<span class="fr">${r[0]}</span>`, `<span class="fr">${r[1]}</span>`, `<span class="fr">${r[2]}</span>`]))}`;
  return `
    <div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px"><div><span class="eyebrow">${t.ro}</span><h2 style="font-size:clamp(1.8rem,5vw,2.4rem)" class="page-title" style="margin:0">${t.fr}</h2></div>${t.lvl === 'ess' ? badge('esențial', 'ess') : badge('bonus', 'bon')}</div>
    <p class="lead" style="margin-top:10px">${t.short}</p>
    <h3 class="sub">Formula</h3>${formula}
    <h3 class="sub">Când îl folosești</h3>
    <div class="stack" style="gap:10px">${t.uses.map(u => `<div><div style="font-weight:700;margin-bottom:4px">${u[0]}</div>${ex(esc(u[1]), esc(u[2]))}</div>`).join('')}</div>
    <h3 class="sub">Cum îl formezi, pas cu pas</h3>
    <ol class="prose">${t.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    ${endings}${irr}
    <h3 class="sub">Exemple conjugate</h3>
    <p class="small muted">Alege ce verbe vrei să vezi. Pentru orice alt verb folosește <a href="#conjugator">Conjugatorul</a>.</p>
    <div id="tp-chips" style="margin:10px 0 14px">${modelChips(id, t)}</div>
    ${legendHtml}
    <div id="tp-models">${modelsHtml(id)}</div>
    <h3 class="sub">Verbele neregulate</h3>
    ${irregHtml(id)}
    <h3 class="sub">Cuvinte care îți dau de gol timpul</h3>
    <div class="chips">${t.signals.map(s => `<span class="chip static fr" style="font-size:1rem">${s}</span>`).join('')}</div>
    <h3 class="sub">Capcane</h3>
    <ul class="prose">${t.traps.map(s => `<li>${s}</li>`).join('')}</ul>
    <h3 class="sub">Antrenează-te</h3>
    <div id="tp-drill"></div>`;
}
function cmpImpPc() {
  return `
    <h2 class="page-title" style="font-size:2rem">Imparfait sau passé composé?</h2>
    <p class="lead">Cea mai frecventă alegere din teste. Ambele sunt trecut, dar răspund la întrebări diferite.</p>
    ${tbl(['', 'Imparfait', 'Passé composé'], [
      ['Răspunde la', '«Cum era? Ce se făcea de obicei?»', '«Ce s-a întâmplat?»'],
      ['Acțiunea', 'în desfășurare, fără început și sfârșit precizat', 'terminată, delimitată, ca un eveniment'],
      ['În poveste', 'fundal, decor, descriere', 'acțiunile care duc povestea mai departe'],
      ['Obicei', 'repetat, nedelimitat (<i>je jouais</i> în fiecare zi)', 'repetare numărată (<i>j’ai joué trois fois</i>)'],
      ['Semnale', 'toujours, souvent, d’habitude, autrefois, chaque jour, quand j’étais petit', 'hier, soudain, un jour, une fois, ensuite, puis, tout à coup']
    ])}
    <h3 class="sub">Cele două împreună</h3>
    ${exList([
      [`Il ${R.V('pleuvait')} quand je ${R.AUX('suis sorti')}.`, 'Ploua (fundal) când am ieșit (eveniment).'],
      [`Je ${R.V('regardais')} la télé quand le téléphone ${R.AUX('a sonné')}.`, 'Mă uitam la televizor (fundal) când a sunat telefonul (eveniment).'],
      [`Hier, il ${R.V('faisait')} beau. Nous ${R.AUX('sommes allés')} au parc et nous ${R.AUX('avons joué')} au foot.`, 'Ieri era frumos (decor). Am mers în parc și am jucat fotbal (evenimente).']
    ])}
    <p class="small muted"><span class="r r-V">Roșu</span> = imparfait (fundal). <span class="r r-AUX">Mov</span> = passé composé (eveniment).</p>
    ${callout('tip', 'Truc', `<p>Pune-te să povestești un film. Imparfait = <b>decorul</b> (ce se vede pe ecran). Passé composé = <b>acțiunea</b> (ce face eroul).</p>`)}
    <h3 class="sub">Încearcă</h3><div id="tp-drill"></div>`;
}
function cmpSi() {
  return `
    <h2 class="page-title" style="font-size:2rem">Propoziții cu SI</h2>
    <p class="lead">Trei tipare. Învață-le ca pe o tabelă a înmulțirii: timpul de după «si» decide timpul din rest.</p>
    ${tbl(['Tipul', 'SI + …', 'Rezultatul', 'Exemplu'], [
      ['Real, posibil', '<b>présent</b>', '<b>futur simple</b> (sau impératif)', `<span class="fr">Si tu ${R.V('viens')}, on ${R.AUX('mangera')} ensemble.</span><br><span class="small muted">Dacă vii, vom mânca împreună.</span>`],
      ['Ireal / improbabil acum', '<b>imparfait</b>', '<b>conditionnel présent</b>', `<span class="fr">Si j’${R.V('avais')} le temps, je ${R.AUX('voyagerais')}.</span><br><span class="small muted">Dacă aș avea timp, aș călători.</span>`],
      ['Ireal în trecut', '<b>plus-que-parfait</b>', '<b>conditionnel passé</b>', `<span class="fr">Si j’${R.V('avais su')}, je ${R.AUX('serais venu')}.</span><br><span class="small muted">Dacă aș fi știut, aș fi venit.</span>`]
    ])}
    ${callout('warn', 'Regula de aur', `<p>După <b>si</b> nu apare niciodată viitor sau condițional. Greșit: <s>si tu viendras</s>, <s>si j’aurais le temps</s>. Corect: <i>si tu viens</i>, <i>si j’avais le temps</i>.</p>`)}
    <h3 class="sub">Încearcă</h3><div id="tp-drill"></div>`;
}
function cmpHow() {
  return `
    <h2 class="page-title" style="font-size:2rem">Cum transformi o propoziție la alt timp</h2>
    <p class="lead">Metoda în cinci pași pentru exercițiile de tip «Mettez au passé composé / à l’imparfait / au futur».</p>
    <ol class="prose" style="font-size:1.05rem">
      <li><b>Găsește verbul</b> și subiectul lui. Verbul se schimbă, restul propoziției rămâne (cu excepția cuvintelor de timp, vezi pasul 5).</li>
      <li><b>Scrie infinitivul</b> și grupa lui (<i>nous finissons → finir, grupa 2</i>).</li>
      <li><b>Ia rețeta</b> timpului țintă din fișa lui (de exemplu passé composé = auxiliar la prezent + participiu).</li>
      <li><b>Conjugă</b> la aceeași persoană. La timpurile compuse alege auxiliarul (avoir / être) și verifică acordul.</li>
      <li><b>Recitește.</b> Cuvintele de timp trebuie să se potrivească (<i>demain</i> cu viitor, <i>hier</i> cu trecut) și verifică ortografia (<i>-ger, -cer, -s la tu</i>).</li>
    </ol>
    <h3 class="sub">Exemplu lucrat</h3>
    ${callout('', 'Mettez au passé composé', `<p class="fr" style="font-size:1.25rem">Elle ${R.V('part')} à huit heures.</p>
      <ol class="small" style="margin-top:8px"><li>Verb: <i>part</i>, subiect: <i>elle</i>.</li><li>Infinitiv: <i>partir</i>, grupa 3, auxiliar <b>être</b> (e în lista DR &amp; MRS VANDERTRAMP).</li><li>Rețeta: <i>être</i> la prezent + participiu = <i>est</i> + <i>parti</i>.</li><li>Acord cu subiectul feminin: <i>partie</i>.</li><li>Rezultat: <b class="fr">Elle est partie à huit heures.</b></li></ol>`)}
    <h3 class="sub">Ce timp îmi cere cuvântul de timp?</h3>
    ${tbl(['Cuvinte', 'Timpul'], [
      ['hier, la semaine dernière, il y a deux jours, ce matin, soudain, un jour', '<b>passé composé</b>'],
      ['autrefois, quand j’étais petit, souvent, toujours, d’habitude, chaque été', '<b>imparfait</b>'],
      ['déjà, la veille, auparavant, ne… pas encore', '<b>plus-que-parfait</b>'],
      ['demain, la semaine prochaine, bientôt, dans deux jours, un jour', '<b>futur simple</b>'],
      ['tout de suite, dans cinq minutes, ce soir, bientôt (iminent)', '<b>futur proche</b>'],
      ['à l’instant, tout à l’heure, il y a un instant', '<b>passé récent</b>'],
      ['si + imparfait, à ta place, au cas où', '<b>conditionnel présent</b>']
    ], { noKey: true })}
    <h3 class="sub">Încearcă</h3>
    <div id="tp-drill"></div>`;
}
function sameHtml(i) {
  const d = C.TR[i], T = ['present', 'pc', 'imp', 'pqp', 'fs', 'fp', 'pr', 'cond', 'condp'];
  return tbl(['Timp', 'Propoziția'], T.map(t => [`${TNAME[t]}`, `<span class="fr">${sentHtml(d, t)}</span>`]));
}
ACT['same-sel'] = el => { TP.same = +el.value; $('#same-out').innerHTML = sameHtml(TP.same); };
function cmpSame() {
  return `
    <h2 class="page-title" style="font-size:2rem">Aceeași propoziție în toate timpurile</h2>
    <p class="lead">Alege o propoziție și vezi cum se schimbă doar verbul (în roșu). Un bun mod de a simți diferențele.</p>
    <label class="small muted" for="same-sel" style="display:block;margin-bottom:6px">Propoziția</label>
    <select id="same-sel" data-act-change="same-sel" style="max-width:100%">${C.TR.map((d, i) => `<option value="${i}"${i === TP.same ? ' selected' : ''}>${esc(FR.sentence(d, 'present'))}</option>`).join('')}</select>
    <div id="same-out" style="margin-top:14px">${sameHtml(TP.same)}</div>`;
}
function cmpRecap() {
  const ids = ['present', 'pc', 'imp', 'pqp', 'fs', 'fp', 'pr', 'cond', 'condp', 'subj', 'fa', 'ps', 'impe'];
  const row = id => { const t = C.TENSE_BY[id], r = FR.rows(FR.getVerb('parler'), id); return [`<b>${t.fr}</b><br><span class="small muted">${t.ro}</span>`, formulaTxt(t), `<span class="fr">${esc(r[0].full)}</span>`]; };
  return `
    <h2 class="page-title" style="font-size:2rem">Tabel recapitulativ</h2>
    <p class="lead">Toate timpurile într-un singur loc, cu verbul <i>parler</i> ca exemplu.</p>
    ${tbl(['Timp', 'Formula', 'Exemplu'], ids.map(row), { noKey: true })}`;
}
VIEWS.timpuri = {
  title: 'Timpurile',
  render() {
    return `
    <span class="eyebrow">Lecția 3</span>
    <h1 class="page-title">Timpurile verbale</h1>
    <p class="lead">O fișă pentru fiecare timp: când îl folosești, cum îl formezi, terminațiile, exemple conjugate și exerciții. Mai jos ai și comparațiile care apar des la test.</p>
    ${tpTabs()}
    <div id="tp-body" style="margin-top:28px"></div>
    ${lessonFooter('timpuri', ['grupe', 'Grupele'], ['participiu', 'Participiul trecut'])}`;
  },
  after() { tpRender(); }
};
function tpRender() {
  const body = $('#tp-body'); if (!body) return;
  const id = TP.sel; let drill = null;
  $$('#tp-tabs .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  if (id === 'map') body.innerHTML = tpMap();
  else if (C.TENSE_BY[id]) { body.innerHTML = tenseHtml(id); drill = () => drillFor(id, 4); }
  else if (id === 'cmp-imp-pc') { body.innerHTML = cmpImpPc(); drill = () => [0, 2, 10, 1].map(i => timeQ(C.TIME[i])); }
  else if (id === 'cmp-si') { body.innerHTML = cmpSi(); drill = () => [3, 4, 9].map(i => timeQ(C.TIME[i])); }
  else if (id === 'cmp-how') { body.innerHTML = cmpHow(); drill = () => Array.from({ length: 3 }, () => genTransform(2)); }
  else if (id === 'cmp-same') body.innerHTML = cmpSame();
  else if (id === 'cmp-recap') body.innerHTML = cmpRecap();
  const dh = $('#tp-drill');
  if (dh && drill) mountRunner(dh, drill(), { mini: true, mode: 'practice', again: drill, focus: false });
}
ACT['tp'] = el => { TP.sel = el.dataset.id; tpRender(); const b = $('#tp-body'); if (b) window.scrollTo({ top: Math.max(0, b.getBoundingClientRect().top + window.scrollY - 160), behavior: 'smooth' }); };

/* ===================== PARTICIPIUL TRECUT ===================== */
function ppItems(cat) {
  return C.PP.filter(p => p[3] === cat).map(p => `<div class="pp-item" data-s="${esc(p[0] + ' ' + p[1] + ' ' + p[2])}"><b>${p[0]}</b><span>${p[1]} · ${p[2]}${p[4] === 'etre' ? ' · <u>être</u>' : p[4] === 'both' ? ' · avoir / être' : ''}</span></div>`).join('');
}
ACT['pp-search'] = el => {
  const q = FR.noAcc(FR.norm(el.value));
  $$('.pp-item').forEach(i => i.classList.toggle('hid', q && !FR.noAcc(i.dataset.s.toLowerCase()).includes(q)));
  $$('details.pp-cat').forEach(d => { if (q) d.open = true; });
};
VIEWS.participiu = {
  title: 'Participiul trecut',
  render() {
    return `
    <span class="eyebrow">Lecția 4</span>
    <h1 class="page-title">Participiul trecut</h1>
    <p class="lead">Este a doua jumătate a oricărui timp compus. Înainte să-l acorzi, trebuie să știi să-l formezi și să alegi auxiliarul.</p>

    <section class="sec">
      <h2>Ce este</h2>
      <div class="prose"><p><b>Participiul trecut</b> (<i>le participe passé</i>) este forma verbului care urmează după <i>avoir</i> sau <i>être</i> la timpurile compuse: <span class="fr">j’ai ${R.AUX('mangé')}</span>, <span class="fr">elle est ${R.AUX('partie')}</span>. În română îi corespunde «mâncat», «plecat». Poate fi folosit și ca adjectiv: <span class="fr">une porte ${R.AUX('fermée')}</span>.</p></div>
    </section>

    <section class="sec">
      <h2>Cum se formează</h2>
      ${tbl(['Verbul', 'Terminația', 'Exemple'], [
        [`<span class="badge g1">grupa 1</span> <span class="fr">-er</span>`, '<b>-é</b>', '<span class="fr">parler → parlé · manger → mangé · aller → allé</span>'],
        [`<span class="badge g2">grupa 2</span> <span class="fr">-ir</span>`, '<b>-i</b>', '<span class="fr">finir → fini · choisir → choisi · réussir → réussi</span>'],
        [`<span class="badge g3">grupa 3</span> <span class="fr">-dre</span> (regulate)`, '<b>-u</b>', '<span class="fr">vendre → vendu · attendre → attendu · répondre → répondu</span>'],
        [`<span class="badge g3">grupa 3</span> <span class="fr">-ir</span> fără -iss-`, '<b>-i</b>', '<span class="fr">partir → parti · dormir → dormi · sortir → sorti</span>'],
        [`<span class="badge g3">grupa 3</span> alte verbe`, 'neregulat', '<span class="fr">prendre → pris · faire → fait · voir → vu · être → été</span>']
      ], { noKey: true })}
    </section>

    <section class="sec">
      <h2>Participiile neregulate</h2>
      <p class="muted prose">Merită învățate pe familii. Caută un verb sau deschide o familie. Pentru memorare folosește <b>cartonașele</b> din secțiunea Exerciții.</p>
      <input type="search" class="search" id="pp-q" placeholder="Caută: prendre, luat, pris…" aria-label="Caută un participiu" data-act-input="pp-search" style="margin:12px 0" autocomplete="off">
      ${C.PP_CATS.map((c, i) => `<details class="acc pp-cat"${i === 0 ? ' open' : ''}><summary>${c[1]} <span class="small muted" style="font-weight:500">· ${c[2]}</span></summary><div class="acc-b"><div class="pp-grid">${ppItems(c[0])}</div></div></details>`).join('')}
    </section>

    <section class="sec">
      <h2>Avoir sau être?</h2>
      ${callout('rule', 'Regula', `<p>Aproape toate verbele se conjugă cu <b>avoir</b>. Cu <b>être</b> se conjugă doar: (1) cele <b>16 verbe</b> de mai jos și (2) <b>toate verbele pronominale</b> (<i>se laver, s’habiller…</i>).</p>`)}
      <h3 class="sub">Cele 16 verbe cu être: DR &amp; MRS VANDERTRAMP</h3>
      <p class="muted prose">Fiecare literă din <b>D R M R S V A N D E R T R A M P</b> este începutul unui verb: Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir.</p>
      <div class="grid-auto" style="margin-top:12px;grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">${C.VDT.map(v => `<div class="vcard"><b>${v[0]}</b><div class="small"><span class="r r-AUX">${v[1]}</span></div><div class="small muted">${v[2]}</div></div>`).join('')}</div>
      ${callout('tip', 'Mod de ținut minte: perechi opuse', `<p>Majoritatea sunt mișcări sau schimbări de stare, în perechi: <span class="fr">${C.VDT_PAIRS.map(p => p.join(' ↔ ')).join(' · ')}</span>.</p>`)}
      <h3 class="sub">Verbe cu două auxiliare</h3>
      <p class="muted prose">Șase dintre ele pot lua și <b>avoir</b>, dar numai când au un <b>COD</b> (devin tranzitive și își schimbă sensul).</p>
      ${tbl(['Verbul', 'Fără COD → être', 'Cu COD → avoir', 'Sens'], C.BOTH.map(b => [`<span class="fr">${b[0]}</span>`, `<span class="fr">${b[1]}</span>`, `<span class="fr">${b[2]}</span>`, b[3]]), {})}
      <h3 class="sub">Verbele pronominale</h3>
      <div class="prose"><p>Toate se conjugă cu <b>être</b>, indiferent cum sună în română: <span class="fr">Je me suis lavé(e)</span> (m-am spălat), <span class="fr">Elle s’est levée</span> (s-a ridicat). Pronumele (<i>me, te, se, nous, vous</i>) stă între subiect și auxiliar. Acordul lor are reguli speciale, în lecția 5.</p></div>
    </section>

    <section class="sec">
      <h2>Verifică-te</h2>
      <div id="mini" style="margin-top:14px"></div>
    </section>
    ${lessonFooter('participiu', ['timpuri', 'Timpurile'], ['acord', 'Acordul participiului'])}`;
  },
  after() {
    const mk = () => [genAux(), genAux(), genAux(), genPP(), genPP(), genPP()];
    mountRunner($('#mini'), mk(), { mini: true, mode: 'practice', again: mk, focus: false });
  }
};

/* ===================== ACORDUL ===================== */
let TRS = { path: ['start'], labels: [] };
function treeRender() {
  const id = TRS.path[TRS.path.length - 1], n = C.TREE[id];
  const crumbs = TRS.labels.length ? `<div class="path">${TRS.labels.map(l => `<span>${l}</span>`).join('')}</div>` : '';
  let body;
  if (n.res) {
    body = `<div class="res ${n.res}"><h3>${n.t}</h3><p>${n.rule}</p>${exList(n.ex.map(e => [e.replace(/<b>([^<]+)<\/b>/g, '<b class="r r-AUX">$1</b>')]))}</div>`;
  } else {
    body = `<h3>${n.q}</h3><p class="muted">${n.hint}</p><div class="opts" style="margin-top:14px">${n.opts.map((o, i) => `<button type="button" class="opt" data-act="tree-go" data-to="${o[1]}" data-label="${esc(o[2] || o[0])}"><span class="l">${i + 1}</span><span>${o[0]}</span></button>`).join('')}</div>`;
  }
  $('#tree-b').innerHTML = `${crumbs}${body}<div class="btnrow" style="margin-top:16px">${TRS.path.length > 1 ? `<button type="button" class="btn sec sm" data-act="tree-back">${ICO.back} Înapoi</button>` : ''}${TRS.path.length > 1 ? `<button type="button" class="btn sec sm" data-act="tree-reset">Reia de la început</button>` : ''}</div>`;
}
ACT['tree-go'] = el => { TRS.path.push(el.dataset.to); TRS.labels.push(el.dataset.label); treeRender(); };
ACT['tree-back'] = () => { TRS.path.pop(); TRS.labels.pop(); treeRender(); };
ACT['tree-reset'] = () => { TRS = { path: ['start'], labels: [] }; treeRender(); };

const PPT = ['aimé', 'fini', 'vendu', 'pris', 'mis', 'fait', 'écrit', 'ouvert', 'vu'];
const MISTAKES = [
  ['Elle <s>a partie</s>', 'Elle <b>est partie</b>', '<i>partir</i> se conjugă cu être.'],
  ['J’ai <s>achetées</s> les fleurs', 'J’ai <b>acheté</b> les fleurs', 'COD-ul vine după verb.'],
  ['Les fleurs que j’ai <s>acheté</s>', 'Les fleurs que j’ai <b>achetées</b>', '<i>que</i> = les fleurs, COD înaintea verbului.'],
  ['Je leur ai <s>parlés</s>', 'Je leur ai <b>parlé</b>', '<i>leur</i> este COI.'],
  ['Elle s’est <s>lavée</s> les mains', 'Elle s’est <b>lavé</b> les mains', 'COD-ul real este <i>les mains</i>, după verb.'],
  ['Elles se sont <s>téléphonées</s>', 'Elles se sont <b>téléphoné</b>', '<i>téléphoner à</i>: «se» este COI.'],
  ['Des pommes, j’en ai <s>mangées</s>', 'Des pommes, j’en ai <b>mangé</b>', '<i>en</i> nu declanșează acordul.'],
  ['Elle est <s>monté</s> dans sa chambre', 'Elle est <b>montée</b> dans sa chambre', 'Cu être, acord cu subiectul feminin.'],
  ['Marie et Paul sont <s>venues</s>', 'Marie et Paul sont <b>venus</b>', 'Grup mixt = masculin plural.']
];
VIEWS.acord = {
  title: 'Acordul participiului',
  render() {
    return `
    <span class="eyebrow">Lecția 5 · Cea mai importantă</span>
    <h1 class="page-title">Acordul participiului trecut</h1>
    <p class="lead">Participiul trecut poate primi <b>-e</b> (feminin) și <b>-s</b> (plural), ca un adjectiv. Întrebarea este mereu: <b>cu cine</b> se acordă și <b>când</b>?</p>

    <section class="sec">
      <h2>Pe scurt: trei reguli</h2>
      <div class="grid3">
        <div class="card flat"><span class="badge av">ÊTRE</span><h4 style="margin:10px 0 6px">Cu subiectul</h4><p class="small">Verbul are auxiliarul <i>être</i>? Participiul se acordă cu <b>subiectul</b>.</p><p class="fr" style="margin:8px 0 0">Elle est ${R.AUX('partie')}.<br>Ils sont ${R.AUX('arrivés')}.</p></div>
        <div class="card flat"><span class="badge g1">AVOIR</span><h4 style="margin:10px 0 6px">Cu COD-ul din față</h4><p class="small">Verbul are <i>avoir</i>? Se acordă cu <b>COD-ul</b>, dar <b>numai</b> dacă acesta este <b>înaintea</b> verbului.</p><p class="fr" style="margin:8px 0 0">Les fleurs que j’ai ${R.AUX('achetées')}.<br>J’ai ${R.AUX('acheté')} les fleurs.</p></div>
        <div class="card flat"><span class="badge g3">COI</span><h4 style="margin:10px 0 6px">Niciodată</h4><p class="small">Complementul indirect (à / de) <b>nu</b> declanșează acordul, oricât de aproape ar sta de verb.</p><p class="fr" style="margin:8px 0 0">Je leur ai ${R.AUX('parlé')}.<br>Elle m’a ${R.AUX('téléphoné')}.</p></div>
      </div>
    </section>

    <section class="sec">
      <h2>Arborele de decizie</h2>
      <p class="muted prose">Ia propoziția ta și răspunde pe rând. La final primești regula și exemple. Merge și pentru verbe pronominale.</p>
      <div class="tree" id="tree-b" style="margin-top:14px"></div>
    </section>

    <section class="sec">
      <h2>Cum se face acordul</h2>
      <div class="prose"><p>Pornești de la forma de bază a participiului (masculin singular) și adaugi: <b>-e</b> pentru feminin, <b>-s</b> pentru plural, <b>-es</b> pentru feminin plural. Dacă participiul se termină deja în <b>-s</b> sau <b>-x</b> (<i>pris, mis</i>), masculinul plural rămâne la fel.</p></div>
      ${tbl(['Masculin sg.', 'Feminin sg. (+e)', 'Masculin pl. (+s)', 'Feminin pl. (+es)'], PPT.map(p => FR.ppForms(p).map(f => `<span class="fr">${f}</span>`)), { noKey: true })}
      <p class="small muted" style="margin-top:8px"><b>été</b> nu se acordă niciodată. <b>dû</b> își pierde accentul când se acordă: <i>due, dus, dues</i>.</p>
    </section>

    <section class="sec">
      <h2>Cu AVOIR, pas cu pas</h2>
      <div class="prose"><p>Participiul rămâne <b>neschimbat</b>, în afară de cazul în care există un COD <b>plasat înaintea verbului</b>. Atunci se acordă în gen și număr cu acel COD.</p></div>
      <h3 class="sub">1. COD după verb sau fără COD: nu se acordă</h3>
      ${exList([[`J’ai ${R.AUX('acheté')} ${R.COD('les fleurs')}.`, 'COD după verb.'], [`Nous avons ${R.AUX('marché')} deux heures.`, 'Fără COD.'], [`Elle a ${R.AUX('téléphoné')} ${R.COI('à sa mère')}.`, 'Doar COI.']])}
      <h3 class="sub">2. COD înaintea verbului: se acordă. Patru cazuri</h3>
      ${tbl(['Cine e înaintea verbului', 'Exemplu', 'Cu cine se acordă'], [
        ['Pronume personal COD: <b>me, te, le, la, l’, nous, vous, les</b>', `<span class="fr">Marie ? Je ${R.COD('l’')}ai ${R.AUX('vue')}.<br>Les enfants ? Je ${R.COD('les')} ai ${R.AUX('appelés')}.</span>`, 'cu persoana / lucrul pe care îl înlocuiește'],
        ['Pronumele relativ <b>que</b> (<b>qu’</b>)', `<span class="fr">Les fleurs ${R.COD('que')} j’ai ${R.AUX('achetées')}.</span>`, 'cu antecedentul lui (<i>les fleurs</i>)'],
        ['<b>Quel(le)(s)</b> + substantiv', `<span class="fr">${R.COD('Quelle robe')} as-tu ${R.AUX('choisie')} ?</span>`, 'cu substantivul'],
        ['<b>Combien de</b> + substantiv', `<span class="fr">${R.COD('Combien de pommes')} as-tu ${R.AUX('mangées')} ?</span>`, 'cu substantivul']
      ], { noKey: true })}
      ${callout('tip', 'Pronumele l’ poate fi masculin sau feminin', `<p>Întreabă-te mereu <b>pe cine / ce înlocuiește</b>. <span class="fr">Paul ? Je l’ai ${R.AUX('vu')}.</span> <span class="fr">Marie ? Je l’ai ${R.AUX('vue')}.</span></p>`)}
      <h3 class="sub">3. COI: nu se acordă, niciodată</h3>
      <div class="prose"><p>Pronumele <b>lui</b> și <b>leur</b> sunt întotdeauna COI. <b>me, te, nous, vous</b> pot fi COI când verbul cere <i>à</i>: <span class="fr">Elle m’a ${R.AUX('téléphoné')}</span> (m’ = à moi). <span class="fr">Elle nous a ${R.AUX('répondu')}.</span> Testul: poți spune «à moi / à nous»? Atunci e COI.</p></div>
      <h3 class="sub">4. «en» și «y»: nu se acordă</h3>
      ${exList([[`Des cerises ? J’en ai ${R.AUX('mangé')}.`, 'en nu declanșează acordul.'], [`Il y a ${R.AUX('pensé')}.`, 'La fel și y.']])}
    </section>

    <section class="sec">
      <h2>Cu ÊTRE</h2>
      <div class="prose"><p>Participiul se acordă cu <b>subiectul</b>, ca un adjectiv. Nu cauți COD (verbele cu être nu au COD).</p></div>
      ${exList([[`Elle est ${R.AUX('allée')} au cinéma.`, 'subiect feminin singular'], [`Mes amies sont ${R.AUX('arrivées')}.`, 'subiect feminin plural'], [`Marie et Paul sont ${R.AUX('venus')}.`, 'subiect mixt = masculin plural'], [`Madame, vous êtes ${R.AUX('arrivée')} à l’heure.`, 'vous de politețe, adresat unei femei: singular']])}
      <p class="muted prose"><b>Verbele cu două auxiliare</b> (monter, descendre, sortir, rentrer, retourner, passer): fără COD → être → cu subiectul (<span class="fr">Elle est ${R.AUX('montée')}</span>). Cu COD → avoir → regula cu avoir (<span class="fr">Elle a ${R.AUX('monté')} les valises</span> / <span class="fr">Les valises, elle les a ${R.AUX('montées')}</span>).</p>
    </section>

    <section class="sec">
      <h2>Verbe pronominale</h2>
      <div class="prose"><p>Toate au <b>être</b>, dar participiul nu se acordă automat cu subiectul. Trebuie să afli ce funcție are pronumele «se»: <b>COD</b> sau <b>COI</b>?</p></div>
      ${tbl(['Cazul', 'Verbe', 'Acord', 'Exemplu'], [
        ['Esențial pronominale (nu există fără «se»)', '<span class="fr">se souvenir, s’évanouir, s’enfuir, se moquer, se méfier, s’absenter, se repentir</span>', '<span class="rb rb-AUX">cu subiectul</span>', `<span class="fr">Elles se sont ${R.AUX('évanouies')}.</span>`],
        ['«se» = COD (verbul se construiește direct)', '<span class="fr">se laver, se lever, se coucher, s’habiller, se regarder, se voir, se rencontrer, se blesser</span>', '<span class="rb rb-AUX">cu subiectul</span>', `<span class="fr">Elle s’est ${R.AUX('lavée')}.<br>Ils se sont ${R.AUX('rencontrés')}.</span>`],
        ['«se» = COI (verbul cere à)', '<span class="fr">se parler, se téléphoner, se sourire, se plaire, se nuire, se mentir, se ressembler, s’écrire, se succéder</span>', '<span class="rb rb-COI">invariabil</span>', `<span class="fr">Ils se sont ${R.AUX('parlé')}.<br>Elles se sont ${R.AUX('souri')}.</span>`],
        ['Există un COD <b>după</b> verb (atunci «se» e COI)', '<span class="fr">se laver les mains, s’acheter une robe, se brosser les dents, se couper le doigt</span>', '<span class="rb rb-COI">invariabil</span>', `<span class="fr">Elle s’est ${R.AUX('lavé')} les mains.</span>`],
        ['COD <b>înaintea</b> verbului (que…)', '<span class="fr">les mains que…, la robe que…</span>', '<span class="rb rb-COD">cu COD-ul din față</span>', `<span class="fr">Les mains qu’elle s’est ${R.AUX('lavées')}.</span>`]
      ], { noKey: true })}
      ${callout('tip', 'Truc pentru «se»', `<p>Înlocuiește «se» cu «pe sine» sau «unul pe altul». Se potrivește? Atunci e COD (<i>se laver = a spăla pe sine</i>, <i>se regarder = a se privi</i>). Se potrivește mai bine «lui / ei / unul altuia» (<i>se parler = a-și vorbi</i>)? Atunci e COI.</p>`)}
    </section>

    <section class="sec">
      <h2>Cazuri speciale (avansat)</h2>
      <details class="acc"><summary>Verbe impersonale</summary><div class="acc-b"><p>Rămân invariabile: <span class="fr">Les chaleurs qu’il a ${R.AUX('fait')} cet été. Il est ${R.AUX('tombé')} beaucoup de neige.</span></p></div></details>
      <details class="acc"><summary>Verbe de durată, preț, măsură (dormir, courir, peser, coûter, durer, vivre, valoir)</summary><div class="acc-b"><p>Cu un complement de cantitate, participiul rămâne invariabil: <span class="fr">Les trois heures que j’ai ${R.AUX('dormi')}. Les dix kilos qu’il a ${R.AUX('pesé')}.</span> Atenție: <span class="fr">Les efforts que ce travail m’a ${R.AUX('coûtés')}</span> (sens figurat, COD real) se acordă.</p></div></details>
      <details class="acc"><summary>«faire» urmat de infinitiv</summary><div class="acc-b"><p><i>fait</i> + infinitiv rămâne invariabil: <span class="fr">Les fleurs qu’elle a ${R.AUX('fait')} pousser.</span></p></div></details>
      <details class="acc"><summary>Participiu urmat de infinitiv (voir, entendre, regarder, laisser…)</summary><div class="acc-b"><p>Se acordă numai dacă COD-ul din față <b>face acțiunea</b> infinitivului: <span class="fr">Les enfants que j’ai ${R.AUX('vus')} jouer</span> (copiii joacă). Nu se acordă dacă COD-ul <b>suportă</b> acțiunea: <span class="fr">Les chansons que j’ai ${R.AUX('entendu')} chanter</span> (cântecele nu cântă, ele sunt cântate).</p></div></details>
      <details class="acc"><summary>«le» neutru</summary><div class="acc-b"><p>Când «l’» înseamnă «asta» (o idee întreagă), rămâne invariabil: <span class="fr">Elle est plus gentille que je ne l’avais ${R.AUX('cru')}.</span></p></div></details>
    </section>

    <section class="sec">
      <h2>Greșeli frecvente</h2>
      ${tbl(['Greșit', 'Corect', 'De ce'], MISTAKES.map(m => [`<span class="fr">${m[0]}</span>`, `<span class="fr">${m[1]}</span>`, m[2]]), { noKey: true })}
    </section>

    <section class="sec">
      <h2>Antrenează-te acum</h2>
      <div id="mini" style="margin-top:14px"></div>
      <p style="margin-top:14px"><a class="btn sec" href="#exercitii">Toate seriile de acord ${ICO.arrow}</a></p>
    </section>
    ${lessonFooter('acord', ['participiu', 'Participiul'], ['exercitii', 'Exerciții'])}`;
  },
  after() {
    TRS = { path: ['start'], labels: [] };
    treeRender();
    const mk = () => sample(C.ACORD.filter(it => it[4] <= 2), 4).map(fromAcord);
    mountRunner($('#mini'), mk(), { mini: true, mode: 'practice', again: mk, focus: false });
  }
};
