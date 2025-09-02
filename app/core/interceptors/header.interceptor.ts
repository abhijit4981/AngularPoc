import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpHeaders, HttpResponse
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import '../utils/app-prototype';

@Injectable()

export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //Clone the request to add new header
        const cloneRequest = request.clone({
            setHeaders: this.getHttpRequestHeaders(request.headers)
        });
        // Pass on the cloned request instead of the original request.
        return next.handle(cloneRequest).pipe(
            tap(
                (event: HttpEvent<any>) => {},
                (error: any) => {}
            )
        );
    }

    private getHttpRequestHeaders(headers: HttpHeaders) {
        const httpRequestHeaders = {};
        httpRequestHeaders['Content-Type'] = 'application/json';
        httpRequestHeaders['Accept'] = 'application/json';
        httpRequestHeaders['Access-Control-Allow-Origin'] = '*';
        
        const tokens = this.authService.getAuthorizationTokens();
        if (tokens['access-token']) {
            httpRequestHeaders['access-token'] = tokens['access-token'];
        }
        if (headers.keys().length > 0) {
            headers.keys().forEach(key => {
                httpRequestHeaders[key] = headers.get(key);
            });
        }
        return httpRequestHeaders;
    }
}