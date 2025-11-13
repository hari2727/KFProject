import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('GetPMMatrixProfiles', { database: 'SuccessProfile' })
export class KfTarcSuccessProfileMatrixEntity {
    @PrimaryGeneratedColumn({name: 'JobFamilyID'})
    JobFamilyID: string;
    @Column({name: 'JobFamilyName'})
    JobFamilyName: string;
    @Column({name: 'JobSubFamilyID'})
    JobSubFamilyID: string;
    @Column({name: 'JobSubFamilyName'})
    JobSubFamilyName: string;
    @Column({name: 'ProfileType'})
    ProfileType: number;
    @Column({name: 'LevelType'})
    LevelType: string;
    @Column({name: 'JobRoleTypeID'})
    JobRoleTypeID: string;
    @Column({name: 'RoleName'})
    RoleName: string;
    @Column({name: 'KFManagementName'})
    KFManagementName: string;
    @Column({name: 'HayReferenceLevel'})
    HayReferenceLevel: number;
    @Column({name: 'ShortProfile'})
    ShortProfile: string;
    @Column({name: 'JobID'})
    JobID: string;
    @Column({name: 'JobName'})
    JobName: string;
    @Column({name: 'enableProfileMatchTool'})
    enableProfileMatchTool: number;
    @Column({name: 'SubFunctionsCnt'})
    SubFunctionsCnt: number;
    @Column({name: 'RolesCnt'})
    RolesCnt: number;
    @Column({name: 'SuccessProfileCnt'})
    SuccessProfileCnt: number
    @Column({name: 'KFLevelName'})
    KFLevelName: string;
    @Column({name: 'RoleSuccessProfileCnt'})
    RoleSuccessProfileCnt: number
    @Column({name: 'MinGrade'})
    MinGrade: string;
    @Column({name: 'MaxGrade'})
    MaxGrade: string;
    @Column({name: 'IsExecutive'})
    IsExecutive: number;
    @Column({name: 'HayPoints'})
    HayPoints: number;
    @Column({name: 'CustomGrade'})
    CustomGrade: string;
    @Column({name: 'DENSERANK'})
    DENSERANK: number;
    @Column({name: 'TotalRecords'})
    TotalRecords: number;
}

export interface TotalRecords {
    TotalJobs: number;
}

export interface MatrixProfilesDataStream {
    [MatrixProfilesDataSetNames.TOTAL_RECORDS]: TotalRecords[];
    [MatrixProfilesDataSetNames.DATA]: KfTarcSuccessProfileMatrixEntity[];
}
export enum MatrixProfilesDataSetNames {
    TOTAL_RECORDS = 'TOTAL_RECORDS',
    DATA = 'DATA',
}

export interface DbResponse {
    amount: TotalRecords[]; entries: KfTarcSuccessProfileMatrixEntity[]
}
