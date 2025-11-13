import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ClientJob', { database: 'SuccessProfile' })
export class TestEntity {
    @PrimaryGeneratedColumn({ name: 'ClientJobID' })
    clientJobId: number;

    @Column({ name: 'ParentClientJobID' })
    parentClientJobId: number;

    @Column({ name: 'JobSourceID' })
    jobSourceId: number;

    @Column({ name: 'JobSourceTypeID' })
    jobSourceTypeId: number;

    @Column({ name: 'JobName' })
    jobName: string;

    @Column({ name: 'JobShortDescription' })
    jobShortDescription: string;

    @Column({ name: 'JobDescription' })
    jobDescription: string;

    @Column({ name: 'JRTDetailID' })
    JRTDetailId: string;

    @Column({ name: 'DisplayClientJob' })
    displayClientJob: number;

    @Column({ name: 'GradeID' })
    gradeId: number;

    @Column({ name: 'AboutTheCompany' })
    aboutTheCompany: string;

    @Column({ name: 'ClientJobStatusID' })
    clientJobStatusId: number;

    @Column({ name: 'ResponsibilitySignoff' })
    responsibilitySignoff: number;

    @Column({ name: 'LCID' })
    LCID: string;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'CreatedBy' })
    createdBy: number;

    @Column({ name: 'ModifiedOn' })
    modifiedOn: Date;

    @Column({ name: 'ModifiedBy' })
    modifiedBy: number;

    @Column({ name: 'HayReferenceLevel' })
    hayReferenceLevel: number;

    @Column({ name: 'JobAdditionalComments' })
    jobAdditionalComments: string;

    @Column({ name: 'JobDescriptionModelID' })
    jobDescriptionModelId: number;

    @Column({ name: 'SectionProductID' })
    sectionProductId: number;

    @Column({ name: 'KFLevelID' })
    KFLevelId: number;

    @Column({ name: 'TACustomize' })
    TACustomize: number;

    @Column({ name: 'IsKFClientJob' })
    isKFClientJob: number;

    @Column({ name: 'NormRegionID' })
    normRegionId: number;

    @Column({ name: 'NormCountryID' })
    normCountryId: number;

    @Column({ name: 'IsGlobalRole' })
    isGlobalRole: number;

    @Column({ name: 'JELineGrade' })
    JELineGrade: number;

    @Column({ name: 'ClientJobCode' })
    clientJobCode: string;

    @Column({ name: 'BoxProfileFlag' })
    boxProfileFlag: number;

    @Column({ name: 'JobCode' })
    jobCode: string;

    @Column({ name: 'ArchitectJobFlag' })
    architectJobFlag: number;
}
