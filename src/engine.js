/* ===== Motor de conjugare franceză =====
   Tabele explicite pentru verbele neregulate + reguli pentru grupa 1, 2 și -dre/-indre.
   Funcționează în browser (window.FR) și în Node (module.exports) pentru teste. */
(function (G) {
'use strict';

const PRON = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'];
const REFL = ['me', 'te', 'se', 'nous', 'vous', 'se'];
const VOWEL = /^[aeiouyàâäéèêëîïôöùûüœh]/i;
const norm = s => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();
const COMB = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g');
const noAcc = s => s.normalize('NFD').replace(COMB, '');

/* ---------- verbe neregulate (date explicite) ---------- */
const RAW = {};
function def(inf, g, aux, pp, pres, impS, fut, x) {
  const o = Object.assign({ inf, g, aux, pp, pres: pres.split(' '), impS, fut }, x || {});
  ['subj', 'ps', 'imper'].forEach(k => { if (typeof o[k] === 'string') o[k] = o[k].split(' '); });
  RAW[inf] = o;
}
function derive(base, prefix, inf, x) {
  const b = RAW[base], P = s => prefix + s, PA = a => a && a.map(P);
  RAW[inf] = Object.assign({}, b, {
    inf, pres: PA(b.pres), pp: P(b.pp), impS: P(b.impS), fut: P(b.fut),
    subj: PA(b.subj), ps: PA(b.ps), imper: PA(b.imper), ppres: b.ppres && P(b.ppres)
  }, x || {});
}

def('être', 3, 'avoir', 'été', 'suis es est sommes êtes sont', 'ét', 'ser',
  { subj: 'sois sois soit soyons soyez soient', ps: 'fus fus fut fûmes fûtes furent', imper: 'sois soyons soyez', ppres: 'étant', ro: 'a fi', hl: false });
def('avoir', 3, 'avoir', 'eu', 'ai as a avons avez ont', 'av', 'aur',
  { subj: 'aie aies ait ayons ayez aient', ps: 'eus eus eut eûmes eûtes eurent', imper: 'aie ayons ayez', ppres: 'ayant', ro: 'a avea', hl: false });
def('aller', 3, 'etre', 'allé', 'vais vas va allons allez vont', 'all', 'ir',
  { subj: 'aille ailles aille allions alliez aillent', ps: 'allai allas alla allâmes allâtes allèrent', imper: 'va allons allez', ppres: 'allant', ro: 'a merge', hl: false });
def('faire', 3, 'avoir', 'fait', 'fais fais fait faisons faites font', 'fais', 'fer',
  { subj: 'fasse fasses fasse fassions fassiez fassent', ps: 'fis fis fit fîmes fîtes firent', imper: 'fais faisons faites', ppres: 'faisant', ro: 'a face / a realiza', hl: false });
def('dire', 3, 'avoir', 'dit', 'dis dis dit disons dites disent', 'dis', 'dir',
  { ps: 'dis dis dit dîmes dîtes dirent', imper: 'dis disons dites', ppres: 'disant', ro: 'a spune' });
def('prendre', 3, 'avoir', 'pris', 'prends prends prend prenons prenez prennent', 'pren', 'prendr',
  { ps: 'pris pris prit prîmes prîtes prirent', ppres: 'prenant', ro: 'a lua' });
def('mettre', 3, 'avoir', 'mis', 'mets mets met mettons mettez mettent', 'mett', 'mettr',
  { ps: 'mis mis mit mîmes mîtes mirent', ppres: 'mettant', ro: 'a pune' });
def('voir', 3, 'avoir', 'vu', 'vois vois voit voyons voyez voient', 'voy', 'verr',
  { ps: 'vis vis vit vîmes vîtes virent', ppres: 'voyant', ro: 'a vedea' });
def('venir', 3, 'etre', 'venu', 'viens viens vient venons venez viennent', 'ven', 'viendr',
  { ps: 'vins vins vint vînmes vîntes vinrent', ppres: 'venant', ro: 'a veni' });
def('tenir', 3, 'avoir', 'tenu', 'tiens tiens tient tenons tenez tiennent', 'ten', 'tiendr',
  { ps: 'tins tins tint tînmes tîntes tinrent', ppres: 'tenant', ro: 'a ține' });
def('pouvoir', 3, 'avoir', 'pu', 'peux peux peut pouvons pouvez peuvent', 'pouv', 'pourr',
  { subj: 'puisse puisses puisse puissions puissiez puissent', ps: 'pus pus put pûmes pûtes purent', imper: null, ppres: 'pouvant', ro: 'a putea' });
def('vouloir', 3, 'avoir', 'voulu', 'veux veux veut voulons voulez veulent', 'voul', 'voudr',
  { subj: 'veuille veuilles veuille voulions vouliez veuillent', ps: 'voulus voulus voulut voulûmes voulûtes voulurent', imper: 'veuille voulons veuillez', ppres: 'voulant', ro: 'a vrea' });
def('savoir', 3, 'avoir', 'su', 'sais sais sait savons savez savent', 'sav', 'saur',
  { subj: 'sache saches sache sachions sachiez sachent', ps: 'sus sus sut sûmes sûtes surent', imper: 'sache sachons sachez', ppres: 'sachant', ro: 'a ști' });
def('devoir', 3, 'avoir', 'dû', 'dois dois doit devons devez doivent', 'dev', 'devr',
  { ps: 'dus dus dut dûmes dûtes durent', ppres: 'devant', ro: 'a trebui / a datora' });
def('recevoir', 3, 'avoir', 'reçu', 'reçois reçois reçoit recevons recevez reçoivent', 'recev', 'recevr',
  { ps: 'reçus reçus reçut reçûmes reçûtes reçurent', ppres: 'recevant', ro: 'a primi' });
def('partir', 3, 'etre', 'parti', 'pars pars part partons partez partent', 'part', 'partir',
  { ps: 'partis partis partit partîmes partîtes partirent', ppres: 'partant', ro: 'a pleca' });
def('sortir', 3, 'both', 'sorti', 'sors sors sort sortons sortez sortent', 'sort', 'sortir',
  { ps: 'sortis sortis sortit sortîmes sortîtes sortirent', ppres: 'sortant', ro: 'a ieși / a scoate' });
def('dormir', 3, 'avoir', 'dormi', 'dors dors dort dormons dormez dorment', 'dorm', 'dormir',
  { ps: 'dormis dormis dormit dormîmes dormîtes dormirent', ppres: 'dormant', ro: 'a dormi' });
def('ouvrir', 3, 'avoir', 'ouvert', 'ouvre ouvres ouvre ouvrons ouvrez ouvrent', 'ouvr', 'ouvrir',
  { ps: 'ouvris ouvris ouvrit ouvrîmes ouvrîtes ouvrirent', ppres: 'ouvrant', ro: 'a deschide' });
def('offrir', 3, 'avoir', 'offert', 'offre offres offre offrons offrez offrent', 'offr', 'offrir',
  { ps: 'offris offris offrit offrîmes offrîtes offrirent', ppres: 'offrant', ro: 'a oferi' });
def('écrire', 3, 'avoir', 'écrit', 'écris écris écrit écrivons écrivez écrivent', 'écriv', 'écrir',
  { ps: 'écrivis écrivis écrivit écrivîmes écrivîtes écrivirent', ppres: 'écrivant', ro: 'a scrie' });
def('lire', 3, 'avoir', 'lu', 'lis lis lit lisons lisez lisent', 'lis', 'lir',
  { ps: 'lus lus lut lûmes lûtes lurent', ppres: 'lisant', ro: 'a citi' });
def('boire', 3, 'avoir', 'bu', 'bois bois boit buvons buvez boivent', 'buv', 'boir',
  { ps: 'bus bus but bûmes bûtes burent', ppres: 'buvant', ro: 'a bea' });
def('connaître', 3, 'avoir', 'connu', 'connais connais connaît connaissons connaissez connaissent', 'connaiss', 'connaîtr',
  { ps: 'connus connus connut connûmes connûtes connurent', ppres: 'connaissant', ro: 'a cunoaște' });
def('croire', 3, 'avoir', 'cru', 'crois crois croit croyons croyez croient', 'croy', 'croir',
  { ps: 'crus crus crut crûmes crûtes crurent', ppres: 'croyant', ro: 'a crede' });
def('vivre', 3, 'avoir', 'vécu', 'vis vis vit vivons vivez vivent', 'viv', 'vivr',
  { ps: 'vécus vécus vécut vécûmes vécûtes vécurent', ppres: 'vivant', ro: 'a trăi' });
def('courir', 3, 'avoir', 'couru', 'cours cours court courons courez courent', 'cour', 'courr',
  { ps: 'courus courus courut courûmes courûtes coururent', ppres: 'courant', ro: 'a alerga' });
def('naître', 3, 'etre', 'né', 'nais nais naît naissons naissez naissent', 'naiss', 'naîtr',
  { ps: 'naquis naquis naquit naquîmes naquîtes naquirent', ppres: 'naissant', ro: 'a se naște' });
def('mourir', 3, 'etre', 'mort', 'meurs meurs meurt mourons mourez meurent', 'mour', 'mourr',
  { ps: 'mourus mourus mourut mourûmes mourûtes moururent', ppres: 'mourant', ro: 'a muri' });
def('suivre', 3, 'avoir', 'suivi', 'suis suis suit suivons suivez suivent', 'suiv', 'suivr',
  { ps: 'suivis suivis suivit suivîmes suivîtes suivirent', ppres: 'suivant', ro: 'a urma' });
def('plaire', 3, 'avoir', 'plu', 'plais plais plaît plaisons plaisez plaisent', 'plais', 'plair',
  { ps: 'plus plus plut plûmes plûtes plurent', ppres: 'plaisant', ro: 'a plăcea' });
def('rire', 3, 'avoir', 'ri', 'ris ris rit rions riez rient', 'ri', 'rir',
  { ps: 'ris ris rit rîmes rîtes rirent', ppres: 'riant', ro: 'a râde' });
def('envoyer', 3, 'avoir', 'envoyé', 'envoie envoies envoie envoyons envoyez envoient', 'envoy', 'enverr',
  { ps: 'envoyai envoyas envoya envoyâmes envoyâtes envoyèrent', ppres: 'envoyant', ro: 'a trimite', hl: false });

derive('prendre', 'ap', 'apprendre', { ro: 'a învăța' });
derive('prendre', 'com', 'comprendre', { ro: 'a înțelege' });
derive('prendre', 'sur', 'surprendre', { ro: 'a surprinde' });
derive('prendre', 're', 'reprendre', { ro: 'a relua' });
derive('mettre', 'per', 'permettre', { ro: 'a permite' });
derive('mettre', 'pro', 'promettre', { ro: 'a promite' });
derive('mettre', 're', 'remettre', { ro: 'a înapoia / a amâna' });
derive('mettre', 'ad', 'admettre', { ro: 'a admite' });
derive('venir', 'de', 'devenir', { aux: 'etre', ro: 'a deveni' });
derive('venir', 're', 'revenir', { aux: 'etre', ro: 'a reveni' });
derive('venir', 'par', 'parvenir', { aux: 'etre', ro: 'a reuși să ajungă' });
derive('venir', 'pré', 'prévenir', { aux: 'avoir', ro: 'a preveni / a anunța' });
derive('tenir', 're', 'retenir', { ro: 'a reține' });
derive('tenir', 'ob', 'obtenir', { ro: 'a obține' });
derive('tenir', 'appar', 'appartenir', { ro: 'a aparține' });
derive('ouvrir', 'c', 'couvrir', { ro: 'a acoperi' });
derive('ouvrir', 'déc', 'découvrir', { ro: 'a descoperi' });
derive('écrire', 'd', 'décrire', { ro: 'a descrie' });
derive('connaître', 're', 'reconnaître', { ro: 'a recunoaște' });
derive('voir', 're', 'revoir', { ro: 'a revedea' });
derive('rire', 'sou', 'sourire', { ro: 'a zâmbi' });

/* ---------- auxiliar pentru verbe construite automat ---------- */
const AUXMAP = {
  arriver: 'etre', entrer: 'etre', rester: 'etre', tomber: 'etre', décéder: 'etre', repartir: 'etre',
  survenir: 'etre', rentrer: 'both', monter: 'both', descendre: 'both', passer: 'both', retourner: 'both',
  ressortir: 'both'
};

const RO = {
  parler: 'a vorbi', aimer: 'a iubi / a-i plăcea', manger: 'a mânca', donner: 'a da', regarder: 'a privi', écouter: 'a asculta',
  chanter: 'a cânta', danser: 'a dansa', travailler: 'a munci', étudier: 'a studia', habiter: 'a locui', trouver: 'a găsi',
  chercher: 'a căuta', acheter: 'a cumpăra', appeler: 'a chema', jeter: 'a arunca', préférer: 'a prefera', espérer: 'a spera',
  commencer: 'a începe', voyager: 'a călători', payer: 'a plăti', nettoyer: 'a curăța', lever: 'a ridica', arriver: 'a ajunge / a sosi',
  rester: 'a rămâne', tomber: 'a cădea', entrer: 'a intra', rentrer: 'a se întoarce', retourner: 'a se întoarce', monter: 'a urca',
  passer: 'a trece / a petrece', laver: 'a spăla', habiller: 'a îmbrăca', coucher: 'a culca', réveiller: 'a trezi', promener: 'a plimba',
  téléphoner: 'a telefona', inviter: 'a invita', aider: 'a ajuta', utiliser: 'a folosi', porter: 'a purta / a căra', jouer: 'a juca',
  finir: 'a termina', choisir: 'a alege', réussir: 'a reuși', grandir: 'a crește', obéir: 'a asculta (de)', réfléchir: 'a reflecta',
  remplir: 'a umple', punir: 'a pedepsi', agir: 'a acționa', grossir: 'a se îngrășa', maigrir: 'a slăbi', rougir: 'a roși',
  vendre: 'a vinde', attendre: 'a aștepta', répondre: 'a răspunde', perdre: 'a pierde', rendre: 'a înapoia / a face', entendre: 'a auzi',
  descendre: 'a coborî', défendre: 'a apăra', peindre: 'a picta', craindre: 'a se teme', joindre: 'a uni / a alătura'
};

/* ---------- reguli pentru verbe regulate ---------- */
const GRAVE = new Set(['acheter', 'racheter', 'geler', 'dégeler', 'peler', 'modeler', 'harceler', 'marteler', 'celer', 'déceler', 'receler', 'haleter', 'fureter', 'crocheter']);
const adj = (stem, end) => {
  if (/^[aoâ]/.test(end)) {
    if (/g$/.test(stem)) return stem + 'e';
    if (/c$/.test(stem)) return stem.slice(0, -1) + 'ç';
  }
  return stem;
};

function buildEr(inf) {
  const stem = inf.slice(0, -2);
  let sm = stem, futS = stem + 'er';
  if (/[oua]yer$/.test(inf)) { sm = stem.slice(0, -1) + 'i'; futS = sm + 'er'; }
  else if (/e[lt]er$/.test(inf)) {
    sm = GRAVE.has(inf) ? stem.slice(0, -2) + 'è' + stem.slice(-1) : stem + stem.slice(-1);
    futS = sm + 'er';
  }
  else if (/e[bcdfghjklmnpqrstvwxz]er$/.test(inf)) { sm = stem.slice(0, -2) + 'è' + stem.slice(-1); futS = sm + 'er'; }
  else if (/é[bcdfghjklmnpqrstvwxz]er$/.test(inf)) { sm = stem.slice(0, -2) + 'è' + stem.slice(-1); /* viitorul păstrează é */ }
  const isAdj = /[gc]er$/.test(inf);
  const nous = (isAdj ? adj(stem, 'ons') : stem) + 'ons';
  return {
    inf, g: 1, aux: AUXMAP[inf] || 'avoir', pp: stem + 'é',
    pres: [sm + 'e', sm + 'es', sm + 'e', nous, stem + 'ez', sm + 'ent'],
    impS: stem, fut: futS, adj: isAdj,
    ps: ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent'].map(e => adj(stem, e) + e),
    ppres: adj(stem, 'ant') + 'ant', ro: RO[inf], generic: true
  };
}
function buildIr(inf) {
  const stem = inf.slice(0, -2);
  return {
    inf, g: 2, aux: AUXMAP[inf] || 'avoir', pp: stem + 'i',
    pres: ['is', 'is', 'it', 'issons', 'issez', 'issent'].map(e => stem + e),
    impS: stem + 'iss', fut: inf, ps: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'].map(e => stem + e),
    ppres: stem + 'issant', ro: RO[inf], generic: true, assumed: true
  };
}
function buildDre(inf) {
  const stem = inf.slice(0, -2);
  return {
    inf, g: 3, aux: AUXMAP[inf] || 'avoir', pp: stem + 'u',
    pres: [stem + 's', stem + 's', stem, stem + 'ons', stem + 'ez', stem + 'ent'],
    impS: stem, fut: inf.slice(0, -1), ps: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'].map(e => stem + e),
    ppres: stem + 'ant', ro: RO[inf], generic: true
  };
}
function buildIndre(inf) {
  const s0 = inf.slice(0, -3), pl = s0.slice(0, -1) + 'gn';
  return {
    inf, g: 3, aux: 'avoir', pp: s0 + 't',
    pres: [s0 + 's', s0 + 's', s0 + 't', pl + 'ons', pl + 'ez', pl + 'ent'],
    impS: pl, fut: inf.slice(0, -1), ps: ['is', 'is', 'it', 'îmes', 'îtes', 'irent'].map(e => pl + e),
    ppres: pl + 'ant', ro: RO[inf], generic: true
  };
}
function generic(inf) {
  if (/er$/.test(inf) && inf !== 'aller' && inf.length > 3) return buildEr(inf);
  if (/ir$/.test(inf) && inf.length > 3) return buildIr(inf);
  if (/indre$/.test(inf)) return buildIndre(inf);
  if (/dre$/.test(inf) && !/(prendre|soudre|coudre|moudre)$/.test(inf)) return buildDre(inf);
  return null;
}

/* ---------- finalizare ---------- */
function finalize(r) {
  const v = Object.assign({}, r);
  if (v.imper === undefined) {
    const p = v.pres;
    v.imper = [/es$/.test(p[1]) ? p[1].slice(0, -1) : p[1], p[3], p[4]];
  }
  if (!v.subj) {
    const s1 = v.pres[5].replace(/ent$/, ''), s2 = v.impS;
    v.subj = [s1 + 'e', s1 + 'es', s1 + 'e', s2 + 'ions', s2 + 'iez', s1 + 'ent'];
    v.subjDefault = { s1, s2 };
  }
  if (!v.ppres) v.ppres = v.impS + 'ant';
  return v;
}
const VERBS = {};
Object.keys(RAW).forEach(k => { VERBS[k] = finalize(RAW[k]); });
const _gcache = {};

function getVerb(input) {
  let s = norm(input);
  let refl = false;
  const m = s.match(/^se\s+(.+)$/) || s.match(/^s'\s*(.+)$/);
  if (m) { refl = true; s = m[1]; }
  if (!s) return { v: null, reason: 'empty' };
  if (!/^[a-zàâäçéèêëîïôöùûüœæ-]+$/.test(s)) return { v: null, reason: 'invalid', inf: s };
  if (VERBS[s]) return { v: VERBS[s], refl, inf: s, assumed: false };
  if (!/(er|ir|re|oir)$/.test(s)) return { v: null, reason: 'invalid', inf: s };
  if (_gcache[s] === undefined) { const g = generic(s); _gcache[s] = g ? finalize(g) : null; }
  const v = _gcache[s];
  if (!v) return { v: null, reason: 'unknown', inf: s };
  return { v, refl, inf: s, assumed: !!v.assumed, generic: true };
}

/* ---------- acord participiu ---------- */
function agree(pp, f, p) {
  if (pp === 'été') return pp;
  let b = pp;
  if (pp === 'dû' && (f || p)) b = 'du';
  if (f) b += 'e';
  if (p && !/[sx]$/.test(b)) b += 's';
  return b;
}
function ppMarker(pp, i) {
  if (pp === 'été') return pp;
  const sx = /[sx]$/.test(pp);
  if (i <= 2) return pp + '(e)';
  if (i === 4) return pp + '(e)(s)';
  return sx ? pp + '(es)' : pp + '(e)s';
}
function ppForms(pp) { return [agree(pp, 0, 0), agree(pp, 1, 0), agree(pp, 0, 1), agree(pp, 1, 1)]; }

/* ---------- conjugare ---------- */
const E_IMP = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
const E_FUT = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
const seg = (t, c) => [t, c || ''];
const flat = segs => segs.map(s => s[0]).join('');

function presEnds(v) {
  if (v.hl === false) return null;
  if (v.g === 1) return ['e', 'es', 'e', 'ons', 'ez', 'ent'];
  if (v.g === 2) return ['is', 'is', 'it', 'issons', 'issez', 'issent'];
  const p0 = v.pres[0];
  if (/e$/.test(p0)) return ['e', 'es', 'e', 'ons', 'ez', 'ent'];
  if (/x$/.test(p0)) return ['x', 'x', 't', 'ons', 'ez', 'ent'];
  if (/s$/.test(p0)) return ['s', 's', 't', 'ons', 'ez', 'ent'];
  return null;
}
function splitSeg(f, e) {
  if (e && f.length > e.length && f.endsWith(e)) return [seg(f.slice(0, -e.length), 'st'), seg(e, 'en')];
  return [seg(f, 'st')];
}
function simpleSegs(v, tid) {
  switch (tid) {
    case 'present': { const ends = presEnds(v); return v.pres.map((f, i) => splitSeg(f, ends && ends[i])); }
    case 'imp': return E_IMP.map(e => [seg(v.adj ? adj(v.impS, e) : v.impS, 'st'), seg(e, 'en')]);
    case 'fs': return E_FUT.map(e => [seg(v.fut, 'st'), seg(e, 'en')]);
    case 'cond': return E_IMP.map(e => [seg(v.fut, 'st'), seg(e, 'en')]);
    case 'subj': {
      if (v.subjDefault) {
        const { s1, s2 } = v.subjDefault, E = ['e', 'es', 'e', 'ions', 'iez', 'ent'];
        return E.map((e, i) => [seg(i === 3 || i === 4 ? s2 : s1, 'st'), seg(e, 'en')]);
      }
      return v.subj.map(f => [seg(f, 'st')]);
    }
    case 'ps': return v.ps ? v.ps.map(f => [seg(f, 'st')]) : null;
  }
  return null;
}

const COMP = { pc: 'present', pqp: 'imp', fa: 'fs', condp: 'cond' };
const startsVowel = s => VOWEL.test(s);
function reflPre(i, next) {
  const p = REFL[i];
  if ((i === 0 || i === 1 || i === 2 || i === 5) && startsVowel(next)) return seg(p.slice(0, -1) + "'", 'rf');
  return seg(p + ' ', 'rf');
}
function reflInf(i, inf) {
  const p = REFL[i];
  if ((i === 0 || i === 1 || i === 2 || i === 5) && startsVowel(inf)) return p.slice(0, -1) + "'" + inf;
  return p + ' ' + inf;
}

/* rows(vo, tid, opts) -> [{lab, pre, segs, full}] (6 rânduri; impératif: 3) */
function rows(vo, tid, o) {
  o = o || {};
  const v = vo.v, refl = !!vo.refl;
  let aux = o.aux || (refl ? 'etre' : (v.aux === 'both' ? 'etre' : v.aux));
  const out = [];
  const push = (i, segs) => {
    const first = segs[0][0];
    let pre;
    if (tid === 'subj') {
      pre = ['que ', 'que ', "qu'", 'que ', 'que ', "qu'"][i];
      pre += (i === 0 ? (startsVowel(first) ? "j'" : 'je ') : (PRON[i] + ' '));
    } else {
      pre = i === 0 ? (startsVowel(first) ? "j'" : 'je ') : PRON[i] + ' ';
    }
    out.push({ i, lab: PRON[i], pre, segs, full: pre + flat(segs) });
  };
  const withRefl = (i, segs) => refl ? [reflPre(i, segs[0][0]), ...segs] : segs;

  if (tid === 'impe') {
    [1, 3, 4].forEach((i, k) => {
      let f = v.imper ? v.imper[k] : null;
      if (!f) return;
      const segs = refl ? [seg(f, 'st'), seg('-' + ['toi', 'nous', 'vous'][k], 'rf')] : [seg(f, 'st')];
      out.push({ i, lab: ['tu', 'nous', 'vous'][k], pre: '', segs, full: flat(segs) });
    });
    return out;
  }
  if (COMP[tid]) {
    const ax = rows({ v: VERBS[aux === 'etre' ? 'être' : 'avoir'], refl: false }, COMP[tid]);
    const etre = aux === 'etre';
    for (let i = 0; i < 6; i++) {
      const a = ax[i].segs.map(s => seg(s[0], 'ax'));
      let ppText;
      if (etre) ppText = o.agr ? agree(v.pp, o.agr.f, o.agr.p) : ppMarker(v.pp, i);
      else ppText = o.agrAvoir ? agree(v.pp, o.agrAvoir.f, o.agrAvoir.p) : v.pp;
      let segs = [...a, seg(' ', ''), seg(ppText, 'pp')];
      if (refl) segs = [reflPre(i, a[0][0]), ...segs];
      push(i, segs);
    }
    return out;
  }
  if (tid === 'fp' || tid === 'pr') {
    const base = rows({ v: VERBS[tid === 'fp' ? 'aller' : 'venir'], refl: false }, 'present');
    for (let i = 0; i < 6; i++) {
      const a = base[i].segs.map(s => seg(s[0], 'ax'));
      const infTxt = refl ? reflInf(i, vo.inf) : vo.inf;
      let segs;
      if (tid === 'fp') segs = [...a, seg(' ', ''), seg(infTxt, 'pp')];
      else segs = [...a, seg(' ', ''), seg(startsVowel(infTxt) ? "d'" : 'de ', ''), seg(infTxt, 'pp')];
      push(i, segs);
    }
    return out;
  }
  const ss = simpleSegs(v, tid);
  if (!ss) return null;
  for (let i = 0; i < 6; i++) push(i, withRefl(i, ss[i]));
  return out;
}

/* o singură formă ca text (pentru verificarea răspunsurilor) */
function form(vo, tid, i, o) {
  const r = rows(vo, tid, o);
  if (!r) return null;
  const row = r.find(x => x.i === i);
  return row ? row.full : null;
}

/* propoziție completă: subiect + formă + restul */
function sentenceParts(d, tid, o) {
  // d: {s, i, verb, post, g:'f'|'m', n:'s'|'p'}
  const vo = getVerb(d.verb);
  const opts = Object.assign({}, o);
  if (d.g || d.n) opts.agr = { f: d.g === 'f', p: d.n === 'p' };
  if (d.agrAvoir) opts.agrAvoir = d.agrAvoir;
  const r = rows(vo, tid, opts).find(x => x.i === d.i);
  const first = r.segs[0][0];
  let subj = d.s, join = ' ';
  if (/^je$/i.test(d.s) && startsVowel(first)) { subj = d.s[0] + "'"; join = ''; }
  return { subj: subj + join, verb: flat(r.segs), post: d.post ? ' ' + d.post : '' };
}
function sentence(d, tid, o) {
  const p = sentenceParts(d, tid, o);
  const txt = p.subj + p.verb + p.post;
  return txt.charAt(0).toUpperCase() + txt.slice(1) + '.';
}

const TENSE_NAMES = {
  present: 'présent', pc: 'passé composé', imp: 'imparfait', pqp: 'plus-que-parfait', fs: 'futur simple',
  fp: 'futur proche', pr: 'passé récent', cond: 'conditionnel présent', condp: 'conditionnel passé',
  subj: 'subjonctif présent', fa: 'futur antérieur', ps: 'passé simple', impe: 'impératif présent'
};
const TENSE_RO = {
  present: 'Prezent', pc: 'Perfect compus', imp: 'Imperfect', pqp: 'Mai mult ca perfect', fs: 'Viitor simplu',
  fp: 'Viitor apropiat', pr: 'Trecut recent', cond: 'Condițional prezent', condp: 'Condițional trecut',
  subj: 'Conjunctiv prezent', fa: 'Viitor anterior', ps: 'Perfect simplu', impe: 'Imperativ'
};

const API = {
  PRON, REFL, VERBS, RO, norm, noAcc, getVerb, rows, form, sentence, sentenceParts, agree, ppMarker, ppForms, flat,
  TENSE_NAMES, TENSE_RO, startsVowel, reflInf
};
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else G.FR = API;
})(typeof window !== 'undefined' ? window : globalThis);
