import './app-prototype';

describe('String Prototypes', () => {
  describe('toPascalCase', () => {
    it('should convert string to pascal case', () => {
      expect('hello world'.toPascalCase()).toBe('Hello World');
      expect('test case'.toPascalCase()).toBe('Test Case');
    });
  });

  describe('toBoolean', () => {
    it('should convert true string to boolean true', () => {
      expect('true'.toBoolean()).toBe(true);
      expect('TRUE'.toBoolean()).toBe(true);
      expect('1'.toBoolean()).toBe(true);
      expect('y'.toBoolean()).toBe(true);
      expect('yes'.toBoolean()).toBe(true);
    });

    it('should convert false/empty string to boolean false', () => {
      expect('false'.toBoolean()).toBe(false);
      expect('0'.toBoolean()).toBe(false);
      expect(''.toBoolean()).toBe(false);
      expect('random'.toBoolean()).toBe(false);
    });
  });

  describe('toNumber', () => {
    it('should convert string to number', () => {
      expect('123'.toNumber()).toBe(123);
      expect('45'.toNumber()).toBe(45);
    });
  });

  describe('encode and decode', () => {
    it('should encode and decode strings', () => {
      const original = 'hello world@#$';
      const encoded = original.encode();
      expect(encoded.decode()).toBe(original.trim());
    });
  });

  describe('equals', () => {
    it('should compare strings with case sensitivity options', () => {
      expect('Hello'.equals('hello', true)).toBe(true);
      expect('Hello'.equals('hello', false)).toBe(false);
      expect('test'.equals('test')).toBe(true);
    });
  });

  describe('String.isNullOrEmpty', () => {
    it('should return true for null/empty values', () => {
      expect(String.isNullOrEmpty(null)).toBe(true);
      expect(String.isNullOrEmpty(undefined)).toBe(true);
      expect(String.isNullOrEmpty('')).toBe(true);
      expect(String.isNullOrEmpty('   ')).toBe(true);
      expect(String.isNullOrEmpty('null')).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(String.isNullOrEmpty('hello')).toBe(false);
      expect(String.isNullOrEmpty('0')).toBe(false);
    });
  });
});

describe('Number Prototypes', () => {
  describe('toBoolean', () => {
    it('should convert number to boolean', () => {
      expect((0).toBoolean()).toBe(false);
      expect((1).toBoolean()).toBe(true);
      expect((5).toBoolean()).toBe(true);
      expect((-1).toBoolean()).toBe(true);
    });
  });

  describe('length', () => {
    it('should return length of number', () => {
      expect((123).length()).toBe(3);
      expect((45).length()).toBe(2);
      expect((0).length()).toBe(1);
    });
  });

  describe('padStart', () => {
    it('should pad number with zeros', () => {
      expect((5).padStart(3, 0)).toBe('005');
      expect((12).padStart(4, 0)).toBe('0012');
    });
  });
});

describe('Array Prototypes', () => {
  describe('empty', () => {
    it('should empty array', () => {
      const arr = [1, 2, 3];
      arr.empty();
      expect(arr.length).toBe(0);
    });
  });

  describe('isEmpty', () => {
    it('should check if array is empty', () => {
      expect([].isEmpty()).toBe(true);
      expect([1].isEmpty()).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove item from array', () => {
      const arr = [1, 2, 3];
      const removed = arr.remove(2);
      expect(arr).toEqual([1, 3]);
      expect(removed).toEqual([2]);
    });

    it('should return null if item not found', () => {
      const arr = [1, 2, 3];
      const result = arr.remove(5);
      expect(result).toBe(null);
    });
  });

  describe('distinct', () => {
    it('should return unique values', () => {
      const arr = [1, 2, 2, 3, 3, 4];
      expect(arr.distinct()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('orderBy', () => {
    it('should sort array by property', () => {
      const arr = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
      const sorted = arr.orderBy('name');
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Bob');
      expect(sorted[2].name).toBe('Charlie');
    });
  });
});

describe('Date Prototypes', () => {
  describe('equals', () => {
    it('should compare dates', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');
      
      expect(date1.equals(date2)).toBe(true);
      expect(date1.equals(date3)).toBe(false);
    });
  });

  describe('format', () => {
    it('should format date', () => {
      const date = new Date('2023-01-01');
      const formatted = date.format();
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });
});