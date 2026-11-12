const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const groups = {
  namingCategories: ['ions', 'ionic', 'molecular', 'acids'],
  trendCategories: ['atomicRadius', 'ionicRadius', 'electronegativity', 'electronAffinity', 'ionizationEnergy', 'successiveIE'],
  solubilityCategories: ['solAlways', 'solHalides', 'solSulfates', 'solCarbonates', 'solHydroxides', 'solSulfides']
};
const nodes = new Map();
function element(id) {
  if (!nodes.has(id)) nodes.set(id, {
    value: id === 'direction' ? 'both' : id.replace(/^check-/, ''), checked: true,
    textContent: '', innerHTML: '', style: {}, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, addEventListener() {}, focus() {},
    querySelectorAll(selector) {
      return (groups[id] || []).map(key => element(`check-${key}`)).filter(box => !selector.includes(':checked') || box.checked);
    },
    querySelector() { return this.querySelectorAll('input')[0]; }
  });
  return nodes.get(id);
}
const storage = new Map();
const sandbox = vm.createContext({
  document: { getElementById: element, querySelector: () => element('submit'), querySelectorAll: () => [], addEventListener() {} },
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  setTimeout() {}, assert
});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], sandbox);
vm.runInContext(`
setDeck('solubility');
const all = candidates();
assert.equal(all.length, 99);
assert.equal(new Set(all.map(q => q.id)).size, 99);
assert.equal(all.filter(q => q.exception).length, 42);
const find = formula => all.find(q => q.prompt === formula);
// Regression checks against the supplied chart, particularly changes from the prior deck.
for (const formula of ['HgCl₂', 'HgBr₂', 'HgI₂', 'Hg₂Cl₂', 'Hg₂SO₄', 'HgSO₄', 'Sr(OH)₂', 'CaS', 'SrS', 'BaS']) {
  assert.equal(find(formula).classification, 'insoluble', formula);
  assert.ok(isCorrect(find(formula), 'n'), formula);
  assert.ok(!isCorrect(find(formula), 'y'), formula);
}
for (const formula of ['CaSO₄', 'Ag₂SO₄', 'Ca(OH)₂']) {
  assert.equal(find(formula).classification, 'slightly soluble', formula);
  assert.ok(find(formula).exception);
  assert.equal(find(formula).display, 'No — slightly soluble');
  assert.ok(isCorrect(find(formula), 'n'));
  assert.ok(isCorrect(find(formula), 'slightly soluble'));
}
for (const formula of ['Na₂CO₃', 'K₃PO₄', '(NH₄)₂S', 'Ba(OH)₂', 'LiOH', 'Cs₂S']) {
  assert.ok(find(formula).exception, formula);
  assert.ok(isCorrect(find(formula), 'y'), formula);
}
for (const formula of ['AgNO₃', 'Pb(ClO₄)₂', 'Ba(ClO₃)₂', 'Pb(C₂H₃O₂)₂']) {
  assert.ok(isCorrect(find(formula), 'y'), formula);
  assert.ok(!find(formula).exception, formula);
}
assert.ok(!find('CuBr'), 'Do not add an exception absent from the assigned chart');
for (const q of all) {
  const soluble = q.classification === 'soluble';
  assert.ok(isCorrect(q, soluble ? ' Y ' : ' N '), q.prompt);
  assert.ok(!isCorrect(q, soluble ? 'n' : 'y'), q.prompt);
}
for (let run = 0; run < 50; run++) {
  buildQueue();
  assert.equal(state.queue.length, 200);
  assert.equal(new Set(state.queue.map(q => q.id)).size, 99);
  assert.equal(state.queue.filter(q => q.exception).length, 120);
  for (let i = 0; i < 200; i += 10) assert.equal(state.queue.slice(i, i + 10).filter(q => q.exception).length, 6);
}
// Every nonempty category combination must terminate and preserve the selected families.
const boxes = categoryContainer().querySelectorAll('input');
for (let mask = 1; mask < 64; mask++) {
  boxes.forEach((box, i) => box.checked = Boolean(mask & (1 << i)));
  buildQueue();
  const pool = candidates();
  const hasExceptions = pool.some(q => q.exception), hasStandard = pool.some(q => !q.exception);
  assert.equal(state.queue.length, 200);
  assert.equal(state.queue.filter(q => q.exception).length, hasExceptions ? (hasStandard ? 120 : 200) : 0);
  assert.ok(state.queue.every(q => selectedCategories().includes(q.category)));
}
boxes.forEach(box => box.checked = false);
buildQueue();
assert.equal(selectedCategories().length, 1);
$('answerInput').value = 'maybe';
checkAnswer({ preventDefault() {} });
assert.equal(state.attempted, 0);
$('answerInput').value = current().answers[0];
checkAnswer({ preventDefault() {} });
assert.equal(state.correct, 1);
assert.ok($('feedback').innerHTML.includes(current().explanation));
setMode('flash');
assert.equal($('flashExplanation').textContent, current().explanation);
setDeck('naming');
assert.ok(candidates().some(q => q.prompt === 'bisulfate ion'));
setDeck('trends');
assert.equal(state.queue.length, 200);
assert.ok(candidates().every(q => q.direction === 'concept'));
`, sandbox);
console.log('PASS: chart classifications, 99 compounds, 60/40 weighting, 6/10 blocks, all 63 category combinations, y/n, flashcards, and existing decks.');
