import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { ErrorInterceptor } from './error.interceptor';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let messageService: jasmine.SpyObj<MessageService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['warn', 'error']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthorizationTokens']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: HttpHandler, useValue: httpHandlerSpy }
      ]
    });

    interceptor = TestBed.inject(ErrorInterceptor);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    httpHandler = httpHandlerSpy;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should handle successful requests without interference', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: { success: true } });
      
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      expect(httpHandler.handle).toHaveBeenCalledWith(mockRequest);
      expect(messageService.warn).not.toHaveBeenCalled();
      expect(messageService.error).not.toHaveBeenCalled();
    });

    it('should handle 401 unauthorized errors', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new HttpErrorResponse({
        error: { message: 'Unauthorized' },
        status: 401,
        statusText: 'Unauthorized'
      });
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.warn).toHaveBeenCalledWith('Session expired, but staying on page.');
      expect(messageService.error).not.toHaveBeenCalled();
    });

    it('should handle 412 precondition failed errors', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new HttpErrorResponse({
        error: { message: 'Precondition Failed' },
        status: 412,
        statusText: 'Precondition Failed'
      });
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.warn).toHaveBeenCalledWith('Session expired, but staying on page.');
      expect(messageService.error).not.toHaveBeenCalled();
    });

    it('should handle other HTTP errors', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new HttpErrorResponse({
        error: { message: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
      expect(messageService.warn).not.toHaveBeenCalled();
    });

    it('should handle HTTP errors without error body', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error'
      });
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.error).not.toHaveBeenCalled();
      expect(messageService.warn).not.toHaveBeenCalled();
    });

    it('should handle non-HTTP errors', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new Error('Network error');
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.error).not.toHaveBeenCalled();
      expect(messageService.warn).not.toHaveBeenCalled();
    });

    it('should handle 404 not found errors', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockError = new HttpErrorResponse({
        error: { message: 'Not Found' },
        status: 404,
        statusText: 'Not Found'
      });
      
      httpHandler.handle.and.returnValue(throwError(() => mockError));

      interceptor.intercept(mockRequest, httpHandler).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(mockError);
        }
      });

      expect(messageService.error).toHaveBeenCalledWith('Some error occured.');
    });
  });

  describe('openModal', () => {
    it('should configure modal options correctly', () => {
      const mockModalRef = {
        componentInstance: {},
        result: Promise.resolve('closed')
      };
      modalService.open.and.returnValue(mockModalRef as any);

      const result = interceptor['openModal']('Test Title', 'Test Message');

      expect(interceptor.modalOption.backdrop).toBe('static');
      expect(interceptor.modalOption.keyboard).toBe(false);
      expect(interceptor.modalOption.size).toBe('sm');
      expect(modalService.open).toHaveBeenCalled();
      expect(result).toBe(mockModalRef.result);
    });

    it('should set modal component properties', () => {
      const mockModalRef = {
        componentInstance: {},
        result: Promise.resolve('closed')
      };
      modalService.open.and.returnValue(mockModalRef as any);

      interceptor['openModal']('Error Title', 'Error Message');

      expect(mockModalRef.componentInstance['title']).toBe('Error Title');
      expect(mockModalRef.componentInstance['message']).toBe('Error Message');
    });
  });
});