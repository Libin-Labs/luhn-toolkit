export interface LuhnOptions {
  minLength?: number;
  maxLength?: number;
}
function digits(value: unknown, minimum: number): asserts value is string {
  if (
    typeof value !== 'string' ||
    value.length < minimum ||
    value.length > 4096 ||
    /[^0-9]/.test(value)
  )
    throw new TypeError('Expected a bounded ASCII decimal string.');
}
function residue(value: string, doubleRight: boolean): number {
  let sum = 0,
    double = doubleRight;
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = Number(value[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10;
}
export function luhnDigit(payload: string): string {
  digits(payload, 1);
  if (payload.length === 4096) throw new RangeError('Complete value must fit 4096 digits.');
  return String((10 - residue(payload, true)) % 10);
}
export function appendLuhn(payload: string): string {
  return payload + luhnDigit(payload);
}
export function validateLuhn(value: string, options: LuhnOptions = {}): boolean {
  if (
    !options ||
    typeof options !== 'object' ||
    ![null, Object.prototype].includes(Object.getPrototypeOf(options))
  )
    throw new TypeError('Length options must be a plain record.');
  for (const key of Reflect.ownKeys(options)) {
    const descriptor = Object.getOwnPropertyDescriptor(options, key)!;
    if (typeof key !== 'string' || !descriptor.enumerable || !('value' in descriptor))
      throw new TypeError('Options must be own data properties.');
  }
  if (
    !options ||
    typeof options !== 'object' ||
    Array.isArray(options) ||
    Object.keys(options).some((k) => !['minLength', 'maxLength'].includes(k))
  )
    throw new TypeError('Invalid length options.');
  const min = options.minLength ?? 2,
    max = options.maxLength ?? 4096;
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 2 || max > 4096 || min > max)
    throw new RangeError('Lengths must be ordered in 2..4096.');
  if (typeof value !== 'string') throw new TypeError('Value must be a string.');
  return (
    value.length >= min &&
    value.length <= max &&
    !/[^0-9]/.test(value) &&
    residue(value, false) === 0
  );
}
export function checkLuhnBatch(
  values: readonly string[],
  options: LuhnOptions = {},
): readonly boolean[] {
  if (!Array.isArray(values) || values.length > 10000)
    throw new RangeError('At most 10000 values.');
  // Validate options even for an empty batch.
  validateLuhn('', options);
  return Array.from(values).map((value) => validateLuhn(value, options));
}
