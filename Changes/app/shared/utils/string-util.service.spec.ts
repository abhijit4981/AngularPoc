import { TestBed } from '@angular/core/testing';
import { StringUtilService } from './string-util.service';

describe('StringUtilService', () => {
  let service: StringUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('capitalizeFirst', () => {
    it('should capitalize the first letter of a string', () => {
      expect(service.capitalizeFirst('hello')).toBe('Hello');
    });

    it('should return the same string if first letter is already capitalized', () => {
      expect(service.capitalizeFirst('Hello')).toBe('Hello');
    });

    it('should handle single character string', () => {
      expect(service.capitalizeFirst('a')).toBe('A');
    });

    it('should return empty string for empty input', () => {
      expect(service.capitalizeFirst('')).toBe('');
    });

    it('should handle null input', () => {
      expect(service.capitalizeFirst(null as any)).toBeNull();
    });

    it('should handle undefined input', () => {
      expect(service.capitalizeFirst(undefined as any)).toBeUndefined();
    });
  });

  describe('isNullOrEmpty', () => {
    it('should return true for null string', () => {
      expect(service.isNullOrEmpty(null as any)).toBeTruthy();
    });

    it('should return true for undefined string', () => {
      expect(service.isNullOrEmpty(undefined as any)).toBeTruthy();
    });

    it('should return true for empty string', () => {
      expect(service.isNullOrEmpty('')).toBeTruthy();
    });

    it('should return true for whitespace only string', () => {
      expect(service.isNullOrEmpty('   ')).toBeTruthy();
    });

    it('should return false for non-empty string', () => {
      expect(service.isNullOrEmpty('hello')).toBeFalsy();
    });

    it('should return false for string with leading/trailing spaces but content', () => {
      expect(service.isNullOrEmpty(' hello ')).toBeFalsy();
    });
  });

  describe('truncate', () => {
    it('should truncate string longer than specified length', () => {
      expect(service.truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should return original string if shorter than specified length', () => {
      expect(service.truncate('Hi', 5)).toBe('Hi');
    });

    it('should return original string if equal to specified length', () => {
      expect(service.truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle null input', () => {
      expect(service.truncate(null as any, 5)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(service.truncate(undefined as any, 5)).toBe('');
    });

    it('should handle empty string input', () => {
      expect(service.truncate('', 5)).toBe('');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone number correctly', () => {
      expect(service.formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('should format phone number with existing formatting', () => {
      expect(service.formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    });

    it('should format phone number with mixed characters', () => {
      expect(service.formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
    });

    it('should return original string for non-10-digit numbers', () => {
      expect(service.formatPhoneNumber('12345')).toBe('12345');
    });

    it('should return original string for 11-digit numbers', () => {
      expect(service.formatPhoneNumber('12345678901')).toBe('12345678901');
    });

    it('should handle null input', () => {
      expect(service.formatPhoneNumber(null as any)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(service.formatPhoneNumber(undefined as any)).toBe('');
    });

    it('should handle empty string input', () => {
      expect(service.formatPhoneNumber('')).toBe('');
    });
  });
});