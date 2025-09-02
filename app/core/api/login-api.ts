import { Injectable } from '@angular/core';
import { AppConfigService as AppConfig, Configuration } from '../services/init/app-config.service';
import { LoginApiConstant } from '../constants/dosimetry-api.constant';
import { BaseApi } from './base-api';

@Injectable()
export class LoginApi extends BaseApi {
  /******************Properties******************/
  readonly REDIRECT_TO_LOGIN_URL: string = LoginApiConstant.REDIRECT_TO_LOGIN;
  /******************Properties******************/

  /***************Constructor***************/
  constructor(config: AppConfig) {
    super(config, Configuration.LOGIN_API_ENDPOINT);
    this.reset(this);
  }
  /***************Constructor***************/
}
