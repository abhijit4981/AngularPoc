import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorsHandler } from './errors-handler';
import { MessageService } from '../services/message.service';

describe('ErrorsHandler', () => {
  let errorHandler: ErrorsHandler;
  let injector: jasmine.SpyObj<Injector>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const injectorSpy = jasmine.createSpyObj('Injector', ['get']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        ErrorsHandler,
        { provide: Injector, useValue: injectorSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    errorHandler = TestBed.inject(ErrorsHandler);
    injector = TestBed.inject(Injector) as jasmine.SpyObj<Injector>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    // Setup injector to return messageService when requested
    injector.get.and.returnValue(messageService);
  });

  it('should be created', () => {
    expect(errorHandler).toBeTruthy();
  });

  describe('handleError', () => {
    it('should handle HttpErrorResponse when offline', () => {
      // Mock navigator.onLine to return false
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      const httpError = new HttpErrorResponse({
        error: 'Network Error',
        status: 0,
        statusText: 'Unknown Error'
      });

      errorHandler.handleError(httpError);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('No internet connection.');
    });

    it('should handle HttpErrorResponse when online', () => {
      // Mock navigator.onLine to return true
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      });

      const httpError = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
        statusText: 'Internal Server Error'
      });

      errorHandler.handleError(httpError);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      // When online and HttpErrorResponse, it doesn't show any message based on current implementation
      expect(messageService.error).not.toHaveBeenCalled();
    });

    it('should handle regular Error instances', () => {
      const regularError = new Error('Something went wrong');

      errorHandler.handleError(regularError);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });

    it('should handle TypeError', () => {
      const typeError = new TypeError('Cannot read property');

      errorHandler.handleError(typeError);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });

    it('should handle ReferenceError', () => {
      const referenceError = new ReferenceError('Variable is not defined');

      errorHandler.handleError(referenceError);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });

    it('should inject MessageService correctly', () => {
      const error = new Error('Test error');

      errorHandler.handleError(error);

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(injector.get).toHaveBeenCalledTimes(1);
    });

    it('should handle HttpErrorResponse with different status codes', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      const errors = [
        new HttpErrorResponse({ status: 404, statusText: 'Not Found' }),
        new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }),
        new HttpErrorResponse({ status: 403, statusText: 'Forbidden' }),
        new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' })
      ];

      errors.forEach(error => {
        messageService.error.calls.reset();
        errorHandler.handleError(error);
        expect(messageService.error).toHaveBeenCalledWith('No internet connection.');
      });
    });

    it('should handle null error gracefully', () => {
      expect(() => {
        errorHandler.handleError(null as any);
      }).not.toThrow();

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });

    it('should handle undefined error gracefully', () => {
      expect(() => {
        errorHandler.handleError(undefined as any);
      }).not.toThrow();

      expect(injector.get).toHaveBeenCalledWith(MessageService);
      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });
  });

  describe('integration with Angular ErrorHandler', () => {
    it('should implement ErrorHandler interface', () => {
      expect(errorHandler.handleError).toBeDefined();
      expect(typeof errorHandler.handleError).toBe('function');
    });

    it('should be injectable', () => {
      expect(errorHandler).toBeInstanceOf(ErrorsHandler);
    });
  });
});