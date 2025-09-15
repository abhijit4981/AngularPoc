import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  let pipe: ParseDatePipe;

  beforeEach(() => {
    pipe = new ParseDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should parse ISO date string with T separator', () => {
    expect(pipe.transform('2002-05-20T10:00:00.000+0000')).toBe('05/20/2002');
    expect(pipe.transform('2019-02-19T10:00:00.000+0000')).toBe('02/19/2019');
    expect(pipe.transform('2023-12-31T23:59:59.999Z')).toBe('12/31/2023');
  });

  it('should parse date string without T separator', () => {
    expect(pipe.transform('2002-05-20')).toBe('05/20/2002');
    expect(pipe.transform('2019-02-19')).toBe('02/19/2019');
    expect(pipe.transform('2023-12-31')).toBe('12/31/2023');
  });

  it('should return existing formatted date string', () => {
    expect(pipe.transform('05/20/2002')).toBe('05/20/2002');
    expect(pipe.transform('02/19/2019')).toBe('02/19/2019');
    expect(pipe.transform('12/31/2023')).toBe('12/31/2023');
  });

  it('should handle date objects', () => {
    const dateObj = new Date('2002-05-20');
    expect(pipe.transform(dateObj)).toBe('05/20/2002');
    
    const dateObj2 = new Date('2019-02-19');
    expect(pipe.transform(dateObj2)).toBe('02/19/2019');
  });

  it('should handle empty T separator array case', () => {
    // This tests the edge case where dateArray.length == 0 in the T separator logic  
    const value = 'T';
    expect(pipe.transform(value)).toBe('undefined/undefined/');
  });

  it('should handle null values', () => {
    expect(() => pipe.transform(null)).toThrowError();
  });

  it('should handle undefined values', () => {
    expect(() => pipe.transform(undefined)).toThrowError();
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBeUndefined();
  });

  it('should handle string without separators', () => {
    expect(pipe.transform('20020520')).toBeUndefined();
  });
});
