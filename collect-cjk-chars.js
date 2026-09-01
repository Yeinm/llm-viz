const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'src', 'llm');
const charSet = new Set();

function add(text) {
  for (const ch of text) {
    if (ch.codePointAt(0) > 0x007e) charSet.add(ch);
  }
}

// 1) 3D 标签文件：整文件扫描（非 ASCII 只出现在字符串字面量中）
const labelFiles = [
  'GptModelLayout.ts',
  'components/SectionLabels.ts',
  'components/ModelCard.ts',
  'walkthrough/WalkthroughTools.ts',
  'components/MovementControls.tsx',
];
for (const f of labelFiles) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) add(fs.readFileSync(p, 'utf8'));
}

// 2) walkthrough 中 c_str / c_blockRef / c_dimRef 的字符串实参（3D 浮标文字）
const walkDir = path.join(ROOT, 'walkthrough');
const callRe = /c_(?:str|blockRef|dimRef)\(\s*(['"`])((?:(?!\1).)*)\1/g;
for (const f of fs.readdirSync(walkDir)) {
  if (!f.endsWith('.tsx') && !f.endsWith('.ts')) continue;
  const src = fs.readFileSync(path.join(walkDir, f), 'utf8');
  let m;
  while ((m = callRe.exec(src)) !== null) {
    add(m[2]);
  }
}

const chars = [...charSet].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
const counts = chars.map(c => c.codePointAt(0).toString(16));
console.log('total unique non-ASCII chars:', chars.length);
console.log('charset: ' + chars.join(''));
fs.writeFileSync(path.join(__dirname, 'cjk-charset.txt'), chars.join(''), 'utf8');
