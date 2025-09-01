export interface ParticipantDTO {
  stageParticipantNum: number;
  processNum: string | null;
  series: string | null;
  participantNum: string | null;
  identificationType: string | null;
  officialId: string | null;
  lastName: string | null;
  firstName: string | null;
  middleInitial: string | null;
  sex: string | null;
  birthDate: string | null;
  inceptionDate: string | null;
  conceptionDate: string | null;
  declarationDate: string | null;
  control: string | null;
  accountNum: string | null;
  backupTimestamp: string | null;
  statusCode: number;
  rejectionReason: string | null;
}
