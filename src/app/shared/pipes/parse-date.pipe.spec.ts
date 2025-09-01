import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  let pipe: ParseDatePipe;

  beforeEach(() => {
    pipe = new ParseDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  /* it('should parse ISO date string with T separator', () => {
    expect(pipe.transform('2002-05-20T10:00:00.000+0000')).toBe('05/20/2002');
    expect(pipe.transform('2019-02-19T10:00:00.000+0000')).toBe('02/19/2019');
  }); */

  /* it('should parse date string without T separator', () => {
    expect(pipe.transform('2002-05-20')).toBe('05/20/2002');
  }); */

  /* it('should return existing formatted date string', () => {
    expect(pipe.transform('05/20/2002')).toBe('05/20/2002');
  }); */

  /* it('should handle date objects', () => {
    const dateObj = new Date('2002-05-20');
    expect(pipe.transform(dateObj)).toBe('05/20/2002');
  }); */
});
