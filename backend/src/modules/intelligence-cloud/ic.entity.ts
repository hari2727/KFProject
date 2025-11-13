import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';

export const KfStringToNumberTransformer: ValueTransformer = {
    to: (entityValue: number) => entityValue,
    from: (databaseValue: string): number => + databaseValue
}

@Entity('ProfileUploadFromEmpPayDataStatus', { database: 'SuccessProfile' })
export class IcJobStatusEntity {
    @PrimaryGeneratedColumn({ name: 'ProfileUploadFromEmpPayDataID' })
    profileUploadFromEmpPayDataId: number;

    @Column({ name: 'ProfileUploadFromEmpPayDataStatusID' })
    profileUploadFromEmpPayDataStatusId: string;

    @Column({ name: 'ProfileUploadStatusID', transformer: [KfStringToNumberTransformer] })
    profileUploadStatusId: number;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'CreateBy', transformer: [KfStringToNumberTransformer] })
    createBy: number;

    @Column({ name: 'ClientId', transformer: [KfStringToNumberTransformer] })
    clientId: number;

    @Column({ name: 'UploadedSource' })
    uploadedSource: string;

    @Column({ name: 'ClientOrgId' })
    clientOrgId: string;
}

@Entity('ProfileUploadFromEmpPayDataICJSON', { database: 'SuccessProfile' })
export class IcJobPayloadEntity {
    @PrimaryGeneratedColumn({ name: 'JSONFileID' })
    jsonFileId: number;

    @Column({ name: 'InputJSON' })
    inputJson: string;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'CreatedBy' })
    createdBy: number;

    @Column({ name: 'JSONType ' })
    type: string;
}

@Entity('ProfileUploadFromEmpPayData', { database: 'SuccessProfile' })
export class IcJobInsertEntity {
    @PrimaryColumn({ name: 'ProfileUploadFromEmpPayDataID' })
    profileUploadFromEmpPayDataId: number;

    @Column({ name: 'ProfileRecordID' })
    profileRecordId: number;

    @Column({ name: 'CountryID' })
    countryId: number;

    @Column({ name: 'CompanyID' })
    companyId: number;

    @Column({ name: 'CompanyOrgCode' })
    companyOrgCode: string;

    @Column({ name: 'CompanyName' })
    companyName: string;

    @Column({ name: 'ClientJobCode' })
    clientJobCode: string;

    @Column({ name: 'ClientFamily' })
    clientFamily: string;

    @Column({ name: 'ReferenceLevel' })
    referenceLevel: number;

    @Column({ name: 'JobCode' })
    jobCode: string;

    @Column({ name: 'KFFamilyCode' })
    kfFamilyCode: string;

    @Column({ name: 'KFSubfamilyCode' })
    kfSubFamilyCode: string;

    @Column({ name: 'ClientJobtitle' })
    clientJobTitle: string;

    @Column({ name: 'ClientJobSummary' })
    clientJobSummary: string;

    @Column({ name: 'MappedSPClientJobID' })
    mappedSPClientJobId: number;

    @Column({ name: 'ClientJobID' })
    clientJobId: number;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'CreateBy' })
    createBy: number;

    @Column({ name: 'BICProfileJRTDetailID' })
    bicProfileJRTDetailId: string;

    @Column({ name: 'ArchitectJobFlag' })
    architectJobFlag: number;

    @Column({ name: 'ArchitectJobCode' })
    architectJobCode: string;

    @Column({ name: 'BenchMarkFlag' })
    benchMarkFlag: number;

    @Column({ name: 'CustomProfileID' })
    customProfileID: number;

    @Column({ name: 'HideInProfileManager' })
    hideInProfileManager: number;

    @Column({ name: 'LCID' })
    LCID: string;
}

@Entity('ClientJobICTopSkills', { database: 'SuccessProfile' })
export class IcJobTopSkillsEntity {
    @PrimaryGeneratedColumn({ name: 'ClientJobICTopSkillsID' })
    clientJobICTopSkillsId: number;

    @Column({ name: 'ClientJobID' })
    clientJobId: number;

    @Column({ name: 'ParentClientJobID' })
    parentClientJobId: number;

    @Column({ name: 'JRTDetailID' })
    jrtDetailId: string;

    @Column({ name: 'TopSkillsJSON' })
    topSkillsJson: string;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'ModifiedOn' })
    modifiedOn: Date;
}

@Entity('ClientJob', { database: 'SuccessProfile' })
export class ClientJob {
    @PrimaryGeneratedColumn({ name: 'ClientJobID' })
    clientJobId: number;

    @Column({ name: 'ParentClientJobID', nullable: true })
    parentClientJobId: number;

    @Column({ name: 'JobSourceID' })
    jobSourceId: number;

    @Column({ name: 'JobSourceTypeID', nullable: true })
    jobSourceTypeId: number;

    @Column({ name: 'JobName' })
    jobName: string;

    @Column({ name: 'JobShortDescription', nullable: true })
    jobShortDescription: string;

    @Column({ name: 'JobDescription', nullable: true })
    jobDescription: string;

    @Column({ name: 'JRTDetailID', nullable: true })
    jrtDetailId: string;

    @Column({ name: 'DisplayClientJob' })
    displayClientJob: number;

    @Column({ name: 'GradeID', nullable: true })
    gradeId: string;

    @Column({ name: 'AboutTheCompany', nullable: true, type: 'text' })
    aboutTheCompany: string;

    @Column({ name: 'ClientJobStatusID', nullable: true })
    clientJobStatusId: number;

    @Column({ name: 'ResponsibilitySignoff', nullable: true })
    responsibilitySignoff: number;

    @Column({ name: 'LCID', nullable: true })
    lcid: string;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'CreatedBy' })
    createdBy: number;

    @Column({ name: 'ModifiedOn' })
    modifiedOn: Date;

    @Column({ name: 'ModifiedBy' })
    modifiedBy: number;

    @Column({ name: 'HayReferenceLevel', nullable: true })
    hayReferenceLevel: number;

    @Column({ name: 'JobAdditionalComments', nullable: true, type: 'text' })
    jobAdditionalComments: string;

    @Column({ name: 'JobDescriptionModelID', nullable: true })
    jobDescriptionModelId: number;

    @Column({ name: 'SectionProductID', nullable: true })
    sectionProductId: number;

    @Column({ name: 'KFLevelID', nullable: true })
    kfLevelId: number;

    @Column({ name: 'TACustomize', nullable: true })
    taCustomize: number;

    @Column({ name: 'IsKFClientJob', nullable: true })
    isKfClientJob: number;

    @Column({ name: 'NormRegionID', nullable: true })
    normRegionId: number;

    @Column({ name: 'NormCountryID', nullable: true })
    normCountryId: number;

    @Column({ name: 'IsGlobalRole', nullable: true })
    isGlobalRole: number;

    @Column({ name: 'JELineGrade', nullable: true, type: 'float' })
    jeLineGrade: number;

    @Column({ name: 'ClientJobCode', nullable: true })
    clientJobCode: string;

    @Column({ name: 'BoxProfileFlag', nullable: true })
    boxProfileFlag: number;

    @Column({ name: 'JobCode', nullable: true })
    jobCode: string;

    @Column({ name: 'ArchitectJobFlag', nullable: true })
    architectJobFlag: number;

    @Column({ name: 'HideJobInPM', nullable: true })
    hideJobInPM: number;

    @Column({ name: 'IsCollabEdit', nullable: true })
    isCollabEdit: number;

    @Column({ name: 'IsICUpdated', nullable: true })
    isICUpdated: number;
}
