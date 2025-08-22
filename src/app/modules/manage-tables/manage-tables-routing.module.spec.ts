import { ManageTablesRoutingModule } from './manage-tables-routing.module';

describe('ManageTablesRoutingModule', () => {
  let manageTablesRoutingModule: ManageTablesRoutingModule;

  beforeEach(() => {
    manageTablesRoutingModule = new ManageTablesRoutingModule();
  });

  it('should create an instance', () => {
    expect(manageTablesRoutingModule).toBeTruthy();
  });
});
