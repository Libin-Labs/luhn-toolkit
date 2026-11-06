import { luhnDigit, appendLuhn, validateLuhn, checkLuhnBatch } from '@lp-labs/luhn-toolkit';
const digit: string = luhnDigit('123');
appendLuhn(digit);
const checks: readonly boolean[] = checkLuhnBatch(['1230']);
validateLuhn('1230', { minLength: 2, maxLength: 4 });
checks.length.toFixed();
// @ts-expect-error no numeric coercion
luhnDigit(123);
// @ts-expect-error batch items must be decimal strings
checkLuhnBatch([123]);
// @ts-expect-error bounds must be numeric
validateLuhn('00', { minLength: '2' });
