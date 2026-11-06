import test from 'node:test';
import assert from 'node:assert/strict';
import { luhnDigit, appendLuhn, validateLuhn, checkLuhnBatch } from '../dist/esm/index.js';
const oracle = (text) =>
  [...text].reduce((sum, c, i) => {
    const n = Number(c) * ((text.length - i) % 2 === 0 ? 2 : 1);
    return sum + Math.floor(n / 10) + (n % 10);
  }, 0) %
    10 ===
  0;
test('published decimal vector', () => {
  assert.equal(luhnDigit('7992739871'), '3');
  assert.equal(appendLuhn('7992739871'), '79927398713');
  assert.equal(validateLuhn('79927398713'), true);
});
test('independent left parity oracle for varied lengths', () => {
  for (let n = 1; n < 80; n++) {
    const payload = Array.from({ length: n }, (_, i) => String((n + i * 7) % 10)).join('');
    const valid = Array.from({ length: 10 }, (_, i) => payload + i).filter(oracle);
    assert.deepEqual(valid, [appendLuhn(payload)]);
  }
});
test('leading zero and bounds', () => {
  assert.equal(appendLuhn('000'), '0000');
  assert.equal(validateLuhn('0'), false);
  assert.equal(validateLuhn('00'), true);
  assert.equal(validateLuhn('0000', { minLength: 5 }), false);
  assert.equal(appendLuhn('0'.repeat(4095)).length, 4096);
  assert.throws(() => appendLuhn('0'.repeat(4096)), RangeError);
});
test('every one-digit substitution on a sample', () => {
  const value = appendLuhn('1234567890');
  for (let i = 0; i < value.length; i++)
    for (let d = 0; d < 10; d++)
      if (String(d) !== value[i])
        assert.equal(validateLuhn(value.slice(0, i) + d + value.slice(i + 1)), false);
});
test('batch outputs preserve order and caller ownership', () => {
  const input = ['79927398713', '12', '00'];
  assert.deepEqual(checkLuhnBatch(input), [true, false, true]);
  assert.deepEqual(input, ['79927398713', '12', '00']);
  assert.deepEqual(checkLuhnBatch([]), []);
});
test('malformed controls types and limits', () => {
  assert.throws(() => checkLuhnBatch(Array(1)), TypeError);
  assert.throws(() => validateLuhn('00', Object.create({ minLength: 2 })), TypeError);
  for (const s of ['', '12\n', '１２', '1 2', '-2']) {
    assert.throws(() => luhnDigit(s), TypeError);
    assert.equal(validateLuhn(s), false);
  }
  assert.throws(() => validateLuhn(null), TypeError);
  assert.throws(() => checkLuhnBatch([], { minLength: 1 }), RangeError);
  assert.throws(() => checkLuhnBatch(Array(10001)), RangeError);
  assert.throws(() => validateLuhn('00', { maxLength: NaN }), RangeError);
});
