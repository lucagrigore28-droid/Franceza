# Cahier de français

Site interactiv de pregătire pentru testul de franceză (clasa a 11-a, Unitatea 1): acordul participiului trecut cu COD și COI, timpurile verbale și verbele neregulate. Totul este în limba română, cu exemple franceze traduse.

## Ce conține

- **5 lecții, în ordine:** COD și COI, grupele de verbe, timpurile, participiul trecut, acordul participiului (cu arbore de decizie interactiv).
- **Fișă pentru fiecare timp:** formula, când se folosește, terminații pe grupe, exemple conjugate, verbele neregulate conjugate, cuvinte care dau de gol timpul, capcane, mini-exerciții.
- **Exerciții:** 12 serii (acord, COD/COI, participii, auxiliare, conjugări, transformări între timpuri) cu explicație după fiecare întrebare, „Greșelile mele" și cartonașe pentru participiile neregulate.
- **Test simulat:** 25 de întrebări, 30 de minute, notă estimată.
- **Conjugator:** orice verb (inclusiv pronominal), toate timpurile.
- **Fișă-rezumat** și plan de studiu pentru 1, 3 sau 7 zile.

## Cum îl folosești

`index.html` este un fișier de sine stătător. Îl deschizi direct în browser sau îl publici cu GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root). Fonturile se încarcă de la Google Fonts; fără internet se folosesc fonturile sistemului.

Progresul (lecții bifate, scoruri, greșeli) se salvează în `localStorage`, doar în browserul tău.

## Dezvoltare

Sursele sunt în `src/`; `index.html` se generează din ele.

```bash
node build.mjs          # reconstruiește index.html
node src/test-conjugare.cjs   # testează motorul de conjugare (199 de forme de referință)
```

| Fișier | Rol |
| --- | --- |
| `src/engine.js` | motorul de conjugare (verbe neregulate + reguli pentru grupele 1, 2 și -dre) |
| `src/content.js` | fișele timpurilor, listele de participii, arborele de acord, băncile de exerciții |
| `src/core.js`, `src/ex.js` | utilitare, stare, întrebări, generatoare și runner de exerciții |
| `src/views1.js`, `views2.js`, `views3.js` | paginile site-ului |
| `src/main.js` | schelet, navigare, temă |
| `src/style.css` | stiluri (temă luminoasă și întunecată) |
