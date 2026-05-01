const p = require('@babel/parser');
const fs = require('fs');
const src = fs.readFileSync('src/i18n/translations.js','utf8');
const ast = p.parse(src, { sourceType:'module', plugins:['jsx'] });

// translations export
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
    if (prop.value.type === 'ObjectExpression') {
      out.push(...flatKeys(prop.value, path));
    } else if (prop.value.type === 'ArrayExpression') {
      // array; just record length
      out.push(`${path}[len=${prop.value.elements.length}]`);
    }
  }
  return out;
}

const langs = {};
for (const prop of obj.properties) {
  langs[prop.key.name] = prop.value;
}

for (const lang of ['tr','en','ru']) {
  // find educationPage
  const ep = langs[lang].properties.find(pp => (pp.key.name||pp.key.value)==='educationPage');
  if (!ep) {
    console.log(lang+': MISSING educationPage');
    continue;
  }
  const keys = flatKeys(ep.value, 'educationPage');
  console.log(`--- ${lang}: ${keys.length} keys ---`);
}

// Now compare en vs tr
function getKeys(lang) {
  const ep = langs[lang].properties.find(pp => (pp.key.name||pp.key.value)==='educationPage');
  return new Set(flatKeys(ep.value, 'educationPage'));
}
const enK = getKeys('en');
const trK = getKeys('tr');
const ruK = getKeys('ru');

const missingInTr = [...enK].filter(k => !trK.has(k));
const extraInTr = [...trK].filter(k => !enK.has(k));
console.log('Missing in TR vs EN:', missingInTr.length);
missingInTr.slice(0,30).forEach(k => console.log('  -', k));
console.log('Extra in TR vs EN:', extraInTr.length);
extraInTr.slice(0,30).forEach(k => console.log('  +', k));
