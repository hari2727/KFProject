import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ItemModificationProfilesBulkUpdateProfiles', { database: 'CMM' })
export class ItemModificationProfilesBulkUpdateProfiles {

    @PrimaryColumn({ name: 'ItemModificationID' })
    itemModificationId: number;

    @Column({ name: 'ClientJobID' })
    clientJobId: number;
}

@Entity('ItemModificationProfilesBulkUpdateLevels', { database: 'CMM' })
export class ItemModificationSubCategory {

    @PrimaryColumn({ name: 'ItemModificationID' })
    itemModificationId: number;

    @Column({ name: 'JobSubCategoryID' })
    competencyId: number;

    @Column({ name: 'JobLevelDetailOrder' })
    levelId: number;

    @Column({ name: 'SectionDetailOrder' })
    order: number;
}
