import { ManageTablesModule } from './manage-tables.module';

describe('ManageTablesModule', () => {
  let manageTablesModule: ManageTablesModule;

  beforeEach(() => {
    manageTablesModule = new ManageTablesModule();
  });

  it('should create an instance', () => {
    expect(manageTablesModule).toBeTruthy();
  });
});
