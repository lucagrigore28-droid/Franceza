/* ===== Conținut: fișele timpurilor, liste, arbore de decizie, bănci de exerciții ===== */
(function (G) {
'use strict';
const C = {};

/* ---------- fișele timpurilor ---------- */
C.TENSES = [
  {
    id: 'present', fr: 'Le présent', ro: 'Prezentul', lvl: 'ess',
    short: 'Ce se întâmplă acum, ce se întâmplă mereu sau ce se știe că e adevărat.',
    formula: [['radical', 's'], ['+', 'op'], ['terminațiile grupei', 'v']],
    uses: [
      ['Ce se întâmplă acum', 'Je mange une pomme.', 'Mănânc un măr.'],
      ['Obiceiuri și adevăruri generale', 'Elle va à l’école tous les jours.', 'Ea merge la școală în fiecare zi.'],
      ['Viitor foarte apropiat (cu un cuvânt de timp viitor)', 'Je pars demain.', 'Plec mâine.']
    ],
    steps: [
      'Găsește <b>infinitivul</b> și <b>grupa</b> verbului (-er → grupa 1, -ir cu <i>-issons</i> → grupa 2, restul → grupa 3).',
      'Taie terminația infinitivului (<i>parler → parl-</i>, <i>finir → fin-</i>, <i>vendre → vend-</i>). Rămâne <b>radicalul</b>.',
      'Adaugă terminațiile grupei, după persoană (tabelul de mai jos).',
      'La grupa 3 verifică dacă verbul e neregulat (<i>être, avoir, aller, faire, prendre, pouvoir…</i>): are radical și terminații proprii.'
    ],
    endings: {
      head: ['', 'je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'],
      rows: [
        ['Grupa 1 (-er)', '-e', '-es', '-e', '-ons', '-ez', '-ent'],
        ['Grupa 2 (-ir / -issons)', '-is', '-is', '-it', '-issons', '-issez', '-issent'],
        ['Grupa 3 (majoritatea)', '-s', '-s', '-t', '-ons', '-ez', '-ent'],
        ['pouvoir, vouloir, valoir', '-x', '-x', '-t', '-ons', '-ez', '-ent']
      ],
      note: 'La grupa 3 verbele în <b>-dre</b> nu au <i>-t</i> la persoana a 3-a: <i>il vend, il prend</i> (nu «il vendt»).'
    },
    signals: ['maintenant', 'en ce moment', 'aujourd’hui', 'd’habitude', 'chaque jour', 'toujours', 'souvent', 'tous les matins'],
    traps: [
      'La grupa 1, <b>tu</b> primește <b>-s</b>: <i>tu parles</i>. Dar <b>il</b> nu are -t: <i>il parle</i>.',
      '<b>-ger</b> și <b>-cer</b>: la <i>nous</i> se păstrează sunetul moale: <i>nous mangeons, nous commençons</i>.',
      '<i>vous faites, vous dites, vous êtes</i> sunt excepții de la regula «-ez».',
      'Schimbări de ortografie la grupa 1: <i>j’appelle, j’achète, je nettoie, je préfère</i> (în fața unui -e mut).'
    ],
    models: ['parler', 'finir', 'vendre', 'prendre', 'être', 'avoir', 'aller', 'faire', 'venir', 'pouvoir', 'vouloir']
  },
  {
    id: 'pc', fr: 'Le passé composé', ro: 'Perfectul compus', lvl: 'ess',
    short: 'O acțiune terminată în trecut, văzută ca un eveniment. Cel mai folosit timp pentru trecut.',
    formula: [['avoir / être', 'a'], ['la prezent', 'op'], ['+', 'op'], ['participe passé', 'a']],
    uses: [
      ['Acțiune terminată, într-un moment precis din trecut', 'Hier, j’ai mangé une pizza.', 'Ieri am mâncat o pizza.'],
      ['Acțiuni care se succed (ce s-a întâmplat, pe rând)', 'Il est entré, il a ouvert la fenêtre et il a respiré.', 'A intrat, a deschis fereastra și a respirat.'],
      ['Acțiune cu durată sau repetare delimitată', 'J’ai habité à Paris pendant trois ans.', 'Am locuit trei ani la Paris.'],
      ['Rezultat valabil și acum', 'Il a perdu ses clés.', 'Și-a pierdut cheile (și încă nu le are).']
    ],
    steps: [
      '<b>Alege auxiliarul</b>: <i>avoir</i> pentru aproape toate verbele; <i>être</i> pentru cele 16 verbe de mișcare / schimbare (DR &amp; MRS VANDERTRAMP) și pentru toate verbele pronominale.',
      'Pune auxiliarul la <b>prezent</b>, la persoana potrivită (<i>j’ai, tu as, il a… / je suis, tu es, il est…</i>).',
      'Formează <b>participiul trecut</b>: -er → <b>-é</b>, -ir (gr. 2) → <b>-i</b>, -re → <b>-u</b>, sau forma neregulată (<i>pris, fait, dit, mis, vu…</i>).',
      'Verifică <b>acordul</b>: cu <i>être</i> se acordă cu subiectul; cu <i>avoir</i> se acordă cu COD-ul, dar numai dacă acesta e înaintea verbului.'
    ],
    signals: ['hier', 'hier soir', 'la semaine dernière', 'l’année dernière', 'il y a trois jours', 'ce matin', 'lundi dernier', 'en 2020', 'soudain', 'tout à coup', 'd’abord', 'puis', 'ensuite', 'enfin', 'une fois', 'deux fois'],
    traps: [
      'Negația înconjoară <b>auxiliarul</b>: <i>je n’ai pas mangé</i> (nu «je n’ai mangé pas»).',
      'Verbele pronominale folosesc <b>mereu être</b>: <i>je me suis levé(e)</i>, nu «je m’ai levé».',
      'Cu <b>être</b>, participiul se acordă cu subiectul: <i>elle est partie, ils sont partis</i>. Cu <b>avoir</b>, doar cu COD-ul din față: <i>les fleurs que j’ai achetées</i>.',
      'Franceza vorbită folosește <i>passé composé</i> pentru orice trecut încheiat. <i>Passé simple</i> apare doar în cărți.'
    ],
    models: ['parler', 'finir', 'vendre', 'prendre', 'aller', 'venir', 'faire', 'voir', 'se laver', 'être', 'avoir']
  },
  {
    id: 'imp', fr: 'L’imparfait', ro: 'Imperfectul', lvl: 'ess',
    short: 'Cum erau lucrurile în trecut: descrieri, obiceiuri, acțiuni în desfășurare, fără început și sfârșit precizat.',
    formula: [['radicalul lui «nous» (prezent)', 's'], ['+', 'op'], ['ais, ais, ait, ions, iez, aient', 'v']],
    uses: [
      ['Descriere în trecut (decor, aspect, stări)', 'La maison était grande et avait un jardin.', 'Casa era mare și avea o grădină.'],
      ['Obiceiuri din trecut', 'Quand j’étais petit, je jouais au foot tous les jours.', 'Când eram mic, jucam fotbal în fiecare zi.'],
      ['Acțiune în desfășurare, în fundal, când se întâmplă altceva', 'Il pleuvait quand je suis sorti.', 'Ploua când am ieșit.'],
      ['Vârstă, vreme, sentimente', 'J’avais dix ans. Il faisait froid.', 'Aveam zece ani. Era frig.'],
      ['Condiția cu SI (ireal în prezent)', 'Si j’avais le temps, je voyagerais.', 'Dacă aș avea timp, aș călători.']
    ],
    steps: [
      'Ia forma <b>nous</b> de la prezent: <i>nous parlons, nous finissons, nous prenons</i>.',
      'Șterge <b>-ons</b>. Rămâne radicalul: <i>parl-, finiss-, pren-</i>.',
      'Adaugă terminațiile: <b>-ais, -ais, -ait, -ions, -iez, -aient</b> (aceleași la toate verbele).',
      'Singura excepție de radical: <b>être → ét-</b> (<i>j’étais</i>).'
    ],
    endings: {
      head: ['', 'je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'],
      rows: [['Toate verbele', '-ais', '-ais', '-ait', '-ions', '-iez', '-aient']],
      note: 'Aceleași terminații se folosesc și la <b>conditionnel présent</b>, dar acolo radicalul vine de la viitor.'
    },
    signals: ['autrefois', 'avant', 'à cette époque-là', 'quand j’étais petit', 'd’habitude', 'toujours', 'souvent', 'chaque été', 'tous les jours (în trecut)', 'pendant que', 'tandis que'],
    traps: [
      '<b>-ger</b>: <i>je mangeais</i> (cu e), dar <i>nous mangions</i>. <b>-cer</b>: <i>je commençais</i> (cu ç), dar <i>nous commencions</i>.',
      'Verbele în <b>-ier</b> au doi de i la nous/vous: <i>nous étudiions, vous étudiiez</i>.',
      'Radicalul vine de la nous: <i>nous faisons → je faisais</i>, <i>nous prenons → je prenais</i>, <i>nous buvons → je buvais</i>.'
    ],
    models: ['parler', 'finir', 'vendre', 'prendre', 'être', 'avoir', 'aller', 'faire', 'manger', 'commencer']
  },
  {
    id: 'pqp', fr: 'Le plus-que-parfait', ro: 'Mai mult ca perfectul', lvl: 'ess',
    short: 'O acțiune care s-a terminat înaintea altei acțiuni din trecut.',
    formula: [['avoir / être', 'a'], ['la imparfait', 'op'], ['+', 'op'], ['participe passé', 'a']],
    uses: [
      ['Acțiune anterioară unei alte acțiuni din trecut', 'Quand je suis arrivé, le film avait déjà commencé.', 'Când am ajuns, filmul începuse deja.'],
      ['Cauza unui fapt din trecut', 'Il était fatigué parce qu’il n’avait pas dormi.', 'Era obosit pentru că nu dormise.'],
      ['Vorbire indirectă la trecut', 'Elle a dit qu’elle avait fini.', 'A spus că terminase.'],
      ['Condiția irealizabilă în trecut (cu SI)', 'Si j’avais su, je serais venu.', 'Dacă aș fi știut, aș fi venit.']
    ],
    steps: [
      'Alege auxiliarul (<i>avoir</i> sau <i>être</i>) la fel ca la passé composé.',
      'Pune-l la <b>imparfait</b>: <i>j’avais, tu avais… / j’étais, tu étais…</i>',
      'Adaugă <b>participiul trecut</b> și verifică acordul (aceleași reguli ca la passé composé).'
    ],
    signals: ['déjà', 'ne… pas encore', 'auparavant', 'la veille', 'avant que', 'quand', 'parce que'],
    traps: [
      'Îl folosești <b>doar</b> când există o a doua acțiune în trecut la care te raportezi: prima = plus-que-parfait, a doua = passé composé sau imparfait.',
      'Se acordă ca passé composé: <i>elle était partie, les fleurs qu’il avait achetées</i>.'
    ],
    models: ['parler', 'finir', 'prendre', 'aller', 'venir', 'faire', 'se laver']
  },
  {
    id: 'fs', fr: 'Le futur simple', ro: 'Viitorul simplu', lvl: 'ess',
    short: 'Ce se va întâmpla. Se formează de la infinitiv + terminațiile verbului avoir.',
    formula: [['infinitiv', 's'], ['(la -re: fără -e)', 'op'], ['+', 'op'], ['ai, as, a, ons, ez, ont', 'v']],
    uses: [
      ['Viitor', 'Demain, je visiterai le musée.', 'Mâine voi vizita muzeul.'],
      ['Promisiuni și previziuni', 'Il fera beau demain. Tu réussiras !', 'Mâine va fi frumos. Vei reuși!'],
      ['După quand / dès que / aussitôt que, pentru o acțiune viitoare', 'Quand tu arriveras, je préparerai le dîner.', 'Când vei ajunge, voi pregăti cina.'],
      ['SI + prezent → viitor', 'Si tu étudies, tu réussiras.', 'Dacă înveți, vei reuși.']
    ],
    steps: [
      'Pornește de la <b>infinitiv</b>: <i>parler, finir, vendre</i>.',
      'La verbele în <b>-re</b> șterge ultimul <i>e</i>: <i>vendre → vendr-</i>.',
      'Adaugă <b>-ai, -as, -a, -ons, -ez, -ont</b>.',
      'Atenție la verbele cu <b>radical neregulat</b> (tabelul de mai jos). Toate futurele au litera <b>r</b> înaintea terminației.'
    ],
    endings: {
      head: ['', 'je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'],
      rows: [['Toate verbele', '-ai', '-as', '-a', '-ons', '-ez', '-ont']],
      note: null
    },
    irregular: [['être', 'ser-', 'je serai'], ['avoir', 'aur-', 'j’aurai'], ['aller', 'ir-', 'j’irai'], ['faire', 'fer-', 'je ferai'], ['voir', 'verr-', 'je verrai'],
      ['pouvoir', 'pourr-', 'je pourrai'], ['vouloir', 'voudr-', 'je voudrai'], ['savoir', 'saur-', 'je saurai'], ['devoir', 'devr-', 'je devrai'], ['venir', 'viendr-', 'je viendrai'],
      ['tenir', 'tiendr-', 'je tiendrai'], ['envoyer', 'enverr-', 'j’enverrai'], ['courir', 'courr-', 'je courrai'], ['mourir', 'mourr-', 'je mourrai'], ['recevoir', 'recevr-', 'je recevrai']],
    signals: ['demain', 'après-demain', 'bientôt', 'plus tard', 'la semaine prochaine', 'l’année prochaine', 'dans deux jours', 'un jour', 'ce soir', 'dès que', 'quand'],
    traps: [
      'După <b>si</b> nu pui niciodată viitor: <i>Si tu viens, on mangera</i> (nu «si tu viendras»).',
      'Verbele în -er cu schimbări păstrează schimbarea: <i>j’achèterai, j’appellerai, je nettoierai, j’enverrai</i>.',
      'Grupa 1 la viitor <i>nu</i> are radical special: <i>je parlerai</i> (parler + ai). Se aude un «é» închis, spre deosebire de condițional (<i>je parlerais</i>, «è» deschis).'
    ],
    models: ['parler', 'finir', 'vendre', 'prendre', 'être', 'avoir', 'aller', 'faire', 'venir', 'pouvoir', 'voir']
  },
  {
    id: 'fp', fr: 'Le futur proche', ro: 'Viitorul apropiat', lvl: 'ess',
    short: 'Ceva ce urmează să se întâmple curând sau o intenție clară. Echivalentul lui «o să…».',
    formula: [['aller', 'a'], ['la prezent', 'op'], ['+', 'op'], ['infinitiv', 's']],
    uses: [
      ['Ceva ce urmează curând', 'Il va pleuvoir.', 'O să plouă.'],
      ['Intenție sau plan', 'Je vais manger avec mes amis ce soir.', 'O să mănânc cu prietenii mei diseară.']
    ],
    steps: ['Conjugă <b>aller</b> la prezent: <i>je vais, tu vas, il va, nous allons, vous allez, ils vont</i>.', 'Pune <b>infinitivul</b> verbului principal, neschimbat.'],
    signals: ['bientôt', 'tout à l’heure', 'tout de suite', 'dans cinq minutes', 'demain', 'ce soir', 'maintenant (iminent)'],
    traps: [
      'Se conjugă doar <i>aller</i>. Verbul principal rămâne la infinitiv: <i>nous allons manger</i> (nu «nous allons mangeons»).',
      'Negația înconjoară <i>aller</i>: <i>je ne vais pas manger</i>. Cu verbe pronominale: <i>je vais me laver</i>.'
    ],
    models: ['manger', 'finir', 'prendre', 'partir', 'se laver']
  },
  {
    id: 'pr', fr: 'Le passé récent', ro: 'Trecutul recent', lvl: 'ess',
    short: 'O acțiune care tocmai s-a terminat. Echivalentul lui «tocmai am…».',
    formula: [['venir', 'a'], ['la prezent', 'op'], ['+', 'op'], ['de (d’)', 'v'], ['+', 'op'], ['infinitiv', 's']],
    uses: [['Ceva ce s-a terminat chiar acum', 'Je viens de manger.', 'Tocmai am mâncat.'], ['Vești proaspete', 'Elle vient de partir.', 'Tocmai a plecat.']],
    steps: ['Conjugă <b>venir</b> la prezent: <i>je viens, tu viens, il vient, nous venons, vous venez, ils viennent</i>.', 'Adaugă <b>de</b> (sau <b>d’</b> înaintea unei vocale) și <b>infinitivul</b>.'],
    signals: ['à l’instant', 'tout à l’heure', 'il y a un instant', 'à l’instant même'],
    traps: ['<b>de → d’</b> înaintea vocalei: <i>je viens d’arriver</i>, <i>elle vient d’ouvrir</i>.', 'Nu confunda cu <i>venir à</i> sau cu <i>venir</i> + infinitiv de mișcare («vine să»).'],
    models: ['manger', 'finir', 'arriver', 'se laver']
  },
  {
    id: 'cond', fr: 'Le conditionnel présent', ro: 'Condiționalul prezent', lvl: 'ess',
    short: 'Ce s-ar întâmpla: dorințe politicoase, sfaturi, ipoteze. Echivalentul lui «aș…, ai…, ar…».',
    formula: [['radicalul viitorului', 's'], ['+', 'op'], ['ais, ais, ait, ions, iez, aient', 'v']],
    uses: [
      ['Dorință politicoasă', 'Je voudrais un café, s’il vous plaît.', 'Aș vrea o cafea, vă rog.'],
      ['Sfat, sugestie', 'Tu devrais te reposer.', 'Ar trebui să te odihnești.'],
      ['Ipoteză: SI + imparfait → conditionnel', 'Si j’avais le temps, je voyagerais.', 'Dacă aș avea timp, aș călători.'],
      ['Informație neconfirmată', 'Selon la presse, il serait malade.', 'După presă, ar fi bolnav.'],
      ['Viitor văzut din trecut', 'Il a dit qu’il viendrait.', 'A spus că va veni.']
    ],
    steps: ['Ia <b>radicalul de la futur simple</b> (<i>parler-, finir-, vendr-, ir-, ser-, aur-</i>).', 'Adaugă terminațiile <b>imperfectului</b>: <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.'],
    endings: {
      head: ['', 'je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'],
      rows: [['Toate verbele', '-ais', '-ais', '-ait', '-ions', '-iez', '-aient']],
      note: 'Rețeta: <b>radical de viitor + terminații de imperfect</b>. Radicalele neregulate sunt aceleași ca la viitor (ser-, aur-, ir-, fer-, pourr-, voudr-…).'
    },
    signals: ['si + imparfait', 'au cas où', 'à ta place', 'selon (zvon)', 'peut-être'],
    traps: ['<i>je parlerai</i> (viitor) ≠ <i>je parlerais</i> (condițional): diferența e doar un <b>-s</b> la final.', 'După <b>si</b> nu pui niciodată conditionnel: <i>Si j’avais…, je ferais…</i> (nu «si j’aurais»).'],
    models: ['parler', 'finir', 'vendre', 'être', 'avoir', 'aller', 'faire', 'vouloir', 'pouvoir']
  },
  {
    id: 'impe', fr: 'L’impératif', ro: 'Imperativul', lvl: 'ess',
    short: 'Ordine, sfaturi, rugăminți. Are doar trei persoane (tu, nous, vous) și nu are pronume subiect.',
    formula: [['forma de prezent', 's'], ['(tu / nous / vous)', 'op'], ['fără pronume', 'v']],
    uses: [['Ordin sau sfat', 'Mange ta soupe !', 'Mănâncă-ți supa!'], ['Invitație (nous)', 'Allons-y !', 'Hai să mergem!'], ['Interdicție', 'Ne parlez pas !', 'Nu vorbiți!']],
    steps: ['Ia forma de <b>prezent</b> pentru tu, nous, vous.', 'Șterge pronumele subiect.', 'La grupa 1 (și la <i>aller, ouvrir, offrir</i>) șterge <b>-s</b> de la <i>tu</i>: <i>tu parles → parle</i>.'],
    signals: ['s’il te plaît', 's’il vous plaît', 'vite', 'tout de suite'],
    traps: [
      'Patru verbe au forme speciale: <b>être</b> (sois, soyons, soyez), <b>avoir</b> (aie, ayons, ayez), <b>savoir</b> (sache, sachons, sachez), <b>vouloir</b> (veuille, veuillons, veuillez).',
      '<b>Afirmativ</b>: pronumele vin după verb, cu cratimă (<i>lave-toi, mange-le</i>). <b>Negativ</b>: înaintea verbului (<i>ne te lave pas, ne le mange pas</i>).',
      'Există și un impératif passé (<i>aie fini, sois parti</i>), dar apare rar. La test cel mai probabil ți se cere doar impératif présent.'
    ],
    models: ['parler', 'finir', 'prendre', 'être', 'avoir', 'aller', 'faire', 'se laver']
  },
  {
    id: 'condp', fr: 'Le conditionnel passé', ro: 'Condiționalul trecut', lvl: 'bon',
    short: 'Ce s-ar fi întâmplat: regrete, reproșuri, ipoteze imposibil de schimbat.',
    formula: [['avoir / être', 'a'], ['la conditionnel', 'op'], ['+', 'op'], ['participe passé', 'a']],
    uses: [
      ['Regret sau reproș', 'J’aurais dû t’écouter.', 'Ar fi trebuit să te ascult.'],
      ['Ipoteză irealizabilă în trecut: SI + plus-que-parfait → conditionnel passé', 'Si j’avais su, je serais venu.', 'Dacă aș fi știut, aș fi venit.'],
      ['Informație neconfirmată despre trecut', 'Il y aurait eu trois blessés.', 'Ar fi fost trei răniți.']
    ],
    steps: ['Alege auxiliarul (<i>avoir</i> / <i>être</i>).', 'Pune-l la <b>conditionnel présent</b> (<i>j’aurais, tu serais…</i>).', 'Adaugă participiul trecut (cu acordul obișnuit).'],
    signals: ['si + plus-que-parfait', 'j’aurais dû', 'tu aurais pu'],
    traps: ['Trei tipuri de propoziții cu SI (vezi comparația «Propoziții cu SI»). Condițional trecut apare doar după <i>si + plus-que-parfait</i>.'],
    models: ['parler', 'finir', 'aller', 'savoir', 'faire']
  },
  {
    id: 'subj', fr: 'Le subjonctif présent', ro: 'Conjunctivul prezent', lvl: 'bon',
    short: 'Apare după <i>que</i>, în urma unor verbe sau expresii de dorință, necesitate, sentiment, îndoială.',
    formula: [['que', 'v'], ['+', 'op'], ['radicalul lui «ils»', 's'], ['+', 'op'], ['e, es, e, ions, iez, ent', 'v']],
    uses: [
      ['Necesitate', 'Il faut que tu partes.', 'Trebuie să pleci.'],
      ['Dorință, voință', 'Je veux que tu viennes.', 'Vreau să vii.'],
      ['Sentiment', 'Je suis content que tu sois là.', 'Mă bucur că ești aici.'],
      ['Îndoială', 'Je ne pense pas qu’il soit malade.', 'Nu cred că e bolnav.'],
      ['După conjuncții (pour que, avant que, bien que, à condition que, jusqu’à ce que)', 'Bien qu’il soit fatigué, il travaille.', 'Deși e obosit, muncește.']
    ],
    steps: ['Ia forma <b>ils / elles</b> de la prezent: <i>ils parlent, ils finissent, ils prennent</i>.', 'Șterge <b>-ent</b>: <i>parl-, finiss-, prenn-</i>.', 'Adaugă <b>-e, -es, -e, -ent</b> (je, tu, il, ils) și <b>-ions, -iez</b> (nous, vous).'],
    endings: {
      head: ['', 'que je', 'que tu', 'qu’il / elle', 'que nous', 'que vous', 'qu’ils / elles'],
      rows: [['Toate verbele', '-e', '-es', '-e', '-ions', '-iez', '-ent']],
      note: 'Nous și vous sunt la fel ca la imparfait: <i>que nous prenions, que vous preniez</i>.'
    },
    irregular: [['être', 'que je sois', 'nous soyons'], ['avoir', 'que j’aie', 'nous ayons'], ['aller', 'que j’aille', 'nous allions'], ['faire', 'que je fasse', 'nous fassions'],
      ['pouvoir', 'que je puisse', 'nous puissions'], ['savoir', 'que je sache', 'nous sachions'], ['vouloir', 'que je veuille', 'nous voulions']],
    signals: ['il faut que', 'vouloir que', 'souhaiter que', 'avoir peur que', 'douter que', 'pour que', 'avant que', 'bien que', 'à condition que', 'jusqu’à ce que'],
    traps: ['Același subiect → <b>infinitiv</b>: <i>Je veux partir</i> (nu «je veux que je parte»). Subiecte diferite → subjonctif: <i>Je veux que tu partes</i>.', '<i>penser que</i> la afirmativ cere indicativ: <i>Je pense qu’il est malade</i>.'],
    models: ['parler', 'finir', 'prendre', 'être', 'avoir', 'aller', 'faire', 'pouvoir', 'savoir', 'venir']
  },
  {
    id: 'fa', fr: 'Le futur antérieur', ro: 'Viitorul anterior', lvl: 'bon',
    short: 'O acțiune viitoare care va fi terminată înaintea altei acțiuni viitoare.',
    formula: [['avoir / être', 'a'], ['la futur simple', 'op'], ['+', 'op'], ['participe passé', 'a']],
    uses: [['Prima din două acțiuni viitoare', 'Quand j’aurai fini mes devoirs, je sortirai.', 'Când voi fi terminat temele, voi ieși.'], ['Presupunere / acțiune terminată până la un moment viitor', 'Demain à midi, il sera déjà parti.', 'Mâine la prânz va fi plecat deja.']],
    steps: ['Alege auxiliarul.', 'Pune-l la <b>futur simple</b> (<i>j’aurai, tu auras… / je serai, tu seras…</i>).', 'Adaugă participiul trecut (cu acord).'],
    signals: ['quand', 'dès que', 'aussitôt que', 'lorsque', 'après que', 'd’ici demain', 'avant demain'],
    traps: ['După <i>quand / dès que / après que</i>, dacă acțiunea e viitoare și terminată, folosești <b>futur antérieur</b> (nu prezent).'],
    models: ['finir', 'parler', 'arriver', 'prendre']
  },
  {
    id: 'ps', fr: 'Le passé simple', ro: 'Perfectul simplu', lvl: 'bon',
    short: 'Timpul cărților și al istoriei. Îl recunoști și îl transformi în passé composé; nu îl folosești vorbind.',
    formula: [['radical', 's'], ['+', 'op'], ['-ai / -is / -us', 'v']],
    uses: [['Narațiune literară, istorie (mai ales persoana a 3-a)', 'Il entra, regarda autour de lui et sortit.', 'A intrat, s-a uitat în jur și a ieșit.']],
    steps: ['Grupa 1: radical + <b>-ai, -as, -a, -âmes, -âtes, -èrent</b>.', 'Grupa 2 și multe din grupa 3: radical + <b>-is, -is, -it, -îmes, -îtes, -irent</b>.', 'Alte verbe: radical + <b>-us, -us, -ut, -ûmes, -ûtes, -urent</b> (avoir → <i>j’eus</i>, être → <i>je fus</i>, pouvoir, vouloir, savoir…).'],
    endings: {
      head: ['', 'je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
      rows: [['-er (parler)', '-ai', '-as', '-a', '-âmes', '-âtes', '-èrent'], ['-is (finir, vendre, prendre)', '-is', '-is', '-it', '-îmes', '-îtes', '-irent'], ['-us (avoir, pouvoir, vouloir)', '-us', '-us', '-ut', '-ûmes', '-ûtes', '-urent']],
      note: '<i>venir / tenir</i>: <i>je vins, il vint, ils vinrent</i>.'
    },
    signals: ['un jour', 'soudain', 'alors', 'puis', 'ce jour-là'],
    traps: ['Exercițiu tipic: <i>Il parla</i> → <i>Il a parlé</i>; <i>Ils finirent</i> → <i>Ils ont fini</i>; <i>Elle fut</i> → <i>Elle a été</i>.'],
    models: ['parler', 'finir', 'vendre', 'être', 'avoir', 'aller', 'faire', 'prendre']
  }
];
C.TENSE_BY = {}; C.TENSES.forEach(t => { C.TENSE_BY[t.id] = t; });

/* ---------- participii ---------- */
// [pp, infinitiv, română, categorie, auxiliar]
C.PP = [
  ['eu', 'avoir', 'avut', 'u', 'avoir'], ['vu', 'voir', 'văzut', 'u', 'avoir'], ['su', 'savoir', 'știut', 'u', 'avoir'], ['pu', 'pouvoir', 'putut', 'u', 'avoir'],
  ['voulu', 'vouloir', 'vrut', 'u', 'avoir'], ['dû', 'devoir', 'trebuit / datorat', 'u', 'avoir'], ['reçu', 'recevoir', 'primit', 'u', 'avoir'], ['lu', 'lire', 'citit', 'u', 'avoir'],
  ['bu', 'boire', 'băut', 'u', 'avoir'], ['cru', 'croire', 'crezut', 'u', 'avoir'], ['connu', 'connaître', 'cunoscut', 'u', 'avoir'], ['venu', 'venir', 'venit', 'u', 'etre'],
  ['tenu', 'tenir', 'ținut', 'u', 'avoir'], ['vécu', 'vivre', 'trăit', 'u', 'avoir'], ['couru', 'courir', 'alergat', 'u', 'avoir'], ['plu', 'plaire', 'plăcut', 'u', 'avoir'],
  ['dormi', 'dormir', 'dormit', 'i', 'avoir'], ['parti', 'partir', 'plecat', 'i', 'etre'], ['sorti', 'sortir', 'ieșit', 'i', 'both'], ['servi', 'servir', 'servit', 'i', 'avoir'], ['suivi', 'suivre', 'urmat', 'i', 'avoir'],
  ['pris', 'prendre', 'luat', 'is', 'avoir'], ['appris', 'apprendre', 'învățat', 'is', 'avoir'], ['compris', 'comprendre', 'înțeles', 'is', 'avoir'], ['mis', 'mettre', 'pus', 'is', 'avoir'],
  ['promis', 'promettre', 'promis', 'is', 'avoir'], ['permis', 'permettre', 'permis', 'is', 'avoir'], ['assis', 'asseoir', 'așezat', 'is', 'avoir'],
  ['dit', 'dire', 'spus', 'it', 'avoir'], ['écrit', 'écrire', 'scris', 'it', 'avoir'], ['fait', 'faire', 'făcut', 'it', 'avoir'], ['décrit', 'décrire', 'descris', 'it', 'avoir'], ['conduit', 'conduire', 'condus', 'it', 'avoir'], ['traduit', 'traduire', 'tradus', 'it', 'avoir'],
  ['ouvert', 'ouvrir', 'deschis', 'ert', 'avoir'], ['offert', 'offrir', 'oferit', 'ert', 'avoir'], ['couvert', 'couvrir', 'acoperit', 'ert', 'avoir'], ['découvert', 'découvrir', 'descoperit', 'ert', 'avoir'], ['souffert', 'souffrir', 'suferit', 'ert', 'avoir'],
  ['peint', 'peindre', 'pictat', 'int', 'avoir'], ['craint', 'craindre', 'temut', 'int', 'avoir'], ['atteint', 'atteindre', 'atins', 'int', 'avoir'], ['joint', 'joindre', 'alăturat', 'int', 'avoir'],
  ['été', 'être', 'fost', 'sp', 'avoir'], ['né', 'naître', 'născut', 'sp', 'etre'], ['mort', 'mourir', 'murit', 'sp', 'etre']
];
C.PP_CATS = [
  ['u', 'Terminate în -u', 'Cea mai mare familie de participii neregulate.'],
  ['i', 'Terminate în -i (grupa 3 în -ir)', 'La fel ca grupa 2, dar fără -iss-.'],
  ['is', 'Terminate în -is', 'Familiile lui prendre și mettre.'],
  ['it', 'Terminate în -it', 'dire, écrire, faire și derivatele lor.'],
  ['ert', 'Terminate în -ert', 'ouvrir și offrir și familiile lor.'],
  ['int', 'Terminate în -int', 'Verbele în -indre.'],
  ['sp', 'Cazuri speciale', 'Trei participii care nu seamănă cu infinitivul.']
];
C.VDT = [
  ['devenir', 'devenu', 'a deveni'], ['revenir', 'revenu', 'a reveni'], ['monter', 'monté', 'a urca'], ['rester', 'resté', 'a rămâne'],
  ['sortir', 'sorti', 'a ieși'], ['venir', 'venu', 'a veni'], ['aller', 'allé', 'a merge'], ['naître', 'né', 'a se naște'],
  ['descendre', 'descendu', 'a coborî'], ['entrer', 'entré', 'a intra'], ['rentrer', 'rentré', 'a intra / a se întoarce acasă'], ['tomber', 'tombé', 'a cădea'],
  ['retourner', 'retourné', 'a se întoarce'], ['arriver', 'arrivé', 'a ajunge'], ['mourir', 'mort', 'a muri'], ['partir', 'parti', 'a pleca']
];
C.VDT_PAIRS = [
  ['aller', 'venir'], ['arriver', 'partir'], ['entrer', 'sortir'], ['monter', 'descendre'], ['naître', 'mourir'], ['rester', 'tomber'], ['devenir', 'revenir (rentrer, retourner)']
];
C.BOTH = [
  ['monter', 'Elle <b>est</b> montée dans sa chambre.', 'Elle <b>a</b> monté les valises.', 'a urca (singură) / a urca ceva'],
  ['descendre', 'Il <b>est</b> descendu du train.', 'Il <b>a</b> descendu l’escalier.', 'a coborî / a coborî ceva'],
  ['sortir', 'Elle <b>est</b> sortie hier soir.', 'Elle <b>a</b> sorti le chien.', 'a ieși / a scoate ceva'],
  ['rentrer', 'Ils <b>sont</b> rentrés tard.', 'Il <b>a</b> rentré la voiture.', 'a se întoarce acasă / a băga ceva înăuntru'],
  ['retourner', 'Elle <b>est</b> retournée à Paris.', 'Elle <b>a</b> retourné la crêpe.', 'a se întoarce / a întoarce ceva'],
  ['passer', 'Il <b>est</b> passé par Lyon.', 'Il <b>a</b> passé un examen.', 'a trece pe lângă / a da (un examen), a petrece']
];

/* ---------- arbore de decizie pentru acord ---------- */
C.TREE = {
  start: { q: 'Ce auxiliar are verbul tău la passé composé?', hint: 'Uită-te la verbul ajutător. <b>avoir</b>: j’ai, tu as, il a, nous avons, vous avez, ils ont. <b>être</b>: je suis, tu es, il est, nous sommes, vous êtes, ils sont.', opts: [['AVOIR', 'avoir1', 'avoir'], ['ÊTRE', 'etre1', 'être']] },
  avoir1: { q: 'Verbul are un COD?', hint: 'Pune după verb întrebarea <b>«pe cine? / ce?»</b>, fără à sau de. <i>J’ai mangé… ce? → une pomme</i> (COD). <i>Il a dormi… ce?</i> → nu merge, deci nu are COD.', opts: [['Da, are un COD', 'avoir2', 'are COD'], ['Nu are COD (sau are doar COI: à / de)', 'R_nocod', 'fără COD']] },
  avoir2: { q: 'Unde este COD-ul față de verb?', hint: 'După verb: <i>J’ai acheté <b>les fleurs</b></i>. Înaintea verbului: <i>Je <b>les</b> ai achetées</i>, <i>les fleurs <b>que</b> j’ai achetées</i>, <i><b>Quelles fleurs</b> as-tu achetées ?</i>', opts: [['DUPĂ verb (sau nu există nimic înaintea lui)', 'R_after', 'COD după verb'], ['ÎNAINTEA verbului (le, la, l’, les, me, te, nous, vous, que, quel…)', 'avoir3', 'COD înaintea verbului']] },
  avoir3: { q: 'Cuvântul din fața verbului este «en»?', hint: '<i>J’en ai mangé</i>: <b>en</b> nu declanșează acordul.', opts: [['Da, este «en»', 'R_en', 'este «en»'], ['Nu', 'R_cod', 'nu e «en»']] },
  etre1: { q: 'Verbul este pronominal (se laver, s’habiller…)?', hint: 'Are între subiect și auxiliar unul din: <b>me, te, se, nous, vous</b>.', opts: [['Nu (aller, venir, partir, arriver…)', 'R_etre', 'nu e pronominal'], ['Da, este pronominal', 'pron1', 'pronominal']] },
  pron1: { q: 'Este un verb esențial pronominal (nu există fără «se»)?', hint: 'Exemple: <i>se souvenir, s’évanouir, s’enfuir, se moquer, se méfier, s’absenter, se suicider, se repentir</i>.', opts: [['Da', 'R_pron_ess', 'esențial pronominal'], ['Nu, poate exista și fără «se»', 'pron2', 'nu e esențial']] },
  pron2: { q: 'Verbul se construiește cu «à» (adică «se» = COI)?', hint: 'Verbe de felul <i>se parler, se téléphoner, se sourire, se plaire, se nuire, se mentir, se ressembler, se succéder, s’écrire</i>: faci acțiunea «unul altuia» (<i>à qqn</i>).', opts: [['Da, «se» = COI', 'R_pron_coi', 'se = COI'], ['Nu, se construiește direct (se laver, se regarder, se voir…)', 'pron3', 'se construiește direct']] },
  pron3: { q: 'Mai există un COD, diferit de «se»?', hint: 'După verb: <i>Elle s’est lavé <b>les mains</b></i> / <i>Elle s’est acheté <b>une robe</b></i>. Înaintea verbului: <i><b>Les mains qu’</b>elle s’est lavées</i>.', opts: [['Da, un COD DUPĂ verb', 'R_pron_after', 'COD după verb'], ['Da, un COD ÎNAINTEA verbului (que, les…)', 'R_cod', 'COD înainte (que)'], ['Nu, «se» este singurul COD', 'R_pron_cod', 'se = COD']] },
  R_nocod: { res: 'no', t: 'NU se acordă', rule: 'Fără COD (sau doar cu COI), participiul rămâne neschimbat.', ex: ['Elle lui a <b>parlé</b>.', 'Ils ont <b>dormi</b> toute la nuit.', 'Nous avons <b>marché</b> deux heures.'] },
  R_after: { res: 'no', t: 'NU se acordă', rule: 'COD-ul vine după verb, deci participiul rămâne neschimbat.', ex: ['J’ai <b>acheté</b> les fleurs.', 'Elle a <b>écrit</b> une lettre.', 'Ils ont <b>perdu</b> leurs clés.'] },
  R_en: { res: 'no', t: 'NU se acordă', rule: '«en» nu declanșează acordul. Participiul rămâne neschimbat.', ex: ['Des cerises ? J’en ai <b>mangé</b>.', 'Des livres ? Elle en a <b>lu</b> trois.'] },
  R_cod: { res: 'yes', t: 'SE ACORDĂ cu COD-ul', rule: 'Află cine este COD-ul (ce înlocuiește «que», «les», «l’»…). Participiul primește genul și numărul lui: <b>-e</b> (feminin), <b>-s</b> (plural), <b>-es</b> (feminin plural).', ex: ['Les fleurs que j’ai <b>achetées</b>.', 'Marie ? Je l’ai <b>vue</b>.', 'Quelle robe as-tu <b>choisie</b> ?'] },
  R_etre: { res: 'yes', t: 'SE ACORDĂ cu SUBIECTUL', rule: 'Cu <b>être</b>, participiul se comportă ca un adjectiv: ia genul și numărul subiectului.', ex: ['Elle est <b>partie</b>.', 'Ils sont <b>arrivés</b>.', 'Marie et Paul sont <b>venus</b> (grup mixt = masculin).'] },
  R_pron_ess: { res: 'yes', t: 'SE ACORDĂ cu SUBIECTUL', rule: 'La verbele esențial pronominale, «se» nu are funcție de COD sau COI. Participiul se acordă cu subiectul.', ex: ['Elle s’est <b>évanouie</b>.', 'Ils se sont <b>souvenus</b> de la date.'] },
  R_pron_coi: { res: 'no', t: 'NU se acordă', rule: '«se» este COI (faci acțiunea «cuiva»). COI-ul nu declanșează acordul.', ex: ['Elles se sont <b>parlé</b>.', 'Ils se sont <b>téléphoné</b>.', 'Elles se sont <b>souri</b>.'] },
  R_pron_after: { res: 'no', t: 'NU se acordă', rule: 'COD-ul real este după verb, iar «se» este COI («își»). Participiul rămâne neschimbat.', ex: ['Elle s’est <b>lavé</b> les mains.', 'Elle s’est <b>acheté</b> une robe.', 'Elle s’est <b>brossé</b> les dents.'] },
  R_pron_cod: { res: 'yes', t: 'SE ACORDĂ cu SUBIECTUL (= cu «se», care e COD)', rule: '«se» este COD și e înaintea verbului, deci participiul ia genul și numărul lui (la fel cu al subiectului).', ex: ['Elle s’est <b>lavée</b>.', 'Ils se sont <b>vus</b>.', 'Elles se sont <b>regardées</b>.'] }
};
C.REASONS = {
  cod_before: 'Se acordă cu COD-ul (este înaintea verbului)',
  cod_after: 'Nu se acordă: COD-ul este după verb',
  coi: 'Nu se acordă: este COI (à / de), nu COD',
  no_cod: 'Nu se acordă: verbul nu are COD',
  en: 'Nu se acordă: «en» este invariabil',
  etre_subj: 'Se acordă cu subiectul (verb cu être)',
  pron_cod: 'Se acordă cu subiectul («se» este COD)',
  pron_coi: 'Nu se acordă: «se» este COI',
  pron_after: 'Nu se acordă: COD-ul este după verb («se» este COI)',
  pron_ess: 'Se acordă cu subiectul (verb esențial pronominal)'
};

/* ---------- analizor (propoziții cu roluri) ---------- */
C.ANALYZER = [
  { id: 'a1', ro: 'Marie mănâncă un măr.', t: [['Marie', 'S'], ['mange', 'V'], ['une pomme', 'COD']], kind: 'cod' },
  { id: 'a2', ro: 'Paul vorbește cu fratele lui.', t: [['Paul', 'S'], ['parle', 'V'], ['à son frère', 'COI']], kind: 'coi' },
  { id: 'a3', ro: 'Ea îi dă o carte lui Paul.', t: [['Elle', 'S'], ['donne', 'V'], ['un livre', 'COD'], ['à Paul', 'COI']], kind: 'both' },
  { id: 'a4', ro: 'Eu o văd (pe Marie).', t: [['Je', 'S'], ['la', 'COD'], ['vois', 'V']], kind: 'cod', note: 'COD-ul poate fi un pronume așezat <b>înaintea</b> verbului: <i>la</i> înlocuiește <i>Marie</i>.' },
  { id: 'a5', ro: 'Eu îi telefonez (lui Paul).', t: [['Je', 'S'], ['lui', 'COI'], ['téléphone', 'V']], kind: 'coi', note: '<i>lui</i> înlocuiește <i>à Paul</i>. Pronumele COI nu include «à», dar rolul rămâne COI.' },
  { id: 'a6', ro: 'Ei vorbesc despre vacanța lor.', t: [['Ils', 'S'], ['parlent', 'V'], ['de leurs vacances', 'COI']], kind: 'coi', note: 'COI poate fi introdus și de <b>de</b>: <i>parler de qqch</i>.' },
  { id: 'a7', ro: 'Noi ne uităm la film.', t: [['Nous', 'S'], ['regardons', 'V'], ['le film', 'COD']], kind: 'cod', note: 'În română «ne uităm <b>la</b> film», dar în franceză <i>regarder qqch</i> nu are prepoziție: <b>COD</b>.' },
  { id: 'a8', ro: 'El le răspunde (lor).', t: [['Il', 'S'], ['leur', 'COI'], ['répond', 'V']], kind: 'coi', note: '<i>répondre À qqn</i>: <i>leur</i> este COI.' },
  { id: 'p1', ro: 'Am cumpărat florile.', pc: true, t: [['J’', 'S'], ['ai', 'AUX'], ['acheté', 'PP'], ['les fleurs', 'COD']],
    fin: { word: 'acheté', before: false, why: 'COD-ul <i>les fleurs</i> este <b>după</b> verb → participiul <b>nu</b> se acordă.' } },
  { id: 'p2', ro: 'Florile pe care le-am cumpărat sunt frumoase.', pc: true, t: [['Les fleurs', 'ANT'], ['que', 'COD'], ['j’', 'S'], ['ai', 'AUX'], ['achetées', 'PP'], ['sont belles', 'CC']],
    fin: { word: 'achetées', before: true, why: '<i>que</i> este COD (înlocuiește <i>les fleurs</i>, feminin plural) și e <b>înaintea</b> verbului → participiul se acordă: <b>achetées</b>.' } },
  { id: 'p3', ro: 'Marie? Am văzut-o.', pc: true, t: [['Je', 'S'], ['l’', 'COD'], ['ai', 'AUX'], ['vue', 'PP']],
    fin: { word: 'vue', before: true, why: '<i>l’</i> înlocuiește <i>Marie</i> (feminin singular), COD înaintea verbului → <b>vue</b>.' } },
  { id: 'p4', ro: 'Le-am vorbit (lor).', pc: true, t: [['Je', 'S'], ['leur', 'COI'], ['ai', 'AUX'], ['parlé', 'PP']],
    fin: { word: 'parlé', before: false, why: '<i>leur</i> este COI (<i>parler À qqn</i>). COI-ul <b>nu</b> declanșează acordul → <b>parlé</b>.' } },
  { id: 'p5', ro: 'Ea a plecat.', pc: true, t: [['Elle', 'S'], ['est', 'AUX'], ['partie', 'PP']],
    fin: { word: 'partie', etre: true, why: 'Cu <b>être</b> nu cauți COD. Participiul se acordă cu <b>subiectul</b> (<i>elle</i>) → <b>partie</b>.' } },
  { id: 'p6', ro: 'Ea s-a spălat pe mâini.', pc: true, t: [['Elle', 'S'], ['s’', 'COI'], ['est', 'AUX'], ['lavé', 'PP'], ['les mains', 'COD']],
    fin: { word: 'lavé', before: false, why: 'COD-ul este <i>les mains</i>, <b>după</b> verb; <i>s’</i> este COI («își»). → <b>lavé</b>, invariabil.' } }
];

/* ---------- propoziții-model pentru transformări ---------- */
C.TR = [
  { s: 'Nous', i: 3, verb: 'finir', post: 'les devoirs' }, { s: 'Je', i: 0, verb: 'manger', post: 'une pomme' }, { s: 'Tu', i: 1, verb: 'regarder', post: 'un film' },
  { s: 'Elle', i: 2, verb: 'choisir', post: 'une robe rouge' }, { s: 'Ils', i: 5, verb: 'vendre', post: 'leur voiture' }, { s: 'Je', i: 0, verb: 'prendre', post: 'le train' },
  { s: 'Vous', i: 4, verb: 'faire', post: 'vos devoirs' }, { s: 'Elles', i: 5, verb: 'partir', post: 'en vacances', g: 'f', n: 'p' }, { s: 'Il', i: 2, verb: 'arriver', post: 'à la gare', g: 'm' },
  { s: 'Nous', i: 3, verb: 'aller', post: 'au cinéma', g: 'm', n: 'p' }, { s: 'Je', i: 0, verb: 'lire', post: 'un livre' }, { s: 'Tu', i: 1, verb: 'écrire', post: 'une lettre' },
  { s: 'Elle', i: 2, verb: 'voir', post: 'ses amis' }, { s: 'On', i: 2, verb: 'manger', post: 'au restaurant' }, { s: 'Ils', i: 5, verb: 'vouloir', post: 'partir' },
  { s: 'Vous', i: 4, verb: 'pouvoir', post: 'venir' }, { s: 'Je', i: 0, verb: 'devoir', post: 'partir' }, { s: 'Marie', i: 2, verb: 'ouvrir', post: 'la fenêtre' },
  { s: 'Les élèves', i: 5, verb: 'attendre', post: 'le bus' }, { s: 'Nous', i: 3, verb: 'répondre', post: 'au professeur' }, { s: 'Tu', i: 1, verb: 'recevoir', post: 'un cadeau' },
  { s: 'Il', i: 2, verb: 'savoir', post: 'la réponse' }, { s: 'Elle', i: 2, verb: 'mettre', post: 'la table' }, { s: 'Je', i: 0, verb: 'dire', post: 'la vérité' },
  { s: 'Les enfants', i: 5, verb: 'dormir', post: 'dans le salon' }, { s: 'Paul', i: 2, verb: 'sortir', post: 'du cinéma', g: 'm' }, { s: 'Elle', i: 2, verb: 'se lever', post: 'à sept heures', g: 'f' },
  { s: 'Nous', i: 3, verb: 'se coucher', post: 'tard', g: 'f', n: 'p' }, { s: 'Tu', i: 1, verb: 'se promener', post: 'dans le parc', g: 'm' }, { s: 'Les touristes', i: 5, verb: 'visiter', post: 'le musée' },
  { s: 'Vous', i: 4, verb: 'choisir', post: 'un dessert' }, { s: 'Il', i: 2, verb: 'venir', post: 'chez nous', g: 'm' }, { s: 'Elle', i: 2, verb: 'tomber', post: 'dans l’escalier', g: 'f' },
  { s: 'Je', i: 0, verb: 'être', post: 'content', g: 'm' }, { s: 'Nous', i: 3, verb: 'avoir', post: 'un chien' }, { s: 'Je', i: 0, verb: 'acheter', post: 'du pain' },
  { s: 'Tu', i: 1, verb: 'appeler', post: 'ton ami' }, { s: 'Ils', i: 5, verb: 'boire', post: 'du café' }, { s: 'Elle', i: 2, verb: 'connaître', post: 'cette ville' },
  { s: 'Nous', i: 3, verb: 'commencer', post: 'le cours' }, { s: 'Je', i: 0, verb: 'préférer', post: 'le thé' }
];
C.TR_RO = {}; // traduceri pentru sentința la prezent (opțional)
C.TR_PAIRS = [
  [1, 'present', 'pc'], [1, 'present', 'imp'], [1, 'present', 'fs'], [1, 'present', 'fp'],
  [2, 'present', 'pr'], [2, 'present', 'cond'], [2, 'present', 'pqp'], [2, 'pc', 'imp'], [2, 'imp', 'pc'], [2, 'fs', 'pc'], [2, 'fp', 'imp'],
  [3, 'pc', 'pqp'], [3, 'imp', 'fs'], [3, 'fs', 'cond'], [3, 'pc', 'fs'], [3, 'cond', 'pc'], [3, 'pr', 'fp']
];

/* ---------- fill: acord ---------- */
// [text cu ___, răspuns, cod, explicație, nivel]
C.ACORD = [
  ["Les fleurs que j’ai ___ (acheter) sont magnifiques.", 'achetées', 'cod_before', '«que» este COD și înlocuiește <i>les fleurs</i> (feminin plural). Este înaintea verbului → <b>achetées</b>.', 1],
  ["Tu as vu Marie ? Oui, je l’ai ___ (voir) hier.", 'vue', 'cod_before', '<i>l’</i> = Marie (COD, feminin singular), așezat înaintea verbului → <b>vue</b>.', 1],
  ["J’ai ___ (écrire) une lettre à ma grand-mère.", 'écrit', 'cod_after', 'COD-ul <i>une lettre</i> este după verb → invariabil. <i>à ma grand-mère</i> este COI.', 1],
  ["Voici les livres que Paul a ___ (lire).", 'lus', 'cod_before', '«que» = <i>les livres</i> (masculin plural) → <b>lus</b>.', 1],
  ["Quelle robe as-tu ___ (choisir) ?", 'choisie', 'cod_before', '<i>Quelle robe</i> este COD așezat înaintea verbului → <b>choisie</b>.', 2],
  ["Ces chansons, je les ai ___ (écouter) toute la nuit.", 'écoutées', 'cod_before', '<i>les</i> = <i>ces chansons</i> (feminin plural) → <b>écoutées</b>.', 1],
  ["Nous avons ___ (finir) les exercices.", 'fini', 'cod_after', 'COD-ul <i>les exercices</i> vine după verb → invariabil.', 1],
  ["Mes parents ? Je leur ai ___ (téléphoner) hier.", 'téléphoné', 'coi', '<i>leur</i> este COI (<i>téléphoner À qqn</i>). COI-ul nu declanșează acordul → <b>téléphoné</b>.', 1],
  ["Elle lui a ___ (parler) hier.", 'parlé', 'coi', '<i>lui</i> = COI (<i>parler À qqn</i>) → invariabil.', 1],
  ["Les enfants, je les ai ___ (appeler) ce matin.", 'appelés', 'cod_before', '<i>les</i> = <i>les enfants</i> (masculin plural) → <b>appelés</b>.', 1],
  ["Combien de pommes as-tu ___ (manger) ?", 'mangées', 'cod_before', '<i>Combien de pommes</i> este COD înaintea verbului (feminin plural) → <b>mangées</b>.', 2],
  ["Voilà les photos qu’ils ont ___ (prendre).", 'prises', 'cod_before', '«que» = <i>les photos</i> (feminin plural) → <b>prises</b>.', 1],
  ["Des cerises ? J’en ai ___ (manger).", 'mangé', 'en', '<i>en</i> nu declanșează acordul → <b>mangé</b>.', 2],
  ["Les lettres qu’elle m’a ___ (envoyer) sont arrivées.", 'envoyées', 'cod_before', '«que» = <i>les lettres</i> (feminin plural), COD înaintea verbului → <b>envoyées</b>. <i>m’</i> este COI.', 2],
  ["Maria, je t’ai ___ (appeler) hier soir.", 'appelée', 'cod_before', '<i>t’</i> = Maria (COD, feminin singular) → <b>appelée</b>.', 2],
  ["Ils ont ___ (perdre) leurs clés.", 'perdu', 'cod_after', 'COD-ul <i>leurs clés</i> este după verb → invariabil.', 1],
  ["Les clés qu’ils ont ___ (perdre) étaient neuves.", 'perdues', 'cod_before', '«que» = <i>les clés</i> (feminin plural) → <b>perdues</b>.', 1],
  ["Quels livres avez-vous ___ (acheter) ?", 'achetés', 'cod_before', '<i>Quels livres</i> este COD înaintea verbului (masculin plural) → <b>achetés</b>.', 2],
  ["Les amis que j’ai ___ (inviter) sont arrivés.", 'invités', 'cod_before', '«que» = <i>les amis</i> (masculin plural) → <b>invités</b>.', 1],
  ["Elle a ___ (répondre) à toutes mes questions.", 'répondu', 'coi', '<i>répondre À qqch</i>: <i>à toutes mes questions</i> este COI → invariabil.', 2],
  ["Les chemises ? Je les ai ___ (mettre) dans l’armoire.", 'mises', 'cod_before', '<i>les</i> = <i>les chemises</i> (feminin plural) → <b>mises</b> (mis + e + s → <i>mises</i>).', 2],
  ["Ma sœur ? Je ne l’ai pas ___ (voir) depuis longtemps.", 'vue', 'cod_before', '<i>l’</i> = ma sœur (feminin singular). Negația nu schimbă regula → <b>vue</b>.', 2],
  ["Ils m’ont ___ (offrir) un livre.", 'offert', 'cod_after', 'COD-ul <i>un livre</i> este după verb; <i>m’</i> este COI → <b>offert</b>.', 2],
  ["Mesdames, nous vous avons ___ (inviter).", 'invitées', 'cod_before', '<i>vous</i> = Mesdames (COD, feminin plural) → <b>invitées</b>.', 3],
  ["La lettre qu’il a ___ (écrire) est très longue.", 'écrite', 'cod_before', '«que» = <i>la lettre</i> (feminin) → <b>écrite</b>.', 1],
  ["Les devoirs que nous avons ___ (faire) étaient difficiles.", 'faits', 'cod_before', '«que» = <i>les devoirs</i> (masculin plural) → <b>faits</b>.', 1],
  ["Cette histoire, tu l’as ___ (entendre) ?", 'entendue', 'cod_before', '<i>l’</i> = cette histoire (feminin) → <b>entendue</b>.', 2],
  ["Il a ___ (dire) la vérité.", 'dit', 'cod_after', 'COD-ul <i>la vérité</i> este după verb → invariabil.', 1],
  ["La vérité, il l’a ___ (dire) à tout le monde.", 'dite', 'cod_before', '<i>l’</i> = la vérité (feminin) → <b>dite</b>.', 2],
  ["Elle a ___ (ouvrir) la fenêtre.", 'ouvert', 'cod_after', 'COD-ul este după verb → invariabil.', 1],
  ["Les fenêtres, elle les a ___ (ouvrir).", 'ouvertes', 'cod_before', '<i>les</i> = les fenêtres (feminin plural) → <b>ouvertes</b>.', 2],
  ["Ils ont ___ (dormir) toute la nuit.", 'dormi', 'no_cod', '<i>dormir</i> nu are COD (<i>toute la nuit</i> este complement de timp) → invariabil.', 2],
  ["Nous avons ___ (marcher) pendant deux heures.", 'marché', 'no_cod', '<i>marcher</i> nu are COD → invariabil.', 1],
  ["Elle a ___ (sourire) à son voisin.", 'souri', 'coi', '<i>sourire À qqn</i>: COI → invariabil.', 2],
  ["Les cadeaux que mes parents m’ont ___ (donner) sont dans ma chambre.", 'donnés', 'cod_before', '«que» = <i>les cadeaux</i> (masculin plural) → <b>donnés</b>. <i>m’</i> este COI.', 2],
  ["Elle est ___ (partir) à huit heures.", 'partie', 'etre_subj', 'Cu <b>être</b>, participiul se acordă cu subiectul (<i>elle</i>) → <b>partie</b>.', 1],
  ["Mes amies sont ___ (arriver) hier.", 'arrivées', 'etre_subj', 'Subiect: <i>mes amies</i> (feminin plural) → <b>arrivées</b>.', 1],
  ["Ils sont ___ (tomber) dans l’escalier.", 'tombés', 'etre_subj', 'Subiect: <i>ils</i> (masculin plural) → <b>tombés</b>.', 1],
  ["Marie et Paul sont ___ (venir) ensemble.", 'venus', 'etre_subj', 'Un grup mixt (feminin + masculin) → masculin plural: <b>venus</b>.', 2],
  ["Ma sœur est ___ (naître) en 2008.", 'née', 'etre_subj', 'Subiect feminin singular → <b>née</b>.', 1],
  ["Les filles sont ___ (rester) à la maison.", 'restées', 'etre_subj', 'Subiect feminin plural → <b>restées</b>.', 1],
  ["La neige est ___ (tomber) toute la nuit.", 'tombée', 'etre_subj', 'Subiect feminin singular → <b>tombée</b>.', 1],
  ["Mes grands-parents sont ___ (mourir) il y a longtemps.", 'morts', 'etre_subj', 'Subiect masculin plural → <b>morts</b>.', 1],
  ["Elles sont ___ (aller) au cinéma.", 'allées', 'etre_subj', 'Subiect feminin plural → <b>allées</b>.', 1],
  ["Elle est ___ (monter) dans sa chambre.", 'montée', 'etre_subj', '<i>monter</i> fără COD se conjugă cu <b>être</b> → se acordă cu subiectul: <b>montée</b>.', 2],
  ["Elle a ___ (monter) les valises.", 'monté', 'cod_after', '<i>monter</i> cu COD (<i>les valises</i>) se conjugă cu <b>avoir</b>. COD-ul e după verb → invariabil.', 2],
  ["Les valises, elle les a ___ (monter) dans sa chambre.", 'montées', 'cod_before', '<i>les</i> = les valises (feminin plural), COD înaintea verbului → <b>montées</b>.', 3],
  ["Elle a ___ (sortir) le chien.", 'sorti', 'cod_after', '<i>sortir</i> cu COD → <b>avoir</b>; COD după verb → invariabil.', 2],
  ["Elle est ___ (sortir) hier soir.", 'sortie', 'etre_subj', '<i>sortir</i> fără COD → <b>être</b> → cu subiectul: <b>sortie</b>.', 2],
  ["Les enfants sont ___ (rentrer) tard.", 'rentrés', 'etre_subj', 'Subiect masculin plural → <b>rentrés</b>.', 1],
  ["Ils ont ___ (descendre) les poubelles.", 'descendu', 'cod_after', '<i>descendre</i> cu COD → <b>avoir</b>; COD după verb → invariabil.', 2],
  ["Elles sont ___ (descendre) par l’escalier.", 'descendues', 'etre_subj', '<i>descendre</i> fără COD → <b>être</b> → <b>descendues</b>.', 2],
  ["Les poubelles, ils les ont ___ (descendre) ce matin.", 'descendues', 'cod_before', '<i>les</i> = les poubelles (feminin plural) → <b>descendues</b>.', 3],
  ["Elle s’est ___ (laver) ce matin.", 'lavée', 'pron_cod', '<i>se laver</i> = a spăla pe cineva: «se» este COD, înaintea verbului → <b>lavée</b>.', 2],
  ["Elle s’est ___ (laver) les mains.", 'lavé', 'pron_after', 'COD-ul este <i>les mains</i>, după verb; «se» este COI («își») → <b>lavé</b>.', 2],
  ["Les mains qu’elle s’est ___ (laver) étaient sales.", 'lavées', 'cod_before', 'COD-ul <i>que</i> (= les mains) este înaintea verbului → <b>lavées</b>.', 3],
  ["Ils se sont ___ (téléphoner) hier.", 'téléphoné', 'pron_coi', '<i>téléphoner À qqn</i> → «se» este COI → <b>téléphoné</b>.', 2],
  ["Elles se sont ___ (parler) longtemps.", 'parlé', 'pron_coi', '<i>parler À qqn</i> → «se» este COI → <b>parlé</b>.', 2],
  ["Elles se sont ___ (regarder) dans le miroir.", 'regardées', 'pron_cod', '<i>regarder qqn</i> → «se» este COD → <b>regardées</b>.', 2],
  ["Ils se sont ___ (souvenir) de la date.", 'souvenus', 'pron_ess', '<i>se souvenir</i> este esențial pronominal → cu subiectul: <b>souvenus</b>.', 2],
  ["Elles se sont ___ (évanouir).", 'évanouies', 'pron_ess', '<i>s’évanouir</i> este esențial pronominal → cu subiectul: <b>évanouies</b>.', 2],
  ["Ils se sont ___ (sourire).", 'souri', 'pron_coi', '<i>sourire À qqn</i> → «se» este COI → <b>souri</b>.', 2],
  ["Les deux sœurs se sont ___ (écrire) pendant des années.", 'écrit', 'pron_coi', '<i>écrire À qqn</i> → «se» este COI → <b>écrit</b>.', 3],
  ["Elle s’est ___ (acheter) une robe.", 'acheté', 'pron_after', 'COD-ul <i>une robe</i> este după verb; «se» este COI («și-a») → <b>acheté</b>.', 2],
  ["Ils se sont ___ (rencontrer) à Paris.", 'rencontrés', 'pron_cod', '<i>rencontrer qqn</i> → «se» este COD → <b>rencontrés</b>.', 2],
  ["Elle s’est ___ (couper) au doigt.", 'coupée', 'pron_cod', 'Nu există COD după verb (<i>au doigt</i> este un complement circumstanțial) → «se» este COD → <b>coupée</b>.', 3],
  ["Elle s’est ___ (couper) le doigt.", 'coupé', 'pron_after', 'COD-ul <i>le doigt</i> este după verb → <b>coupé</b>.', 3],
  ["Elle s’est ___ (blesser) à la jambe.", 'blessée', 'pron_cod', '«se» este COD (<i>blesser qqn</i>) → <b>blessée</b>.', 3],
  ["Elles se sont ___ (plaire) tout de suite.", 'plu', 'pron_coi', '<i>plaire À qqn</i> → «se» este COI → <b>plu</b>.', 3],
  ["La robe qu’elle s’est ___ (acheter) est rouge.", 'achetée', 'cod_before', 'COD-ul <i>que</i> (= la robe) este înaintea verbului → <b>achetée</b>.', 3],
  ["Ma sœur s’est ___ (lever) tôt.", 'levée', 'pron_cod', '<i>se lever</i>: «se» este COD → <b>levée</b>.', 2],
  ["Mes cousins se sont ___ (coucher) tard.", 'couchés', 'pron_cod', '«se» este COD (masculin plural) → <b>couchés</b>.', 2],
  ["Elle s’est ___ (brosser) les dents.", 'brossé', 'pron_after', 'COD-ul <i>les dents</i> este după verb → <b>brossé</b>.', 2]
];

/* ---------- COD/COI: apăsare pe cuvinte ---------- */
C.TAP = [
  { t: [['Marie', 'S'], ['mange', 'V'], ['une pomme', 'COD']], find: 'COD', why: 'Verb + <i>ce?</i> → <b>une pomme</b>. Fără prepoziție = COD.' },
  { t: [['Nous', 'S'], ['regardons', 'V'], ['le film', 'COD']], find: 'COD', why: '<i>regarder qqch</i> se construiește direct → <b>le film</b> este COD.' },
  { t: [['Tu', 'S'], ['écoutes', 'V'], ['la musique', 'COD']], find: 'COD', why: '<i>écouter qqch</i>, fără prepoziție → COD.' },
  { t: [['Il', 'S'], ['aime', 'V'], ['ses parents', 'COD']], find: 'COD', why: '<i>aimer qqn</i> → <b>ses parents</b> = COD.' },
  { t: [['Elle', 'S'], ['aide', 'V'], ['son frère', 'COD']], find: 'COD', why: '<i>aider qqn</i> → COD (nu «aider à»).' },
  { t: [['Je', 'S'], ['la', 'COD'], ['vois', 'V']], find: 'COD', why: '<i>la</i> este pronume COD așezat înaintea verbului.' },
  { t: [['Paul', 'S'], ['les', 'COD'], ['a invités', 'V']], find: 'COD', why: '<i>les</i> = pronume COD (înlocuiește <i>les amis</i>…).' },
  { t: [['Les fleurs', 'ANT'], ['que', 'COD'], ['j’', 'S'], ['ai achetées', 'V']], find: 'COD', why: '<i>que</i> este COD al lui <i>acheter</i> (înlocuiește <i>les fleurs</i>).' },
  { t: [['Elle', 'S'], ['a offert', 'V'], ['des fleurs', 'COD'], ['à sa mère', 'COI']], find: 'COD', why: 'Verb + <i>ce?</i> → <b>des fleurs</b>. <i>à sa mère</i> este COI.' },
  { t: [['Il', 'S'], ['a dit', 'V'], ['la vérité', 'COD'], ['à son ami', 'COI']], find: 'COD', why: '<i>dire qqch à qqn</i>: <b>la vérité</b> = COD, <i>à son ami</i> = COI.' },
  { t: [['Paul', 'S'], ['parle', 'V'], ['à son frère', 'COI']], find: 'COI', why: '<i>parler À qqn</i> → <b>à son frère</b> = COI.' },
  { t: [['Elle', 'S'], ['téléphone', 'V'], ['à sa mère', 'COI']], find: 'COI', why: '<i>téléphoner À qqn</i> → COI.' },
  { t: [['Les élèves', 'S'], ['répondent', 'V'], ['au professeur', 'COI']], find: 'COI', why: '<i>répondre À qqn</i>; <i>au</i> = <i>à le</i> → COI.' },
  { t: [['Je', 'S'], ['pense', 'V'], ['à mon voyage', 'COI']], find: 'COI', why: '<i>penser À qqch</i> → COI.' },
  { t: [['Ils', 'S'], ['parlent', 'V'], ['de leurs vacances', 'COI']], find: 'COI', why: '<i>parler DE qqch</i> → COI (introdus de <i>de</i>).' },
  { t: [['Je', 'S'], ['lui', 'COI'], ['parle', 'V']], find: 'COI', why: '<i>lui</i> este pronume COI (înlocuiește <i>à Paul</i> / <i>à Marie</i>).' },
  { t: [['Il', 'S'], ['leur', 'COI'], ['obéit', 'V']], find: 'COI', why: '<i>obéir À qqn</i> → <i>leur</i> este COI.' },
  { t: [['Elle', 'S'], ['a écrit', 'V'], ['une lettre', 'COD'], ['à Paul', 'COI']], find: 'COI', why: '<i>écrire qqch À qqn</i>: <b>à Paul</b> = COI.' },
  { t: [['Nous', 'S'], ['avons donné', 'V'], ['un cadeau', 'COD'], ['à Marie', 'COI']], find: 'COI', why: '<i>donner qqch À qqn</i>: <b>à Marie</b> = COI.' },
  { t: [['Marie', 'S'], ['dort', 'V']], find: 'COD', none: true, why: '<i>dormir</i> nu are COD. Nicio întrebare «ce? / pe cine?» nu are răspuns.' },
  { t: [['Il', 'S'], ['va', 'V'], ['à Paris', 'CC']], find: 'COD', none: true, why: '<i>à Paris</i> este complement circumstanțial de loc, nu COD.' },
  { t: [['Elle', 'S'], ['arrive', 'V'], ['demain', 'CC']], find: 'COD', none: true, why: '<i>demain</i> este complement de timp. Fără COD.' },
  { t: [['Nous', 'S'], ['sommes allés', 'V'], ['au cinéma', 'CC']], find: 'COD', none: true, why: '<i>aller</i> nu are COD; <i>au cinéma</i> este complement de loc.' },
  { t: [['Ils', 'S'], ['ont dormi', 'V'], ['toute la nuit', 'CC']], find: 'COD', none: true, why: '<i>toute la nuit</i> răspunde la «cât timp?», deci nu e COD.' },
  { t: [['Marie', 'S'], ['mange', 'V'], ['une pomme', 'COD']], find: 'COI', none: true, why: 'Nu există niciun complement introdus de <i>à</i> / <i>de</i> → fără COI.' },
  { t: [['Je', 'S'], ['la', 'COD'], ['vois', 'V']], find: 'COI', none: true, why: '<i>la</i> este COD. Nu există COI.' }
];

/* ---------- MCQ: alegerea timpului în context ---------- */
C.TIME = [
  { text: 'Quand j’étais petit, je ___ au foot tous les jours.', opts: ['jouais', 'ai joué', 'jouerai', 'jouerais'], ans: 0, why: '«Quand j’étais petit» + obicei repetat în trecut → <b>imparfait</b>.' },
  { text: 'Hier, nous ___ au cinéma.', opts: ['allions', 'sommes allés', 'irons', 'allons'], ans: 1, why: '«Hier» + acțiune terminată → <b>passé composé</b> (aller cu être).' },
  { text: 'Il pleuvait quand, soudain, le téléphone ___.', opts: ['sonnait', 'a sonné', 'sonnera', 'sonnerait'], ans: 1, why: 'Fundal (pleuvait = imparfait) + eveniment brusc, marcat de «soudain» → <b>passé composé</b>.' },
  { text: 'Si j’___ le temps, je voyagerais.', opts: ['aurai', 'aurais', 'avais', 'ai'], ans: 2, why: '<b>SI + imparfait</b> → conditionnel présent. Deci «si j’avais».' },
  { text: 'Si tu étudies, tu ___.', opts: ['réussiras', 'réussirais', 'réussissais', 'as réussi'], ans: 0, why: '<b>SI + prezent</b> → futur simple.' },
  { text: 'Quand je suis arrivé, le film ___ déjà commencé.', opts: ['a', 'avait', 'aura', 'avais'], ans: 1, why: 'Acțiune anterioară unei alte acțiuni din trecut → <b>plus-que-parfait</b> (avait commencé).' },
  { text: 'L’année prochaine, ___ à Paris.', opts: ['je vais', 'je suis allé', 'j’allais', 'j’irai'], ans: 3, why: '«L’année prochaine» → <b>futur simple</b> (aller → ir-): <i>j’irai</i>. <i>je vais</i> ar fi prezent, <i>je suis allé</i> trecut, <i>j’allais</i> imperfect.' },
  { text: 'Je ___ de manger. Je n’ai plus faim.', opts: ['viens', 'vais', 'venais', 'ai'], ans: 0, why: '<b>Passé récent</b>: venir (prezent) + de + infinitiv.' },
  { text: 'Regarde ce ciel, il ___ pleuvoir !', opts: ['viens', 'va', 'vais', 'vient'], ans: 1, why: '<b>Futur proche</b>: aller (prezent) + infinitiv: il va pleuvoir.' },
  { text: 'Si j’avais su, je ___ venu.', opts: ['serais', 'suis', 'étais', 'serai'], ans: 0, why: '<b>SI + plus-que-parfait</b> → conditionnel passé: je serais venu.' },
  { text: 'Autrefois, nous ___ chez mes grands-parents chaque été.', opts: ['allons', 'sommes allés', 'allions', 'irons'], ans: 2, why: '«Autrefois» + «chaque été» → obicei în trecut → <b>imparfait</b>.' },
  { text: 'Je voudrais un café, s’il vous plaît. («voudrais» este la…)', opts: ['futur simple', 'imparfait', 'conditionnel présent', 'subjonctif'], ans: 2, why: 'Dorință politicoasă → <b>conditionnel présent</b>.' },
  { text: 'Il faut que tu ___ à l’heure.', opts: ['viens', 'viennes', 'viendras', 'venais'], ans: 1, why: '<i>Il faut que</i> + <b>subjonctif</b>: que tu viennes.' },
  { text: 'Quand j’___ fini mes devoirs, je sortirai.', opts: ['avais', 'aurai', 'aurais', 'aie'], ans: 1, why: 'Prima din două acțiuni viitoare → <b>futur antérieur</b>: j’aurai fini.' }
];

/* ---------- planuri de studiu ---------- */
C.PLANS = {
  1: [
    { day: 'Tot ce ai la dispoziție', steps: [
      ['baze', 'Bazele: ce sunt COD și COI', 30], ['acord', 'Acordul participiului trecut (arbore + reguli)', 40], ['exercitii', 'Exerciții de acord, seria «Acord cu avoir» și «Acord cu être»', 25],
      ['timpuri', 'Timpurile esențiale (formule + terminații)', 45], ['exercitii2', 'Exerciții de transformare între timpuri', 25], ['test', 'Test simulat, apoi corectează greșelile', 30], ['fisa', 'Citește fișa-rezumat o ultimă dată', 10]
    ] }
  ],
  3: [
    { day: 'Ziua 1: bazele', steps: [['baze', 'Bazele: ce sunt COD și COI', 30], ['grupe', 'Grupele de verbe + être / avoir', 30], ['participiu', 'Participiul trecut: formare și auxiliar', 35], ['exercitii0', 'Cartonașe: participii neregulate', 15]] },
    { day: 'Ziua 2: acord și timpuri', steps: [['acord', 'Acordul participiului trecut', 40], ['exercitii', 'Exerciții de acord (avoir, être, pronominale)', 30], ['timpuri', 'Timpurile esențiale', 50]] },
    { day: 'Ziua 3: antrenament', steps: [['exercitii2', 'Exerciții de transformare între timpuri', 30], ['test', 'Test simulat + greșelile mele', 40], ['fisa', 'Fișa-rezumat', 10]] }
  ],
  7: [
    { day: 'Ziua 1', steps: [['baze', 'Bazele: COD și COI', 35], ['exercitii3', 'Exerciții: găsește COD și COI', 20]] },
    { day: 'Ziua 2', steps: [['grupe', 'Grupele de verbe + être / avoir', 35], ['timpuri', 'Prezent, passé composé, imparfait', 40]] },
    { day: 'Ziua 3', steps: [['participiu', 'Participiul trecut și alegerea auxiliarului', 40], ['exercitii0', 'Cartonașe participii + exerciții de participii', 20]] },
    { day: 'Ziua 4', steps: [['acord', 'Acordul participiului trecut', 45], ['exercitii', 'Exerciții de acord', 30]] },
    { day: 'Ziua 5', steps: [['timpuri', 'Restul timpurilor (plus-que-parfait, viitor, condițional, imperativ)', 50], ['exercitii2', 'Exerciții de transformare', 30]] },
    { day: 'Ziua 6', steps: [['exercitii4', 'Greșelile mele + exerciții mixte', 40], ['conjugator', 'Verbe neregulate în conjugator', 20]] },
    { day: 'Ziua 7', steps: [['test', 'Test simulat', 30], ['fisa', 'Fișa-rezumat', 15]] }
  ]
};

G.C = C;
})(typeof window !== 'undefined' ? window : globalThis);
