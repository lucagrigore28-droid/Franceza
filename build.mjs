// Construiește index.html (pagină completă, de sine stătătoare) din fișierele din src/.
// Rulare: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const r = f => readFileSync(join(root, 'src', f), 'utf8');

const css = r('style.css');
const lib = r('engine.js') + '\n' + r('content.js');
const app = ['core.js', 'ex.js', 'views1.js', 'views2.js', 'views3.js', 'main.js'].map(r).join('\n');
const fonts = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap';

const html = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Cahier de français</title>
<meta name="description" content="Lecții, exerciții și test simulat pentru acordul participiului trecut (COD și COI) și timpurile verbale franceze.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>
html{padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
body{margin:0}
img{max-width:100%}
[hidden]{display:none!important}
${css}
</style>
</head>
<body>
<script>
${lib}
</script>
<script>
(function () {
'use strict';
${app}
})();
</script>
</body>
</html>
`;
// index.html în rădăcină (deschis direct / GitHub Pages) și public/index.html (folderul pe care îl servește Vercel).
writeFileSync(join(root, 'index.html'), html);
mkdirSync(join(root, 'public'), { recursive: true });
writeFileSync(join(root, 'public', 'index.html'), html);
console.log('index.html + public/index.html', (html.length / 1024).toFixed(0) + ' KB');
