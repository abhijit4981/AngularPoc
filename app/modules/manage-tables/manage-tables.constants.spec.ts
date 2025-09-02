import { MangeTableConstant } from './manage-tables.constants';

describe('MangeTableConstant', () => {
  it('should have CONFIGURATION_LEFT_LINKS with correct structure', () => {
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS).toBeDefined();
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS.length).toBe(5);
    
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS[0]).toEqual({
      id: 0, title: 'ACCOUNT', name: 'account', hasFilter: false
    });
    
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS[1]).toEqual({
      id: 1, title: 'INTAKE RETENTION FRACTION', name: 'intakeRetention', hasFilter: false
    });
    
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS[2]).toEqual({
      id: 2, title: 'LOCATION', name: 'location', hasFilter: true
    });
    
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS[3]).toEqual({
      id: 3, title: 'PERSON', name: 'person', hasFilter: true
    });
    
    expect(MangeTableConstant.CONFIGURATION_LEFT_LINKS[4]).toEqual({
      id: 4, title: 'RADIONUCLIDE', name: 'radionuclide', hasFilter: false
    });
  });

  it('should have CONFIG_ROUTE_CONFIRM_DIALOG_TITLE defined', () => {
    expect(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE).toBe('Cancel Configuration');
  });

  it('should have UPDATE_ROUTE_CONFIRM_DIALOG_MSG defined', () => {
    expect(MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG).toBe('There are changes that have not been saved. Are you sure you want to exit?');
  });

  it('should have CROSS_REFERENCE_CONFIRM_DIALOG_TITLE defined', () => {
    expect(MangeTableConstant.CROSS_REFERENCE_CONFIRM_DIALOG_TITLE).toBe('Cancel Type Reference');
  });
});