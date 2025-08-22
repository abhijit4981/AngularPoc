import { AppConfigService as AppConfig, Configuration } from '../services/init/app-config.service';

export class BaseApi {
  /***************Properties***************/
  endpoint: string;
  /***************Properties***************/

  /***************Constructor***************/
  constructor(private config: AppConfig, private endPointKey: Configuration) {
    this.endpoint = this.config.get(endPointKey);
  }
  /***************Constructor***************/

  /***************Methods***************/

  reset(object: any) {
    for (const property in object) {
      if (object.hasOwnProperty(property) && typeof object[property] === 'string' && property.endsWith('_URL')) {
        object[property] = this.endpoint + object[property];
      }
    }
  }

  /***************Methods***************/
}
