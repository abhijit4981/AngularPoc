import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpService } from './http.service';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;
  const mockUrl = '/test-url';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService]
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call GET method and return mock response', () => {
  const mockResponse = { data: 'test' };

  service.get<{ data: string }>(mockUrl).subscribe(res => {
    expect((res as any).body).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(mockUrl);
  req.flush({ body: mockResponse });

  });


  it('should call POST method', () => {
    const mockResponse = { success: true };
    const body = { name: 'John' };

    service.post(mockUrl, body).subscribe(res => {
      expect((res as any).body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('should call PUT method', () => {
    const mockResponse = { updated: true };
    const body = { id: 1 };

    service.put(mockUrl, body).subscribe(res => {
      expect((res as any).body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('should call DELETE method', () => {
    const mockResponse = { deleted: true };

    service.delete(mockUrl).subscribe(res => {
      expect((res as any).body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should handle error in GET request', () => {
    const mockError = { status: 500, statusText: 'Server Error', error: { message: 'fail' } };

    service.get(mockUrl).subscribe(res => {
      expect((res as any).body).toEqual(mockError.error);
    });

    const req = httpMock.expectOne(mockUrl);
    req.flush(mockError.error, { status: 500, statusText: 'Server Error' });
  });

  it('should return provided error.error if available', () => {
  const mockErrorBody = { customError: 'Something went wrong' };

  service.get<{ data: string }>(mockUrl).subscribe(res => {
    expect((res as any).body).toEqual(mockErrorBody);
  });

  const req = httpMock.expectOne(mockUrl);

  // Simulate backend returning a custom error body
  req.flush(mockErrorBody, { status: 400, statusText: 'Bad Request' });
  });
});
