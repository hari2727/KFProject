import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('GetPMSearchProfiles', { database: 'SuccessProfile' })
export class KfTarcSuccessProfileSearchEntity {
    @PrimaryGeneratedColumn({ name: 'ClientJobId' })
    ClientJobId: number;
    @Column({ name: 'PersonId' })
    PersonId: string;
    @Column({ name: 'FirstName' })
    FirstName: string;
    @Column({ name: 'Name' })
    Name: string;
    @Column({ name: 'JobName' })
    JobName: string;
    @Column({ name: 'CreatedOn' })
    CreatedOn: string;
    @Column({ name: 'ModifiedOn' })
    ModifiedOn: string;
    @Column({ name: 'Level' })
    Level: string;
    @Column({ name: 'ReferenceLevel' })
    ReferenceLevel: number;
    @Column({ name: 'JobFamilyName' })
    JobFamilyName: string;
    @Column({ name: 'JobSubFamilyName' })
    JobSubFamilyName: string;
    @Column({ name: 'ClientJobStatusID' })
    ClientJobStatusID: string;
    @Column({ name: 'IsProfileInProfileCollection' })
    IsProfileInProfileCollection: number;
    @Column({ name: 'JobSourceID' })
    JobSourceID: string;
    @Column({ name: 'ModifiedFirstName' })
    ModifiedFirstName: string;
    @Column({ name: 'ModifiedLastName' })
    ModifiedLastName: string;
    @Column({ name: 'LevelType' })
    LevelType: string;
    @Column({ name: 'JobRoleTypeID' })
    JobRoleTypeID: string;
    @Column({ name: 'enableProfileMatchTool' })
    enableProfileMatchTool: number;
    @Column({ name: 'MinGrade' })
    MinGrade: string;
    @Column({ name: 'MaxGrade' })
    MaxGrade: string;
    @Column({ name: 'Haypoints' })
    Haypoints: number;
    @Column({ name: 'CustomGrade' })
    CustomGrade: string;
    @Column({ name: 'ShortProfile' })
    ShortProfile: string;
    @Column({ name: 'ClientIndustryID' })
    ClientIndustryID: number;
    @Column({name:'ArchitectJobFlag'})
    ArchitectJobFlag: number;
    @Column({name:'IsTemplateJob'})
    IsTemplateJob: boolean;
    @Column({ name: 'TotalRecords' })
    TotalRecords: number;
    @Column({ name: 'JRTDetailID' })
    JRTDetailID: string;
    @Column({ name: 'JobDescription' })
    JobDescription: string;
    @Column({ name: 'JobCode' })
    JobCode: string;
}
