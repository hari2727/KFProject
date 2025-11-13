import { IsString } from 'class-validator';
import { QueryProps } from '../../common/common.interface';
import { ExportOutputLocation } from './export/export.const';
import { SourceType } from './ic.enum';

export interface IcQueryProps extends QueryProps.Default {
  clientId: string;
}
export class InsertIcDataProfile extends QueryProps.FileUuid {
  @IsString()
  fileKey: string;
}
export interface IcBodyProps {
  externalClientId: number;
  clientOrgId: string;
  jobs: IcJob[];
  target?: ExportOutputLocation;
  sourceType?: SourceType;
}

export interface IcJob {
  jobTitle: string;
  jobCode: string;
  bicCode: string;
  pmBicCode?: string;
  isBic?: boolean;
  bicSpid?: number;
  profileRecordId?: number;
  customProfileId?: number | null;
}

export interface IcResponse extends IcBodyProps {
  success: boolean;
  error?: {
    message: string;
    code: string;
  };
}

export interface IcStatus {
  profileUploadFromEmpPayDataId: number;
  profileUploadFromEmpPayDataStatusId: string;
  profileUploadStatusId: number;
  createdOn: Date;
  createBy: number;
  clientId: number;
  uploadedSource: string;
  clientOrgId: string;
}
export interface ClientJobRaw {
  clientjobid: number;
}

export interface IcInsertJobData {
  profileUploadFromEmpPayDataId: number;
  companyId: number;
  createBy: number;
  profileRecordId: number;
  jobCode: string;
  referenceLevel: number;
  kfFamilyCode: string;
  kfSubFamilyCode: string;
  clientJobTitle: string;
  bicProfileJRTDetailId: string;
  architectJobCode: string;
  customProfileID: number;
  mappedSPClientJobId: number;
}

export interface IcBicsBodyParams {
  bicsInfo: IcBicInfo[];
}
export interface IcBicInfo {
  bic_code?: string;
  skillName: string;
  skillId: number;
  rank: number;
}
export interface IcBicsParsedData {
  jrtDetailId: string;
  topSkillsJson: string;
  createdOn: Date;
  modifiedOn: Date;
}
export interface IcBicsGrouped {
  [key: string]: IcBicInfo[]
}

export interface IcSpSkillsData {
  pmBicCode: string;
  description: string;
  jobCode: string;
  jobType: string;
  bicCode: string;
  skills: IcNormSkillsData;
}

export interface IcNormSkillsData {
  normSkills: IcBicInfo[];
}
