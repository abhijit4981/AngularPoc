import { RecordMaintenanceConstant } from './record-maintenance.constants';

describe('RecordMaintenanceConstant', () => {
  it('should have SEARCH_EMPLOYEE_ERROR_MSG defined', () => {
    expect(RecordMaintenanceConstant.SEARCH_EMPLOYEE_ERROR_MSG).toBe('Please select employee from drop down');
  });

  it('should have SEARCH_DATE_ERROR_MSG defined', () => {
    expect(RecordMaintenanceConstant.SEARCH_DATE_ERROR_MSG).toBe('Please enter a valid date');
  });

  it('should have START_END_DATE_ERROR_MSG defined', () => {
    expect(RecordMaintenanceConstant.START_END_DATE_ERROR_MSG).toBe('Start date could not be greater than end date');
  });

  it('should have SEARCH_DOSIMETER_EMPTY_ERROR_MSG defined', () => {
    expect(RecordMaintenanceConstant.SEARCH_DOSIMETER_EMPTY_ERROR_MSG).toBe('Please enter participant number');
  });

  it('should have SEARCH_DOSIMETER_LENGTH_ERROR_MSG defined', () => {
    expect(RecordMaintenanceConstant.SEARCH_DOSIMETER_LENGTH_ERROR_MSG).toBe('Please enter 5 digit participant number');
  });

  it('should have EDR_ROUTE_CONFIRM_DIALOG_TITLE defined', () => {
    expect(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE).toBe('Cancel External Dose Result');
  });

  it('should have UPDATE_ROUTE_CONFIRM_DIALOG_MSG defined', () => {
    expect(RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG).toBe('There are changes that have not been saved. Are you sure you want to exit?');
  });

  it('should have ADD_ROUTE_CONFIRM_DIALOG_MSG defined', () => {
    expect(RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG).toBe('This entry will not be saved. Are you sure you want to exit?');
  });

  it('should have IDR_ROUTE_CONFIRM_DIALOG_TITLE defined', () => {
    expect(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE).toBe('Cancel Internal Dose Result');
  });
});