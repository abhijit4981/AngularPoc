import { RecordMaintenanceModule } from './record-maintenance.module';

describe('RecordMaintenanceModule', () => {
  let recordMaintenanceModule: RecordMaintenanceModule;

  beforeEach(() => {
    recordMaintenanceModule = new RecordMaintenanceModule();
  });

  it('should create an instance', () => {
    expect(recordMaintenanceModule).toBeTruthy();
  });
});
