import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('GenerateHCMIntDownloadStatus', { database: 'SuccessProfile' })
export class GenerateHCMIntDownloadStatus {

    @PrimaryGeneratedColumn()
    GenerateHCMIntDownloadID: number;

    @Column()
    GenerateHCMIntDownloadStatusID: string;

    @Column()
    ClientID: number;

    @Column()
    LCID: string;

    @Column()
    GenerateHCMDownloadStatusID: number;

    @Column()
    DownloadType: string;

    @Column()
    DownloadedOn: string;

    @Column()
    DownloadedBy: number;
}

@Entity('GenerateHCMIntDownloadProfiles', { database: 'SuccessProfile' })
export class GenerateHCMIntDownloadProfiles {
    @PrimaryColumn()
    GenerateHCMIntDownloadID: number;

    @PrimaryColumn()
    ClientJobID: number;
}
