export const Regex = {
  AlphaNumericOnly: /^[a-zA-Z0-9 ]*$/,
  Password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/,
  Email: /.{1,}@.{1,}\..{1,}/,
  Phone: /[0-9]{10}/,
};

export const AppMessages = {
  GenericErrorMessage: 'An error has occured while processing your request.',
};

/***************Enum Constants***************/

export enum AppEnv {
  Production = 'production',
  QA = 'qa',
  Stage = 'stage',
  Dev = 'development',
  Local = 'local'
}

export const HttpStatusCode = {
  Timeout: -1,
  NoContent: 204,
  BadRequest: 400,
  NotFound: 404,
  PreconditionRequired: 428
};

export const ErrorConfig = {
  SysErrId: 'SYS100',
  BadRequestId: 'SYS400',
  NotFoundId: 'SYS404',
  PreconditionRequiredId: 'SYS428',
  TimeoutId: 'UI408'
};

export enum RequestHeaders {
  ContentType = 'Content-Type',
  ApiKey = 'x-api-key',
  AccessToken = 'access-token',
  AgentType = 'agent-type'
}

export enum ResponseHeaders {
  AccessToken = 'access-token',
  RefreshToken = 'refresh'
}

export enum ErrorResponseMessageType {
  Toastr = 'TOASTER',
  Page = 'PAGE',
  Modal = 'MODAL'
}

/***************Enum Constants***************/
/***************Dashboard Rejection Constants***************/
export const rejectionCode = {
  accountNumCode : '3003',
  participantNumCode : '3004',
  identificationTypeCode : '3005',
  officialIdCode : '3006',
  seriesCode : '3007',
  inceptionDateCode : '3008',
  conceptionDateCode : '3009',
  lastNameCode : '3010',
  dosimeterTypeCode : '3011',
  endDateCode : '3012',
  officialIdCodePersonnel: '3101',
  lastNameCodePersonnel: '3102',
  firstNameCodePersonnel: '3104',
  genderCodePersonnel: '3106',
  birthDateCodePersonnel: '3108'
}
/***************Dashboard Rejection Constants***************/ 