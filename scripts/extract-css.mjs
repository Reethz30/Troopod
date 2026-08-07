import fs from 'fs';
import path from 'path';

const root = path.resolve('F:/Projects/Troopod');
const html = fs.readFileSync(path.join(root, 'purelane-homepage.html'), 'utf8');
const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);

/**
 * Prefix top-level selectors with `.purelane` while preserving @media/@keyframes.
 * Handles nested braces correctly.
 */
function scopeCss(css, scope = '.purelane') {
  let out = '';
  let i = 0;
  const len = css.length;

  function skipWsComment() {
    while (i < len) {
      if (/\s/.test(css[i])) {
        out += css[i++];
        continue;
      }
      if (css[i] === '/' && css[i + 1] === '*') {
        const end = css.indexOf('*/', i + 2);
        out += css.slice(i, end + 2);
        i = end + 2;
        continue;
      }
      break;
    }
  }

  function readBlock() {
    // css[i] must be '{'
    let depth = 0;
    const start = i;
    for (; i < len; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    return css.slice(start, i);
  }

  while (i < len) {
    skipWsComment();
    if (i >= len) break;

    if (css[i] === '@') {
      const headerEnd = css.indexOf('{', i);
      if (headerEnd === -1) {
        out += css.slice(i);
        break;
      }
      const header = css.slice(i, headerEnd).trim();
      i = headerEnd;
      const block = readBlock(); // includes braces
      if (header.startsWith('@keyframes') || header.startsWith('@font-face')) {
        out += header + block;
      } else if (header.startsWith('@media') || header.startsWith('@supports')) {
        const inner = block.slice(1, -1);
        out += header + '{' + scopeCss(inner, scope) + '}';
      } else {
        out += header + block;
      }
      continue;
    }

    // selector list until {
    const brace = css.indexOf('{', i);
    if (brace === -1) {
      out += css.slice(i);
      break;
    }
    const selectorRaw = css.slice(i, brace);
    i = brace;
    const block = readBlock();

    const selectors = selectorRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((sel) => {
        if (sel === ':root' || sel === 'html' || sel === 'body' || sel === '*') {
          return scope;
        }
        if (sel.startsWith(':focus-visible')) {
          return `${scope} ${sel}`;
        }
        if (sel.startsWith(scope)) return sel;
        return `${scope} ${sel}`;
      });

    out += selectors.join(',\n') + block;
  }

  return out;
}

const combined = `${styles[0]}\n\n/* ==== V2 LIGHT BRAND OVERRIDE (final visual) ==== */\n\n${styles[1]}`;

// Drop prototype-only chrome we are not shipping in the five-section cut
// (nav/ticker/footer/sticky still harmless if unused; keep for bonus fidelity)

const banner = `/* Purelane — scoped for Dawn. Visual source: purelane-homepage.html (V2 light). */\n`;
const fonts = `/* Fonts loaded from layout when purelane homepage is active */\n`;
const scoped = banner + fonts + scopeCss(combined);

const outPath = path.join(root, 'theme/assets/purelane.css');
fs.writeFileSync(outPath, scoped);
console.log('Wrote', outPath, scoped.length);

// Sanity checks
const bad = scoped.match(/\.purelane\s+@media/g);
const mediaCount = (scoped.match(/@media/g) || []).length;
const scopedHero = (scoped.match(/\.purelane\s+\.hero\{/g) || []).length;
console.log({ bad: bad && bad.length, mediaCount, scopedHero });
