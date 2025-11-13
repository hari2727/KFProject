import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TasksScheduler', { database: 'SuccessProfile' })
export class TaskEntity {
    @PrimaryGeneratedColumn({ name: 'TaskID' })
    id: number;

    @Column({ name: 'TaskGroupID' })
    groupId: number;

    @Column({ name: 'TaskType' })
    type: string;

    @Column({ name: 'TaskTimeoutInMin' })
    timeoutInMin: number;

    @Column({ name: 'TaskJSONData' })
    options: string;

    @Column({ name: 'TaskPriority' })
    priority: number;

    @Column({ name: 'TaskStatus' })
    status: number;

    @Column({ name: 'TaskInvocationCheckSum' })
    invocationHash: string;

    @Column({ name: 'TaskResult' })
    result: string;

    @Column({ name: 'TaskCreatedOn' })
    createdOn: string;

    @Column({ name: 'TaskModifiedOn' })
    updatedOn: string;
}

export const TaskEntityDict = Object.freeze({
    TaskID: 'id',
    TaskGroupID: 'groupId',
    TaskType: 'type',
    TaskTimeoutInMin: 'timeoutInMin',
    TaskJSONData: 'options',
    TaskPriority: 'priority',
    TaskStatus: 'status',
    TaskInvocationCheckSum: 'invocationHash',
    TaskResult: 'result',
    TaskCreatedOn: 'createdOn',
    TaskModifiedOn: 'updatedOn',
});
