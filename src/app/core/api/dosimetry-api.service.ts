import { Injectable } from '@angular/core';
import { LoginApi } from './login-api';
import { DmApi } from './dm-api';
import { AppConfigService as AppConfig } from '../services/init/app-config.service';
import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root'
})
export class DosimetryApiService {
/******************Properties******************/
  Login: LoginApi;
  Dm: DmApi;
  /******************Properties******************/

  constructor(private appConfig: AppConfig, private publisherService: PublisherService) {
    this.publisherService.isConfigLoaded$.subscribe(loaded => {
      if (loaded) {
        this.Login = new LoginApi(appConfig);
        this.Dm = new DmApi(appConfig);
      }
    });
  }
}
