import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from '../http/http.service';

import { PublisherService } from '../publisher.service';
import { Config } from '../../../shared/models/app-config';
import { AppEnv } from '../../constants/app.constant';
import { AppUtilService } from '../../utils/app-util.service';
import { environment } from '../../../../environments/environment';

export enum Configuration {
  API_KEY = 'apiKey',
  DM_API_ENDPOINT = 'dmApiEndPoint',
  LOGIN_API_ENDPOINT = 'loginApiEndPoint',
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  /*********************Properties*********************/
  private config: Config = null;
  private configBaseUrl = 
    environment.name === AppEnv.Local
      ? environment.getConfigBaseUrl
      : AppUtilService.getBaseUrl();
  
  /*********************Properties*********************/

  /*********************Constructor*********************/
  constructor(private http: HttpService) {}
  /*********************Constructor*********************/

  /*********************Service Methods*********************/

  get(key: Configuration): string {
    return this.config ? this.config[key] : '';
  }

  load() {
    
    return new Promise((resolve, reject) => {
      console.log('Loading application configuration...');
      
      this.http
        .post(this.configBaseUrl + '/config', null)
        .pipe(
          timeout(5000), // 5 second timeout
          catchError(error => {
            console.warn('Failed to load config from backend, using defaults:', error.message);
            // Return default configuration
            return of({
              apiKey: 'dev-api-key',
              apiUrl: 'http://localhost:3000/api',
              appLoginUrl: 'http://localhost:4200/login'
            });
          })
        )
        .subscribe({
          next: (response: any) => {
            this.config = {
              apiKey: response.apiKey,
              dmApiEndPoint: response.apiUrl,
              loginApiEndPoint: response.appLoginUrl,
            };
            PublisherService.notifyConfig(true);
            console.log('Configuration loaded successfully:', this.config);
            resolve(true);
          },
          error: (error) => {
            console.error('Critical error loading config:', error);
            // Even on error, resolve with defaults to allow app to start
            this.config = {
              apiKey: 'dev-api-key',
              dmApiEndPoint: 'http://localhost:3000/api',
              loginApiEndPoint: 'http://localhost:4200/login',
            };
            PublisherService.notifyConfig(true);
            resolve(true);
          }
        });
    });
  }

  /*********************Service Methods*********************/
}
