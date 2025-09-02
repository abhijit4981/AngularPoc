import { RecordMaintenanceRoutingModule } from './record-maintenance-routing.module';

describe('RecordMaintenanceRoutingModule', () => {
  let recordMaintenanceRoutingModule: RecordMaintenanceRoutingModule;

  beforeEach(() => {
    recordMaintenanceRoutingModule = new RecordMaintenanceRoutingModule();
  });

  it('should create an instance', () => {
    expect(recordMaintenanceRoutingModule).toBeTruthy();
  });
});
