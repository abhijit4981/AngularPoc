import { MaskInputPipe } from './mask-input.pipe';

describe('MaskInputPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskInputPipe();
    expect(pipe.transform('100000010', true)).toBe('XXXXX0010');
    expect(pipe.transform('100000010', false)).toBe('100000010');
  });
});
