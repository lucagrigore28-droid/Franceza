// Verifică motorul de conjugare față de forme de referință scrise de mână.
const FR = require('./engine.js');
let fails = 0, total = 0;
function t(verb, tid, expected, opts) {
  const vo = FR.getVerb(verb);
  if (!vo.v) { console.log('LIPSĂ verb', verb); fails++; return; }
  const rows = FR.rows(vo, tid, opts);
  const got = rows ? rows.map(r => r.full) : null;
  total++;
  const exp = expected.split(' | ');
  if (!got || got.length !== exp.length || got.some((g, i) => g !== exp[i])) {
    fails++;
    console.log('✗', verb, tid, '\n   așteptat:', exp.join(' | '), '\n   primit  :', got && got.join(' | '));
  }
}

// ---- présent
t('parler', 'present', "je parle | tu parles | il / elle / on parle | nous parlons | vous parlez | ils / elles parlent");
t('aimer', 'present', "j'aime | tu aimes | il / elle / on aime | nous aimons | vous aimez | ils / elles aiment");
t('finir', 'present', "je finis | tu finis | il / elle / on finit | nous finissons | vous finissez | ils / elles finissent");
t('vendre', 'present', "je vends | tu vends | il / elle / on vend | nous vendons | vous vendez | ils / elles vendent");
t('manger', 'present', "je mange | tu manges | il / elle / on mange | nous mangeons | vous mangez | ils / elles mangent");
t('commencer', 'present', "je commence | tu commences | il / elle / on commence | nous commençons | vous commencez | ils / elles commencent");
t('appeler', 'present', "j'appelle | tu appelles | il / elle / on appelle | nous appelons | vous appelez | ils / elles appellent");
t('acheter', 'present', "j'achète | tu achètes | il / elle / on achète | nous achetons | vous achetez | ils / elles achètent");
t('préférer', 'present', "je préfère | tu préfères | il / elle / on préfère | nous préférons | vous préférez | ils / elles préfèrent");
t('nettoyer', 'present', "je nettoie | tu nettoies | il / elle / on nettoie | nous nettoyons | vous nettoyez | ils / elles nettoient");
t('jeter', 'present', "je jette | tu jettes | il / elle / on jette | nous jetons | vous jetez | ils / elles jettent");
t('lever', 'present', "je lève | tu lèves | il / elle / on lève | nous levons | vous levez | ils / elles lèvent");
t('être', 'present', "je suis | tu es | il / elle / on est | nous sommes | vous êtes | ils / elles sont");
t('avoir', 'present', "j'ai | tu as | il / elle / on a | nous avons | vous avez | ils / elles ont");
t('aller', 'present', "je vais | tu vas | il / elle / on va | nous allons | vous allez | ils / elles vont");
t('faire', 'present', "je fais | tu fais | il / elle / on fait | nous faisons | vous faites | ils / elles font");
t('prendre', 'present', "je prends | tu prends | il / elle / on prend | nous prenons | vous prenez | ils / elles prennent");
t('comprendre', 'present', "je comprends | tu comprends | il / elle / on comprend | nous comprenons | vous comprenez | ils / elles comprennent");
t('venir', 'present', "je viens | tu viens | il / elle / on vient | nous venons | vous venez | ils / elles viennent");
t('pouvoir', 'present', "je peux | tu peux | il / elle / on peut | nous pouvons | vous pouvez | ils / elles peuvent");
t('ouvrir', 'present', "j'ouvre | tu ouvres | il / elle / on ouvre | nous ouvrons | vous ouvrez | ils / elles ouvrent");
t('peindre', 'present', "je peins | tu peins | il / elle / on peint | nous peignons | vous peignez | ils / elles peignent");
t('craindre', 'present', "je crains | tu crains | il / elle / on craint | nous craignons | vous craignez | ils / elles craignent");

// ---- passé composé
t('parler', 'pc', "j'ai parlé | tu as parlé | il / elle / on a parlé | nous avons parlé | vous avez parlé | ils / elles ont parlé");
t('finir', 'pc', "j'ai fini | tu as fini | il / elle / on a fini | nous avons fini | vous avez fini | ils / elles ont fini");
t('aller', 'pc', "je suis allé(e) | tu es allé(e) | il / elle / on est allé(e) | nous sommes allé(e)s | vous êtes allé(e)(s) | ils / elles sont allé(e)s");
t('prendre', 'pc', "j'ai pris | tu as pris | il / elle / on a pris | nous avons pris | vous avez pris | ils / elles ont pris");
t('se laver', 'pc', "je me suis lavé(e) | tu t'es lavé(e) | il / elle / on s'est lavé(e) | nous nous sommes lavé(e)s | vous vous êtes lavé(e)(s) | ils / elles se sont lavé(e)s");
t('s\'habiller', 'pc', "je me suis habillé(e) | tu t'es habillé(e) | il / elle / on s'est habillé(e) | nous nous sommes habillé(e)s | vous vous êtes habillé(e)(s) | ils / elles se sont habillé(e)s");
t('monter', 'pc', "je suis monté(e) | tu es monté(e) | il / elle / on est monté(e) | nous sommes monté(e)s | vous êtes monté(e)(s) | ils / elles sont monté(e)s");
t('monter', 'pc', "j'ai monté | tu as monté | il / elle / on a monté | nous avons monté | vous avez monté | ils / elles ont monté", { aux: 'avoir' });
t('être', 'pc', "j'ai été | tu as été | il / elle / on a été | nous avons été | vous avez été | ils / elles ont été");
t('mettre', 'pc', "j'ai mis | tu as mis | il / elle / on a mis | nous avons mis | vous avez mis | ils / elles ont mis");
t('mourir', 'pc', "je suis mort(e) | tu es mort(e) | il / elle / on est mort(e) | nous sommes mort(e)s | vous êtes mort(e)(s) | ils / elles sont mort(e)s");

// ---- imparfait
t('parler', 'imp', "je parlais | tu parlais | il / elle / on parlait | nous parlions | vous parliez | ils / elles parlaient");
t('manger', 'imp', "je mangeais | tu mangeais | il / elle / on mangeait | nous mangions | vous mangiez | ils / elles mangeaient");
t('commencer', 'imp', "je commençais | tu commençais | il / elle / on commençait | nous commencions | vous commenciez | ils / elles commençaient");
t('finir', 'imp', "je finissais | tu finissais | il / elle / on finissait | nous finissions | vous finissiez | ils / elles finissaient");
t('être', 'imp', "j'étais | tu étais | il / elle / on était | nous étions | vous étiez | ils / elles étaient");
t('avoir', 'imp', "j'avais | tu avais | il / elle / on avait | nous avions | vous aviez | ils / elles avaient");
t('faire', 'imp', "je faisais | tu faisais | il / elle / on faisait | nous faisions | vous faisiez | ils / elles faisaient");
t('prendre', 'imp', "je prenais | tu prenais | il / elle / on prenait | nous prenions | vous preniez | ils / elles prenaient");
t('aller', 'imp', "j'allais | tu allais | il / elle / on allait | nous allions | vous alliez | ils / elles allaient");

// ---- plus-que-parfait
t('parler', 'pqp', "j'avais parlé | tu avais parlé | il / elle / on avait parlé | nous avions parlé | vous aviez parlé | ils / elles avaient parlé");
t('partir', 'pqp', "j'étais parti(e) | tu étais parti(e) | il / elle / on était parti(e) | nous étions parti(e)s | vous étiez parti(e)(s) | ils / elles étaient parti(e)s");

// ---- futur simple
t('parler', 'fs', "je parlerai | tu parleras | il / elle / on parlera | nous parlerons | vous parlerez | ils / elles parleront");
t('finir', 'fs', "je finirai | tu finiras | il / elle / on finira | nous finirons | vous finirez | ils / elles finiront");
t('vendre', 'fs', "je vendrai | tu vendras | il / elle / on vendra | nous vendrons | vous vendrez | ils / elles vendront");
t('être', 'fs', "je serai | tu seras | il / elle / on sera | nous serons | vous serez | ils / elles seront");
t('avoir', 'fs', "j'aurai | tu auras | il / elle / on aura | nous aurons | vous aurez | ils / elles auront");
t('aller', 'fs', "j'irai | tu iras | il / elle / on ira | nous irons | vous irez | ils / elles iront");
t('faire', 'fs', "je ferai | tu feras | il / elle / on fera | nous ferons | vous ferez | ils / elles feront");
t('voir', 'fs', "je verrai | tu verras | il / elle / on verra | nous verrons | vous verrez | ils / elles verront");
t('venir', 'fs', "je viendrai | tu viendras | il / elle / on viendra | nous viendrons | vous viendrez | ils / elles viendront");
t('pouvoir', 'fs', "je pourrai | tu pourras | il / elle / on pourra | nous pourrons | vous pourrez | ils / elles pourront");
t('acheter', 'fs', "j'achèterai | tu achèteras | il / elle / on achètera | nous achèterons | vous achèterez | ils / elles achèteront");
t('appeler', 'fs', "j'appellerai | tu appelleras | il / elle / on appellera | nous appellerons | vous appellerez | ils / elles appelleront");
t('nettoyer', 'fs', "je nettoierai | tu nettoieras | il / elle / on nettoiera | nous nettoierons | vous nettoierez | ils / elles nettoieront");
t('envoyer', 'fs', "j'enverrai | tu enverras | il / elle / on enverra | nous enverrons | vous enverrez | ils / elles enverront");
t('préférer', 'fs', "je préférerai | tu préféreras | il / elle / on préférera | nous préférerons | vous préférerez | ils / elles préféreront");

// ---- futur proche / passé récent
t('manger', 'fp', "je vais manger | tu vas manger | il / elle / on va manger | nous allons manger | vous allez manger | ils / elles vont manger");
t('arriver', 'pr', "je viens d'arriver | tu viens d'arriver | il / elle / on vient d'arriver | nous venons d'arriver | vous venez d'arriver | ils / elles viennent d'arriver");
t('finir', 'pr', "je viens de finir | tu viens de finir | il / elle / on vient de finir | nous venons de finir | vous venez de finir | ils / elles viennent de finir");
t('se laver', 'fp', "je vais me laver | tu vas te laver | il / elle / on va se laver | nous allons nous laver | vous allez vous laver | ils / elles vont se laver");
t("s'habiller", 'pr', "je viens de m'habiller | tu viens de t'habiller | il / elle / on vient de s'habiller | nous venons de nous habiller | vous venez de vous habiller | ils / elles viennent de s'habiller");

// ---- conditionnel
t('parler', 'cond', "je parlerais | tu parlerais | il / elle / on parlerait | nous parlerions | vous parleriez | ils / elles parleraient");
t('être', 'cond', "je serais | tu serais | il / elle / on serait | nous serions | vous seriez | ils / elles seraient");
t('avoir', 'cond', "j'aurais | tu aurais | il / elle / on aurait | nous aurions | vous auriez | ils / elles auraient");
t('vouloir', 'cond', "je voudrais | tu voudrais | il / elle / on voudrait | nous voudrions | vous voudriez | ils / elles voudraient");
t('aller', 'condp', "je serais allé(e) | tu serais allé(e) | il / elle / on serait allé(e) | nous serions allé(e)s | vous seriez allé(e)(s) | ils / elles seraient allé(e)s");
t('savoir', 'condp', "j'aurais su | tu aurais su | il / elle / on aurait su | nous aurions su | vous auriez su | ils / elles auraient su");

// ---- futur antérieur
t('finir', 'fa', "j'aurai fini | tu auras fini | il / elle / on aura fini | nous aurons fini | vous aurez fini | ils / elles auront fini");
t('arriver', 'fa', "je serai arrivé(e) | tu seras arrivé(e) | il / elle / on sera arrivé(e) | nous serons arrivé(e)s | vous serez arrivé(e)(s) | ils / elles seront arrivé(e)s");

// ---- subjonctif
t('parler', 'subj', "que je parle | que tu parles | qu'il / elle / on parle | que nous parlions | que vous parliez | qu'ils / elles parlent");
t('finir', 'subj', "que je finisse | que tu finisses | qu'il / elle / on finisse | que nous finissions | que vous finissiez | qu'ils / elles finissent");
t('prendre', 'subj', "que je prenne | que tu prennes | qu'il / elle / on prenne | que nous prenions | que vous preniez | qu'ils / elles prennent");
t('venir', 'subj', "que je vienne | que tu viennes | qu'il / elle / on vienne | que nous venions | que vous veniez | qu'ils / elles viennent");
t('voir', 'subj', "que je voie | que tu voies | qu'il / elle / on voie | que nous voyions | que vous voyiez | qu'ils / elles voient");
t('boire', 'subj', "que je boive | que tu boives | qu'il / elle / on boive | que nous buvions | que vous buviez | qu'ils / elles boivent");
t('devoir', 'subj', "que je doive | que tu doives | qu'il / elle / on doive | que nous devions | que vous deviez | qu'ils / elles doivent");
t('mourir', 'subj', "que je meure | que tu meures | qu'il / elle / on meure | que nous mourions | que vous mouriez | qu'ils / elles meurent");
t('être', 'subj', "que je sois | que tu sois | qu'il / elle / on soit | que nous soyons | que vous soyez | qu'ils / elles soient");
t('avoir', 'subj', "que j'aie | que tu aies | qu'il / elle / on ait | que nous ayons | que vous ayez | qu'ils / elles aient");
t('aller', 'subj', "que j'aille | que tu ailles | qu'il / elle / on aille | que nous allions | que vous alliez | qu'ils / elles aillent");
t('faire', 'subj', "que je fasse | que tu fasses | qu'il / elle / on fasse | que nous fassions | que vous fassiez | qu'ils / elles fassent");
t('pouvoir', 'subj', "que je puisse | que tu puisses | qu'il / elle / on puisse | que nous puissions | que vous puissiez | qu'ils / elles puissent");
t('savoir', 'subj', "que je sache | que tu saches | qu'il / elle / on sache | que nous sachions | que vous sachiez | qu'ils / elles sachent");
t('manger', 'subj', "que je mange | que tu manges | qu'il / elle / on mange | que nous mangions | que vous mangiez | qu'ils / elles mangent");
t('acheter', 'subj', "que j'achète | que tu achètes | qu'il / elle / on achète | que nous achetions | que vous achetiez | qu'ils / elles achètent");
t('vendre', 'subj', "que je vende | que tu vendes | qu'il / elle / on vende | que nous vendions | que vous vendiez | qu'ils / elles vendent");

// ---- passé simple
t('parler', 'ps', "je parlai | tu parlas | il / elle / on parla | nous parlâmes | vous parlâtes | ils / elles parlèrent");
t('manger', 'ps', "je mangeai | tu mangeas | il / elle / on mangea | nous mangeâmes | vous mangeâtes | ils / elles mangèrent");
t('finir', 'ps', "je finis | tu finis | il / elle / on finit | nous finîmes | vous finîtes | ils / elles finirent");
t('vendre', 'ps', "je vendis | tu vendis | il / elle / on vendit | nous vendîmes | vous vendîtes | ils / elles vendirent");
t('être', 'ps', "je fus | tu fus | il / elle / on fut | nous fûmes | vous fûtes | ils / elles furent");
t('avoir', 'ps', "j'eus | tu eus | il / elle / on eut | nous eûmes | vous eûtes | ils / elles eurent");

// ---- impératif
t('parler', 'impe', "parle | parlons | parlez");
t('finir', 'impe', "finis | finissons | finissez");
t('être', 'impe', "sois | soyons | soyez");
t('avoir', 'impe', "aie | ayons | ayez");
t('aller', 'impe', "va | allons | allez");
t('prendre', 'impe', "prends | prenons | prenez");
t('se laver', 'impe', "lave-toi | lavons-nous | lavez-vous");
t('ouvrir', 'impe', "ouvre | ouvrons | ouvrez");

// ---- participii
function pp(inf, exp) {
  total++;
  const vo = FR.getVerb(inf);
  if (!vo.v || vo.v.pp !== exp) { fails++; console.log('✗ pp', inf, 'așteptat', exp, 'primit', vo.v && vo.v.pp); }
}
[['parler', 'parlé'], ['finir', 'fini'], ['vendre', 'vendu'], ['être', 'été'], ['avoir', 'eu'], ['faire', 'fait'], ['dire', 'dit'],
 ['prendre', 'pris'], ['comprendre', 'compris'], ['apprendre', 'appris'], ['mettre', 'mis'], ['permettre', 'permis'], ['promettre', 'promis'],
 ['voir', 'vu'], ['venir', 'venu'], ['devenir', 'devenu'], ['pouvoir', 'pu'], ['vouloir', 'voulu'], ['savoir', 'su'], ['devoir', 'dû'],
 ['recevoir', 'reçu'], ['ouvrir', 'ouvert'], ['offrir', 'offert'], ['couvrir', 'couvert'], ['découvrir', 'découvert'], ['écrire', 'écrit'],
 ['décrire', 'décrit'], ['lire', 'lu'], ['boire', 'bu'], ['connaître', 'connu'], ['reconnaître', 'reconnu'], ['croire', 'cru'], ['vivre', 'vécu'],
 ['courir', 'couru'], ['naître', 'né'], ['mourir', 'mort'], ['peindre', 'peint'], ['craindre', 'craint'], ['rire', 'ri'], ['sourire', 'souri'],
 ['plaire', 'plu'], ['tenir', 'tenu'], ['obtenir', 'obtenu'], ['suivre', 'suivi'], ['dormir', 'dormi'], ['partir', 'parti'], ['sortir', 'sorti']
].forEach(([a, b]) => pp(a, b));

// ---- auxiliare
function aux(inf, exp) {
  total++;
  const vo = FR.getVerb(inf);
  if (!vo.v || vo.v.aux !== exp) { fails++; console.log('✗ aux', inf, 'așteptat', exp, 'primit', vo.v && vo.v.aux); }
}
[['aller', 'etre'], ['venir', 'etre'], ['arriver', 'etre'], ['partir', 'etre'], ['entrer', 'etre'], ['rester', 'etre'], ['tomber', 'etre'], ['naître', 'etre'],
 ['mourir', 'etre'], ['devenir', 'etre'], ['revenir', 'etre'], ['monter', 'both'], ['descendre', 'both'], ['sortir', 'both'], ['rentrer', 'both'],
 ['retourner', 'both'], ['passer', 'both'], ['manger', 'avoir'], ['finir', 'avoir'], ['être', 'avoir'], ['prévenir', 'avoir']
].forEach(([a, b]) => aux(a, b));

// ---- acord
function ag(p, f, pl, exp) {
  total++;
  const got = FR.agree(p, f, pl);
  if (got !== exp) { fails++; console.log('✗ agree', p, f, pl, 'așteptat', exp, 'primit', got); }
}
ag('acheté', 0, 0, 'acheté'); ag('acheté', 1, 0, 'achetée'); ag('acheté', 0, 1, 'achetés'); ag('acheté', 1, 1, 'achetées');
ag('pris', 0, 0, 'pris'); ag('pris', 1, 0, 'prise'); ag('pris', 0, 1, 'pris'); ag('pris', 1, 1, 'prises');
ag('fait', 1, 1, 'faites'); ag('écrit', 1, 0, 'écrite'); ag('ouvert', 1, 1, 'ouvertes'); ag('mort', 1, 0, 'morte');
ag('dû', 0, 0, 'dû'); ag('dû', 1, 0, 'due'); ag('dû', 0, 1, 'dus'); ag('dû', 1, 1, 'dues'); ag('été', 1, 1, 'été');
ag('vu', 0, 1, 'vus'); ag('mis', 1, 0, 'mise'); ag('né', 1, 0, 'née');

// ---- propoziții
function s(d, tid, exp) {
  total++;
  const got = FR.sentence(d, tid);
  if (got !== exp) { fails++; console.log('✗ sentence', tid, '\n  așteptat:', exp, '\n  primit  :', got); }
}
s({ s: 'Elle', i: 2, verb: 'partir', post: 'à huit heures', g: 'f' }, 'pc', "Elle est partie à huit heures.");
s({ s: 'Ils', i: 5, verb: 'arriver', post: 'à la gare', g: 'm', n: 'p' }, 'pc', "Ils sont arrivés à la gare.");
s({ s: 'Je', i: 0, verb: 'aimer', post: 'ce film' }, 'imp', "J'aimais ce film.");
s({ s: 'Je', i: 0, verb: 'manger', post: 'une pomme' }, 'pc', "J'ai mangé une pomme.");
s({ s: 'Elle', i: 2, verb: 'se lever', post: 'à sept heures', g: 'f' }, 'pc', "Elle s'est levée à sept heures.");
s({ s: 'Nous', i: 3, verb: 'se coucher', post: 'tard', g: 'f', n: 'p' }, 'pc', "Nous nous sommes couchées tard.");
s({ s: 'Je', i: 0, verb: 'arriver', post: 'en retard', g: 'm' }, 'pr', "Je viens d'arriver en retard.");

console.log(`\n${total - fails}/${total} teste trecute` + (fails ? `, ${fails} EȘUATE` : ' ✓'));
process.exit(fails ? 1 : 0);
