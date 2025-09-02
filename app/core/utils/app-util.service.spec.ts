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

});
