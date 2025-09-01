import { Injectable } from '@angular/core';
import {
  AppConfigService as AppConfig,
  Configuration
} from '../services/init/app-config.service';
import { DmApiConstant } from '../constants/dosimetry-api.constant';
import { BaseApi } from './base-api';

@Injectable()
export class DmApi extends BaseApi {
  /******************Properties******************/
  readonly GET_ALL_LOCATIONS_URL: string = DmApiConstant.GET_ALL_LOCATIONS;
  readonly GET_ALL_TYPEREFS_URL: string = DmApiConstant.GET_ALL_TYPEREFS;
  readonly GET_ALL_NUCLIDES_URL: string = DmApiConstant.GET_ALL_NUCLIDES;
  readonly GET_ALL_TYPEGROUPS_URL: string = DmApiConstant.GET_ALL_TYPEGROUPS;
  readonly SAVE_TYPEGROUP_REF_URL: string = DmApiConstant.SAVE_TYPEGROUP_REF;
  readonly GET_ALL_EMPLOYEES_URL: string = DmApiConstant.GET_ALL_EMPLOYEES;
  readonly GET_ALL_EXTERNAL_DOSIMETER_URL: string = DmApiConstant.GET_ALL_EXTERNAL_DOSIMETER;
  readonly SAVE_EXTERNAL_DOSE_RESULT_URL: string = DmApiConstant.SAVE_EXTERNAL_DOSE_RESULT;
  readonly GET_ALL_INTERNAL_DOSIMETER_URL: string = DmApiConstant.GET_ALL_INTERNAL_DOSIMETER;
  readonly SAVE_INTERNAL_DOSE_RESULT_URL: string = DmApiConstant.SAVE_INTERNAL_DOSE_RESULT;
  readonly GET_ALL_DOSIMETER_BY_PARTICIPANTID_URL: string = DmApiConstant.GET_ALL_DOSIMETER_BY_PARTICIPANTID;
  readonly GET_ALL_DASHBOARD_COUNT_URL: string = DmApiConstant.GET_ALL_DASHBOARD_COUNT;
  readonly GET_REJECT_PARTICIPANT_RECORDLIST_URL: string = DmApiConstant.GET_REJECT_PARTICIPANT_RECORDLIST;
  readonly GET_REJECT_EDR_RECORDLIST_URL: string = DmApiConstant.GET_REJECT_EDR_RECORDLIST;
  readonly GET_REJECT_PERSONNEL_RECORDLIST_URL: string = DmApiConstant.GET_REJECT_PERSONNEL_RECORDLIST;
  readonly GET_LOGGED_USER_DETAILS_URL: string = DmApiConstant.GET_LOGGED_USER_DETAILS;
  readonly GET_PARTICIPANT_REJECTION_DETAILS_URL: string = DmApiConstant.GET_PARTICIPANT_REJECTION_DETAILS;
  readonly SAVE_PARTICIPANT_REJECTION_DETAILS_URL: string = DmApiConstant.GET_PARTICIPANT_REJECTION_DETAILS;
  readonly GET_EDR_REJECTION_DETAILS_URL: string = DmApiConstant.GET_EDR_REJECTION_DETAILS;
  readonly SAVE_EDR_REJECTION_DETAILS_URL: string = DmApiConstant.GET_EDR_REJECTION_DETAILS;
  readonly GET_ALL_ACCOUNTS_URL: string = DmApiConstant.GET_ALL_ACCOUNTS;
  readonly GET_ALL_INTAKE_RETENTION_URL: string = DmApiConstant.GET_ALL_INTAKE_RETENTION;
  readonly GET_PERSON_DETAIL_URL: string = DmApiConstant.GET_PERSON_DETAILS;
  readonly GET_PERSON_DETAIL_BY_ID_URL: string = DmApiConstant.GET_PERSON_DETAILS_BY_ID;
  readonly SAVE_ALL_ACCOUNTS_URL: string = DmApiConstant.SAVE_ALL_ACCOUNTS;
  readonly SAVE_ALL_INTAKE_RETENTION_URL: string = DmApiConstant.SAVE_ALL_INTAKE_RETENTION;
  readonly SAVE_ALL_NUCLIDES_URL: string = DmApiConstant.SAVE_ALL_NUCLIDES;
  readonly SAVE_ALL_LOCATIONS_URL: string = DmApiConstant.SAVE_ALL_LOCATIONS;
  readonly SAVE_PERSON_DETAIL_URL: string = DmApiConstant.SAVE_PERSON_DETAILS;
  readonly GET_FLAG_PERSONNEL_DETAILS_URL: string = DmApiConstant.GET_FLAG_PERSONNEL_DETAILS;
  readonly SAVE_FLAG_PERSONNEL_DETAILS_URL: string = DmApiConstant.SAVE_FLAG_PERSONNEL_DETAILS;
  readonly GET_EDR_PROCESS_URL: string = DmApiConstant.GET_EDR_PROCESS;
  readonly GET_PARTICIPANT_PROCESS_URL: string = DmApiConstant.GET_PARTICIPANT_PROCESS;
  readonly GET_JOB_PROCESS_URL: string = DmApiConstant.GET_JOB_PROCESS;
  
  /******************Properties******************/

  /***************Constructor***************/
  constructor(config: AppConfig) {
    super(config, Configuration.DM_API_ENDPOINT);
    this.reset(this);
  }
  /***************Constructor***************/
}
