import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringUtilService {

  constructor() { }

  /**
   * Capitalizes the first letter of a string
   */
  capitalizeFirst(str: string): string {
    if (!str || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Checks if a string is null, undefined, or empty
   */
  isNullOrEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Truncates a string to a specified length and adds ellipsis
   */
  truncate(str: string, length: number): string {
    if (!str) {
      return '';
    }
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length) + '...';
  }

  /**
   * Formats a phone number string
   */
  formatPhoneNumber(phone: string): string {
    if (!phone) {
      return '';
    }
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  }
}