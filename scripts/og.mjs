// Genera la tarjeta de vista previa (Open Graph) desde los mismos colores y
// tipografías de la página, para que lo que se comparte se parezca al sitio.
//
//   node scripts/og.mjs
//
// Sale en public/og.png a 1200x630, la medida que usan LinkedIn y WhatsApp.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.join(ROOT, 'public', 'og.png');

const tokens = readFileSync(path.join(ROOT, 'src', 'styles', 'tokens.css'), 'utf8');
const token = (name) => tokens.match(new RegExp(`--${name}:\s*([^;]+);`))[1].trim();
const night = token('night');
const cream = token('night-paper');
const red = token('night-red');
const soft = '#a9a294';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Martian+Mono:wght@500&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${night}; color: ${cream}; overflow: hidden; font-family: 'Martian Mono', monospace; }
  .dots { position: absolute; inset: 0; background-image: radial-gradient(${cream}20 1.4px, transparent 1.4px); background-size: 16px 16px; }
  .card { position: relative; height: 100%; padding: 58px 72px; display: flex; flex-direction: column; justify-content: space-between; }
  .line { display: flex; justify-content: space-between; white-space: nowrap; font-size: 21px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${soft}; }
  .foot { font-size: 18px; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: ${soft}; white-space: nowrap; }
  h1 { font: 800 152px/0.9 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; text-transform: uppercase; }
  h1 span { color: ${red}; }
  .rule { height: 5px; background: ${red}; width: 260px; margin: 30px 0 24px; }
  p { font: 400 32px/1.35 'Newsreader', Georgia, serif; color: ${cream}; max-width: 720px; }
</style></head><body>
  <div class="dots"></div>
  <div class="card">
    <div class="line"><span>cesaromana.lat</span><span>Valencia, Venezuela</span></div>
    <div>
      <h1>César<br><span>Omaña</span></h1>
      <div class="rule"></div>
      <p>Computer engineer. Backend first, full stack always, games on the side.</p>
    </div>
    <div class="foot">What I have built · Track record · Games · Your phone is the controller</div>
  </div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
writeFileSync(OUT, await page.screenshot({ type: 'png' }));
await browser.close();
process.stdout.write(`og listo en ${OUT}\n`);
