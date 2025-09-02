import { DashboardConstant } from './dashboard.constants';

describe('DashboardConstant', () => {
  it('should have PARTICIPANT_REJECTION_CONFIRM_DIALOG_TITLE defined', () => {
    expect(DashboardConstant.PARTICIPANT_REJECTION_CONFIRM_DIALOG_TITLE).toBe('Cancel Participant Rejection');
  });

  it('should have EDR_REJECTION_CONFIRM_DIALOG_TITLE defined', () => {
    expect(DashboardConstant.EDR_REJECTION_CONFIRM_DIALOG_TITLE).toBe('Cancel Ext. Dose Record Rejection');
  });

  it('should have PERSONNEL_REJECTION_CONFIRM_DIALOG_TITLE defined', () => {
    expect(DashboardConstant.PERSONNEL_REJECTION_CONFIRM_DIALOG_TITLE).toBe('Cancel Personnel Rejection');
  });

  it('should have REJECTION_CONFIRM_DIALOG_MSG defined', () => {
    expect(DashboardConstant.REJECTION_CONFIRM_DIALOG_MSG).toBe('There are changes that have not been saved. Are you sure you want to exit');
  });

  it('should have START_END_DATE_ERROR_MSG defined', () => {
    expect(DashboardConstant.START_END_DATE_ERROR_MSG).toBe('End date could not be lesser than start date');
  });
});