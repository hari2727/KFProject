import { Column, PrimaryColumn, Entity } from 'typeorm';

@Entity('AryaPeerGroups', { database: 'SuccessProfile' })
export class KfhubPeerGroupsEntity {
    @PrimaryColumn({ name: 'PeerGroupID' })
    PeerGroupID: number;

    @Column({ name: 'PeerGroupName' })
    PeerGroupName: string;

    @Column({ name: 'CreatedOn' })
    CreatedOn: number;

    @Column({ name: 'ModifiedOn' })
    ModifiedOn: number;
}
