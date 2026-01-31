const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

const repo = path.resolve(__dirname, '..');
const workspace = path.resolve(repo, '..', '..', '..'); // /home/jimmy/clawd

const sources = [
  '2026-01-31-survive-api-pricing-whiplash.md',
  '2026-01-31-cpi-to-portfolio-practical-map.md',
  '2026-01-31-latency-is-a-feature-100ms-experience.md',
  '2026-01-31-world-is-rewiring-not-splitting.md',
].map(f => path.join(workspace, f)).filter(f => fs.existsSync(f));

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

function parseFrontmatter(md) {
  if (!md.startsWith('---')) return { fm: {}, body: md };
  const end = md.indexOf('\n---', 3);
  if (end === -1) return { fm: {}, body: md };
  const fmText = md.slice(3, end).trim();
  const body = md.slice(end + 4).replace(/^\s+/, '');
  // minimal YAML parsing for title/categories
  const fm = {};
  for (const line of fmText.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!m) continue;
    fm[m[1]] = m[2].trim();
  }
  return { fm, body };
}

function pickCategory(fm) {
  const raw = fm.categories || '';
  const m = raw.match(/\[\s*([^,\]]+)/); // first element
  if (m) return m[1].replace(/['\"]/g,'').trim();
  return raw.replace(/['\"]/g,'').trim() || 'Tech';
}

function pickTitle(fm) {
  const raw = fm.title || '';
  return raw.replace(/^['\"]|['\"]$/g,'').trim();
}

function splitByHeadings(body) {
  // Expect some English section heading and some Chinese section heading
  const idxEn = body.search(/^##\s+(English|Part\s*1\s*—\s*English)/m);
  const idxZh = body.search(/^##\s+(Part\s*2\s*—\s*中文|.*中文)/m);
  if (idxEn === -1 || idxZh === -1) {
    // Fallback: split by first CJK line (some drafts don't label sections)
    const lines = body.split(/\r?\n/);
    let splitAt = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/[\u4e00-\u9fff]/.test(lines[i])) { splitAt = i; break; }
    }
    if (splitAt === -1) throw new Error('Cannot find Chinese section');
    const enBody = lines.slice(0, splitAt).join('\n').trim();
    const zhBody = lines.slice(splitAt).join('\n').trim();
    return { enBody, zhBody };
  }
  const en = body.slice(idxEn).trim();
  const zh = body.slice(idxZh).trim();
  // Remove the other section from each
  const enClean = en.split(/^##\s+(Part\s*2\s*—\s*中文|.*中文).*$/m)[0].trim();
  const zhClean = zh.replace(/^##\s+(Part\s*2\s*—\s*中文.*|.*中文.*)\n?/m,'').trim();
  // Also remove leading English heading for en
  const enBody = enClean.replace(/^##\s+(English|Part\s*1\s*—\s*English.*)\n?/m,'').trim();
  return { enBody, zhBody: zhClean };
}

function normalizeFrontmatter({ title, category, lang }) {
  const date = '2026-01-31 12:00:00';
  return [
    '---',
    'layout: post',
    `title: "${title.replace(/\"/g,'\\"')}"`,
    `date: ${date}`,
    `categories: ${category}`,
    `tags: ${category}`,
    'author: Tommy',
    `lang: ${lang}`,
    '---',
    '',
  ].join('\n');
}

function trimChinese(body, target=2500, hardMax=2600) {
  const chars = [...body];
  if (chars.length <= hardMax) return body;
  // Try trimming before References block
  const refIdx = body.search(/^\*\*References\*\*\s*:/m);
  let main = body;
  let refs = '';
  if (refIdx !== -1) {
    main = body.slice(0, refIdx).trim();
    refs = body.slice(refIdx).trim();
  }
  // Remove paragraphs from the end until under hardMax
  let parts = main.split(/\n\n+/);
  while (parts.join('\n\n').length > hardMax && parts.length > 3) {
    parts.pop();
  }
  let out = parts.join('\n\n').trim();
  if (refs) out += '\n\n---\n\n' + refs.replace(/^\*\*References\*\*\s*:/m,'**References:**');
  return out;
}

function ensureHeroLine(body, expectedLine) {
  const lines = body.split(/\r?\n/);
  // If first non-empty line is already an image, keep; else insert
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && lines[i].trim().startsWith('![')) return body;
  return `${expectedLine}\n\n${body}`;
}

function main() {
  const outEnDir = path.join(repo, '_posts', 'en');
  const outZhDir = path.join(repo, '_posts', 'zh');
  fs.mkdirSync(outEnDir, { recursive: true });
  fs.mkdirSync(outZhDir, { recursive: true });

  for (const src of sources) {
    const filename = path.basename(src);
    const md = fs.readFileSync(src, 'utf8');
    const { fm, body } = parseFrontmatter(md);
    const category = pickCategory(fm);
    const titleEn = pickTitle(fm);

    const { enBody, zhBody } = splitByHeadings(body);

    const heroLineMatch = body.match(/^!\[[^\]]*\]\([^\)]+\)/m);
    const heroLine = heroLineMatch ? heroLineMatch[0].trim() : '';
    if (!heroLine) throw new Error(`Missing hero image line in ${filename}`);

    const outEn = normalizeFrontmatter({ title: titleEn, category, lang: 'en' }) + heroLine + '\n\n' + enBody.trim() + '\n';

    const zhTrad = converter(zhBody);
    const titleZh = converter(titleEn); // not perfect but better than nothing
    let outZhBody = zhTrad.trim();
    // Standardize References header
    outZhBody = outZhBody.replace(/^\*\*References\*\*\s*:/m,'**References:**');
    outZhBody = trimChinese(outZhBody);
    outZhBody = ensureHeroLine(outZhBody, heroLine);

    const outZh = normalizeFrontmatter({ title: titleZh, category, lang: 'zh' }) + outZhBody + '\n';

    fs.writeFileSync(path.join(outEnDir, filename), outEn, 'utf8');
    fs.writeFileSync(path.join(outZhDir, filename), outZh, 'utf8');

    // Remove source file to avoid stray cache
    fs.unlinkSync(src);
  }
}

main();
