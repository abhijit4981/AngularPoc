import { AppConfigService } from './app-config.service';
import { InitFactory } from './app-init.factory';

describe('InitFactory', () => {
  let configService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    configService = jasmine.createSpyObj('AppConfigService', ['load']);
  });

  it('should return a function', () => {
    const factoryFn = InitFactory(configService);
    expect(typeof factoryFn).toBe('function');
  });

  it('should call configService.load when the returned function is executed', () => {
    const factoryFn = InitFactory(configService);
    factoryFn(); // invoke returned function
    expect(configService.load).toHaveBeenCalled();
  });
});
