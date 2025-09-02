import { BaseApi } from './base-api';
import { AppConfigService, Configuration } from '../services/init/app-config.service';

describe('BaseApi', () => {
  let baseApi: BaseApi;
  let mockAppConfig: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    mockAppConfig = jasmine.createSpyObj('AppConfigService', ['get']);
    mockAppConfig.get.and.returnValue('https://api.example.com');
    
    baseApi = new BaseApi(mockAppConfig, Configuration.LOGIN_API_ENDPOINT);
  });

  it('should create', () => {
    expect(baseApi).toBeTruthy();
  });

  it('should initialize endpoint from config service', () => {
    expect(baseApi.endpoint).toBe('https://api.example.com');
    expect(mockAppConfig.get).toHaveBeenCalledWith(Configuration.LOGIN_API_ENDPOINT);
  });

  describe('reset method', () => {
    it('should prepend endpoint to URL properties', () => {
      const testObject = {
        GET_USER_URL: '/users',
        POST_LOGIN_URL: '/auth/login',
        DELETE_SESSION_URL: '/auth/logout'
      };

      baseApi.reset(testObject);

      expect(testObject.GET_USER_URL).toBe('https://api.example.com/users');
      expect(testObject.POST_LOGIN_URL).toBe('https://api.example.com/auth/login');
      expect(testObject.DELETE_SESSION_URL).toBe('https://api.example.com/auth/logout');
    });

    it('should not modify non-URL string properties', () => {
      const testObject = {
        USER_NAME: 'john.doe',
        API_KEY: 'secret123',
        GET_USER_URL: '/users'
      };

      baseApi.reset(testObject);

      expect(testObject.USER_NAME).toBe('john.doe');
      expect(testObject.API_KEY).toBe('secret123');
      expect(testObject.GET_USER_URL).toBe('https://api.example.com/users');
    });

    it('should not modify non-string properties', () => {
      const testObject = {
        TIMEOUT: 5000,
        IS_ENABLED: true,
        CONFIG: { debug: true },
        GET_DATA_URL: '/data'
      };

      baseApi.reset(testObject);

      expect(testObject.TIMEOUT).toBe(5000);
      expect(testObject.IS_ENABLED).toBe(true);
      expect(testObject.CONFIG).toEqual({ debug: true });
      expect(testObject.GET_DATA_URL).toBe('https://api.example.com/data');
    });

    it('should handle properties that do not belong to object', () => {
      const testObject = Object.create({ INHERITED_URL: '/inherited' });
      testObject.OWN_URL = '/own';

      spyOn(testObject, 'hasOwnProperty').and.callFake((prop) => {
        return prop === 'OWN_URL';
      });

      baseApi.reset(testObject);

      expect(testObject.OWN_URL).toBe('https://api.example.com/own');
    });

    it('should handle empty object', () => {
      const testObject = {};

      expect(() => {
        baseApi.reset(testObject);
      }).not.toThrow();

      expect(Object.keys(testObject)).toEqual([]);
    });

    it('should handle object with mixed property types', () => {
      const testObject = {
        NORMAL_PROPERTY: 'value',
        NUMBER_PROPERTY: 42,
        BOOLEAN_PROPERTY: false,
        NULL_PROPERTY: null,
        UNDEFINED_PROPERTY: undefined,
        ARRAY_PROPERTY: ['item1', 'item2'],
        FETCH_URL: '/fetch',
        UPDATE_URL: '/update'
      };

      baseApi.reset(testObject);

      expect(testObject.NORMAL_PROPERTY).toBe('value');
      expect(testObject.NUMBER_PROPERTY).toBe(42);
      expect(testObject.BOOLEAN_PROPERTY).toBe(false);
      expect(testObject.NULL_PROPERTY).toBeNull();
      expect(testObject.UNDEFINED_PROPERTY).toBeUndefined();
      expect(testObject.ARRAY_PROPERTY).toEqual(['item1', 'item2']);
      expect(testObject.FETCH_URL).toBe('https://api.example.com/fetch');
      expect(testObject.UPDATE_URL).toBe('https://api.example.com/update');
    });

    it('should work with different endpoints', () => {
      // Create new instance with different config
      mockAppConfig.get.and.returnValue('https://different-api.com');
      const differentBaseApi = new BaseApi(mockAppConfig, Configuration.DM_API_ENDPOINT);

      const testObject = {
        SAVE_URL: '/save',
        LOAD_URL: '/load'
      };

      differentBaseApi.reset(testObject);

      expect(testObject.SAVE_URL).toBe('https://different-api.com/save');
      expect(testObject.LOAD_URL).toBe('https://different-api.com/load');
    });

    it('should handle URLs that already contain endpoint', () => {
      const testObject = {
        COMPLETE_URL: 'https://api.example.com/already-complete',
        PARTIAL_URL: '/partial'
      };

      baseApi.reset(testObject);

      // It will still prepend, which might not be desired behavior but tests current implementation
      expect(testObject.COMPLETE_URL).toBe('https://api.example.com' + 'https://api.example.com/already-complete');
      expect(testObject.PARTIAL_URL).toBe('https://api.example.com/partial');
    });
  });

  describe('constructor with different configurations', () => {
    it('should work with different configuration keys', () => {
      mockAppConfig.get.and.returnValue('https://dosimetry-api.com');
      
      const dosimetryApi = new BaseApi(mockAppConfig, Configuration.DM_API_ENDPOINT);

      expect(dosimetryApi.endpoint).toBe('https://dosimetry-api.com');
      expect(mockAppConfig.get).toHaveBeenCalledWith(Configuration.DM_API_ENDPOINT);
    });
  });
});