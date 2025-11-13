import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('GetLearningAssetsByJobId', { database: 'SuccessProfile' })
export class KfTarcContentEntity {
    @PrimaryGeneratedColumn({ name: 'LearningAssetID' })
    learningAssetId: number;

    @Column({ name: 'LearningAssetName' })
    learningAssetName: string;

    @Column({ name: 'LearningAssetDescription' })
    learningAssetDescription: string;

    @Column({ name: 'JobSectionID' })
    jobSectionId: number;

    @Column({ name: 'JobSectionCode' })
    jobSectionCode: string;

    @Column({ name: 'JobSectionname' })
    jobSectionName: string;

    @Column({ name: 'JobCategoryID' })
    jobCategoryId: number;

    @Column({ name: 'JobCategoryName' })
    jobCategoryName: string;

    @Column({ name: 'JobSubcategoryID' })
    jobSubcategoryId: number;

    @Column({ name: 'JobSubcategoryCde' })
    jobSubcategoryCode: string;

    @Column({ name: 'JobSubCategoryName' })
    jobSubCategoryName: string;

    @Column({ name: 'LevelName' })
    levelName: string;

    @Column({ name: 'SubLevelName' })
    subLevelName: string;
}
