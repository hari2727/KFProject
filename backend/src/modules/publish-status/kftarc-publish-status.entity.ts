import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PublishStatus', { database: 'CMM' })
export class PublishStatusEntity {
    @PrimaryGeneratedColumn({ name: 'ItemModificationID' })
    itemModificationId: number;

    @Column({ name: 'ClientId' })
    clientId: number;

    @Column({ name: 'PersonId' })
    personId: number;

    @Column({ name: 'FirstName' })
    firstName: string;

    @Column({ name: 'LastName' })
    lastName: string;

    @Column({ name: 'RequestPublishDate' })
    repustPublishedDate: string;

    @Column({ name: 'PublishedDate' })
    publishedDate: string;

    @Column({ name: 'ProfileNumber' })
    profileNumber: number;

    @Column({ name: 'CompetencyNumber' })
    competencyNumber: number;

    @Column({ name: 'PublishStatus' })
    publishStatus: string;

    @Column({ name: 'TotalPublishedRecords' })
    totalPublishedRecords: number;

    @Column({ name: 'PublishType' })
    publishType: string;
}
