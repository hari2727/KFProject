import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('CachedSuccessProfilePDFJSON', { database: 'SuccessProfile' })
export class SuccessProfileExportJSONEntity {
    @PrimaryColumn({ name: 'ClientJobID' })
    id: number;

    @Column({ name: 'ClientID' })
    clientId: number;

    @Column({ name: 'PDFCachedJSON' })
    json: string;

    @Column({ name: 'CreatedOn' })
    createdOn: Date;

    @Column({ name: 'ModifiedOn' })
    modifiedOn: Date;
}
