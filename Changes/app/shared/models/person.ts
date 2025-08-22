export interface PersonDTO {
  personId: number;
  isotracEmployeeId: number;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  genderCode: string | null;
  birthDate: Date | null;
  jobClassifCode: number;
  flagReasonCode: number;
  statusCode: number;
  personIdentity: PersonIdentityDTO[];
  participant: ParticipantDTO[];
  pregnancy: PregnancyDTO[];
}

export interface PersonIdentityDTO {
  personIdentityId: number;
  personId: number;
  officialId: string | null;
  identityTypeCode: number;
  activeFlag: boolean;
}

export interface ParticipantDTO {
  participantId: number;
  dosimetryParticipantId: string | null;
  participantName: string | null;
  inceptionDate: string | null;
  accountId: number;
  personId: number;
  participantLocation: ParticipantLocationDTO[];
  dosimeterCodeCde: number;
}

export interface ParticipantLocationDTO {
  participantLocationId: number;
  locationId: number;
  locationRtlshpCode: number;
  participantId: number;
  statusCode: number;
  startDate: string | null;
  endDate: string | null;
}

export interface PregnancyDTO {
  pregnancyId: number;
  personId: number;
  declarationDate: string | null;
  conceptionDate: string | null;
}
