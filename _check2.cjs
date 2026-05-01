const p = require('@babel/parser');
const fs = require('fs');
const src = fs.readFileSync('src/i18n/translations.js','utf8');
let ast;
try { ast = p.parse(src, { sourceType:'module', plugins:['jsx'] }); console.log('parse OK, bytes:', src.length); }
catch(e) { console.log('PARSE ERROR:', e.message); process.exit(1); }

const decl = ast.program.body.find(n => n.type==='ExportNamedDeclaration' && n.declaration && n.declaration.declarations && n.declaration.declarations[0].id.name==='translations');
const obj = decl.declaration.declarations[0].init;

function flatKeys(node, prefix='') {
  const out = [];
  if (!node || node.type!=='ObjectExpression') return out;
  for (const prop of node.properties) {
    if (prop.type !== 'ObjectProperty') continue;
    const key = prop.key.name || prop.key.value;
    const path = prefix ? `${prefix}.${key}` : key;
    out.push(path);
    if (prop.value.type === 'ObjectExpression') out.push(...flatKeys(prop.value, path));
  }
  return out;
}

const langs = {};
for (const prop of obj.properties) langs[prop.key.name] = prop.value;

function getKeys(lang, root) {
  const r = langs[lang].properties.find(pp => (pp.key.name||pp.key.value)===root);
  return r ? new Set(flatKeys(r.value, root)) : new Set();
}

for (const root of ['nav','education','educationPage']) {
  const tr = getKeys('tr', root);
  const en = getKeys('en', root);
  const ru = getKeys('ru', root);
  const missingTr = [...en].filter(k => !tr.has(k));
  const extraTr = [...tr].filter(k => !en.has(k));
  console.log(`[${root}] tr=${tr.size}  en=${en.size}  ru=${ru.size}  missingTrVsEn=${missingTr.length}  extraTrVsEn=${extraTr.length}`);
  if (missingTr.length) missingTr.forEach(k => console.log('  - missing in tr:', k));
  if (extraTr.length) extraTr.forEach(k => console.log('  + extra in tr:', k));
}
