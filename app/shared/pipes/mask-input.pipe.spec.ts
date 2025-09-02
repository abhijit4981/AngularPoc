import { MaskInputPipe } from './mask-input.pipe';

describe('MaskInputPipe', () => {
  let pipe: MaskInputPipe;

  beforeEach(() => {
    pipe = new MaskInputPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  /* it('should mask numeric values when showMask is true', () => {
    expect(pipe.transform('100000010', true)).toBe('XXXXX0010');
  }); */

  /* it('should not mask when showMask is false', () => {
    expect(pipe.transform('100000010', false)).toBe('100000010');
  }); */

  /* it('should not mask values less than 5 characters', () => {
    expect(pipe.transform('1234', true)).toBe('1234');
  }); */

  /* it('should return value as is for non-numeric strings', () => {
    expect(pipe.transform('abcdefgh', true)).toBe('abcdefgh');
  }); */

  /* it('should handle null or undefined values', () => {
    expect(pipe.transform(null, true)).toBe(null);
    expect(pipe.transform(undefined, true)).toBe(undefined);
  }); */

  /* it('should handle empty string', () => {
    expect(pipe.transform('', true)).toBe('');
  }); */
});
