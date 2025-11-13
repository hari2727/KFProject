import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskGroupEntity } from './taskgroup.entity';
import { UpdateResult } from 'typeorm';
import { toSqlFormat } from '../../common/date';
import { getCurrentTimeStamp } from '../../common/data';

@Injectable()
export class BulkRunnerTaskGroupsDataService {
    constructor(
        @InjectRepository(TaskGroupEntity)
        protected repository: Repository<TaskGroupEntity>,
    ) {}

    protected async getCurrentTimeStamp(): Promise<string> {
        return toSqlFormat(await getCurrentTimeStamp(this.repository));
    }

    async getById(id: number): Promise<TaskGroupEntity> {
        return this.repository.findOne({
            where: {
                id,
            },
        });
    }

    async updateTaskGroup(entity: Partial<TaskGroupEntity>): Promise<UpdateResult> {
        const update = this.buildUpdate(entity, await this.getCurrentTimeStamp());
        const results = await this.repository.update(entity.id, update);
        Object.assign(entity, update);
        return results;
    }

    protected buildUpdate(entity: Partial<TaskGroupEntity>, currentTimeStamp: string): Partial<TaskGroupEntity> {
        entity.updatedOn = currentTimeStamp;
        const update = { ...entity };
        delete update.id;
        delete update.createdOn;
        return update;
    }
}
