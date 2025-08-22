import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ParseDatePipe();
    expect(pipe.transform('2002-05-20T10:00:00.000+0000')).toBe('05/20/2002');
    expect(pipe.transform('2019-02-19T10:00:00.000+0000')).toBe('02/19/2019');
  });
});
