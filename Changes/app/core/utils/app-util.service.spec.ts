import { TestBed } from '@angular/core/testing';

import { AppUtilService } from './app-util.service';
import { TEST_LOCATION } from './../../modules/test.data';

describe('AppUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppUtilService = TestBed.get(AppUtilService);
    expect(service).toBeTruthy();
  });

  it('check for getBaseUrl', () => {
    const baseUrl = AppUtilService.getBaseUrl();
    expect(baseUrl).toBe('http://localhost:9876');
  });

  it('check for changeDateFormat', () => {
    const changedDate = AppUtilService.changeDateFormat(new Date('2002-05-20T10:00:00.000+0000'));
    expect(changedDate).toBe('05/20/02');
  });

  it('check for changeDateToSaveFormat', () => {
    const changedDateToSave = AppUtilService.changeDateToSaveFormat(new Date('2002-05-20T10:00:00.000+0000'));
    expect(changedDateToSave).toBe('2002-05-20');
  });

  it('check for getValueFromArray', () => {
    const matchedValue = AppUtilService.getValueFromArray(TEST_LOCATION, 1, 'locationId', 'locationName');
    expect(matchedValue).toBe('TOLEDO');
  });

  it('check for changeDateToSaveFormat with null input', () => {
    const changedDateToSave = AppUtilService.changeDateToSaveFormat(null);
    expect(changedDateToSave).toBe(null);
  });

  it('check for createDateObjectForDatepicker with string input', () => {
    const dateObj = AppUtilService.createDateObjectForDatepicker('2022-05-20T10:00:00.000Z');
    expect(dateObj instanceof Date).toBeTruthy();
  });

  it('check for createDateObjectForDatepicker with date input', () => {
    const inputDate = new Date('2022-05-20');
    const dateObj = AppUtilService.createDateObjectForDatepicker(inputDate);
    expect(dateObj instanceof Date).toBeTruthy();
  });

  it('check for getValueFromArray with empty array', () => {
    const matchedValue = AppUtilService.getValueFromArray([], 1, 'locationId', 'locationName');
    expect(matchedValue).toBe('');
  });

  it('check for getValueFromArray with no matching value', () => {
    const matchedValue = AppUtilService.getValueFromArray(TEST_LOCATION, 999, 'locationId', 'locationName');
    expect(matchedValue).toBe('');
  });

  it('check for getValueFromArray with null value', () => {
    const matchedValue = AppUtilService.getValueFromArray(TEST_LOCATION, null, 'locationId', 'locationName');
    expect(matchedValue).toBe('');
  });

});
