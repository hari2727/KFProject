import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class BulkRunnerTasksDataService {
    constructor(
        @InjectRepository(TaskEntity)
        protected repository: Repository<TaskEntity>,
    ) {}

    getByTaskGroupId(taskGroupId: number): Promise<TaskEntity[]> {
        return this.repository.find({
            where: {
                groupId: taskGroupId,
            },
        });
    }
}
