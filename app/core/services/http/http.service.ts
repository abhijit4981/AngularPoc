import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly METHOD_TYPE = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
  };

  constructor(private http: HttpClient) { }

  /*********************Service Methods*********************/

  get<T>(url: string, @Optional() options?) {
    return this.invokeService<T>(this.METHOD_TYPE.GET, url, options);
  }

  post<T>(url: string, body: any, options?: any | {}) {
    options = !options ? {} : options;
    options.body = body;
    return this.invokeService<T>(this.METHOD_TYPE.POST, url, options);
  }

  put<T>(url: string, body: any, @Optional() options?) {
    options = !options ? {} : options;
    options.body = body;
    return this.invokeService<T>(this.METHOD_TYPE.PUT, url, options);
  }

  delete<T>(url: string, @Optional() options?) {
    return this.invokeService<T>(this.METHOD_TYPE.DELETE, url, options);
  }

  /*********************Service Methods*********************/

  /*********************Private Methods*********************/

  private invokeService<T>(method: string, url: string, options?: any | {}) {
    return this.http
      .request<T>(method, url, options)
      .pipe(tap(response => response), catchError(this.handleError(url, [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const errorReposne = error.error || {
        hasError: true,
        status: error.status,
        statusText: error.statusText
      };

      return of(error.error || (errorReposne as T));
    };
  }

  /*********************Private Methods*********************/
}
