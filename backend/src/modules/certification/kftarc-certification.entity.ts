import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ClientJobCertificates', { database: 'SuccessProfile' })
export class KfTarcCertificationEntity {
    @PrimaryGeneratedColumn({ name: 'CertificateId' })
    certificateId: number;

    @Column({ name: 'ClientId' })
    clientId: number;

    @Column({ name: 'ClientJobId' })
    clientJobId: number;

    @Column({ name: 'CertificateCode' })
    certificateCode: string;

    @Column({ name: 'CertificateTitle' })
    certificateTitle: string;

    @Column({ name: 'CertificateDesc' })
    certificateDesc: string;

    @Column({ name: 'CertificateOrder' })
    certificateOrder: number;

    @Column({ name: 'IsDeleted' })
    isDeleted: number;
}
