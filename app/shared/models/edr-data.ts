export interface EdrDTO {
  stageExtDoseResultNum: number;
  noteCode: string | null;
  series: string | null;
  participantNum: string | null;
  dosimeterType: string | null;
  useType: string | null;
  startDate: string | null;
  endDate: string | null;
  energyRange: string | null;
  doseConversionStandard: string | null;
  units: string | null;
  deepDoseEquivalent: number;
  lensDoseEquivalent: number;
  shallowDoseEquivalent: number;
  ddePhotonPart: number;
  ldePhotonPart: number;
  sdePhotonPart: number;
  deNeutronPart: number;
  sdeBetaPart: number;
  radiationQuality: string | null;
  controlIndicator: string | null;
  serialNum: string | null;
  officialId: string | null;
  doseDerivation: string | null;
  doseStatus: string | null;
  doseUse: string | null;
  accountNum: string | null;
  backupTimestamp: string | null; // Consider parsing this into a Date if needed
  statusCode: number;
  rejectionReason: string | null;
}
