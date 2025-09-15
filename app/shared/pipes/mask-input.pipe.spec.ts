import { MaskInputPipe } from './mask-input.pipe';

describe('MaskInputPipe', () => {
  let pipe: MaskInputPipe;

  beforeEach(() => {
    pipe = new MaskInputPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should mask numeric values when showMask is true', () => {
    expect(pipe.transform('100000010', true)).toBe('XXXXX0010');
    expect(pipe.transform('123456789', true)).toBe('XXXXX6789');
    expect(pipe.transform('000001234', true)).toBe('XXXXX1234');
  });

  it('should not mask when showMask is false', () => {
    expect(pipe.transform('100000010', false)).toBe('100000010');
    expect(pipe.transform('123456789', false)).toBe('123456789');
  });

  it('should not mask values less than 5 characters', () => {
    expect(pipe.transform('1234', true)).toBe('1234');
    expect(pipe.transform('123', true)).toBe('123');
    expect(pipe.transform('12', true)).toBe('12');
    expect(pipe.transform('1', true)).toBe('1');
  });

  it('should return value as is for non-numeric strings', () => {
    expect(pipe.transform('abcdefgh', true)).toBe('abcdefgh');
    expect(pipe.transform('abc12def', true)).toBe('abc12def');
    expect(pipe.transform('12345abc', true)).toBe('12345abc');
  });

  it('should handle null or undefined values', () => {
    expect(pipe.transform(null, true)).toBe(null);
    expect(pipe.transform(undefined, true)).toBe(undefined);
  });

  it('should handle empty string', () => {
    expect(pipe.transform('', true)).toBe('');
  });

  it('should handle exactly 5 character numeric strings', () => {
    expect(pipe.transform('12345', true)).toBe('XXXXX');
  });

  it('should work with very long numeric strings', () => {
    expect(pipe.transform('12345678901234567890', true)).toBe('XXXXX678901234567890');
  });

  it('should handle mixed numeric and special characters', () => {
    expect(pipe.transform('12345-6789', true)).toBe('12345-6789');
    expect(pipe.transform('12345 6789', true)).toBe('12345 6789');
  });
});
