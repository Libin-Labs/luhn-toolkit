# @lp-labs/luhn-toolkit

Arbitrary decimal Luhn generation and bounded length-aware batch validation. Catalog identity 425; standalone package version 0.1.0.
No runtime, peer, or sibling dependencies. Node >=18, ESM and CommonJS with declarations.

## Install

```sh
npm install @lp-labs/luhn-toolkit
```

## Quickstart (runnable JavaScript)

```js
import assert from 'node:assert/strict';
import { luhnDigit, appendLuhn, validateLuhn, checkLuhnBatch } from '@lp-labs/luhn-toolkit';
assert.equal(luhnDigit('7992739871'), '3');
assert.equal(appendLuhn('7992739871'), '79927398713');
assert.equal(validateLuhn('79927398713', { minLength: 11, maxLength: 11 }), true);
assert.deepEqual(checkLuhnBatch(['79927398713', '12']), [true, false]);
```

## Customization and errors

Set inclusive minLength/maxLength of complete checked strings (default 2..4096). checkLuhnBatch returns one boolean per input in order and validates options even for an empty batch. Generation requires a nonempty payload of at most 4095 ASCII digits. Invalid generation/non-string values throw TypeError; invalid integer length bounds, oversized complete generation or batches over 10000 throw RangeError. Invalid decimal syntax in validation returns false.

## Complete public declarations

Every runtime export and public type is shown below. This is the complete emitted declaration surface.

```ts
export interface LuhnOptions {
  minLength?: number;
  maxLength?: number;
}
export declare function luhnDigit(payload: string): string;
export declare function appendLuhn(payload: string): string;
export declare function validateLuhn(value: string, options?: LuhnOptions): boolean;
export declare function checkLuhnBatch(
  values: readonly string[],
  options?: LuhnOptions,
): readonly boolean[];
```

## Performance, boundaries and limitations

O(n) per string with constant checksum workspace; batch output O(b), at most 10000 items. Leading zeroes are preserved, separators are not normalized. Pure decimal arithmetic, not card brand detection, account/card authenticity, existence or authorization. Luhn does not catch every transposition (notably 09/90).

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

The offline install requires the locked development dependencies already in the npm cache.
Build emits separate ESM/CJS and declarations; type checks include bare-package .mts/.cts consumers with negative cases.
Runtime tests import only the single-quoted standalone dist entry and also run against installed offline tarballs.
No build artifacts or development dependencies are required at runtime.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
