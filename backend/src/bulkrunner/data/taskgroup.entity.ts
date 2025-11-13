import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TaskGroupScheduler', { database: 'SuccessProfile' })
export class TaskGroupEntity {
    @PrimaryGeneratedColumn({ name: 'TaskGroupID' })
    id: number;

    @Column({ name: 'TaskGroupType' })
    type: string;

    @Column({ name: 'TaskGroupLifeTimeDays' })
    validPeriodInDays: number;

    @Column({ name: 'TaskGroupGlobalJSONData' })
    options: string;

    @Column({ name: 'TaskGroupPriority' })
    priority: number;

    @Column({ name: 'TaskGroupStatus' })
    status: number;

    @Column({ name: 'TaskGroupResult' })
    result: string;

    @Column({ name: 'TaskGroupCreatedOn' })
    createdOn: string;

    @Column({ name: 'TaskGroupModifiedOn' })
    updatedOn: string;

    @Column({ name: 'ClientID' })
    clientId: number;

    @Column({ name: 'UserID' })
    userId: number;
}

export const TaskGroupEntityDict = Object.freeze({
    TaskGroupID: 'id',
    TaskGroupType: 'type',
    TaskGroupLifeTimeDays: 'validPeriodInDays',
    TaskGroupGlobalJSONData: 'options',
    TaskGroupPriority: 'priority',
    TaskGroupStatus: 'status',
    TaskGroupResult: 'result',
    TaskGroupCreatedOn: 'createdOn',
    TaskGroupModifiedOn: 'updatedOn',
    ClientID: 'clientId',
    UserID: 'userId',
});
