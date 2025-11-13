import { DataSource, Repository } from 'typeorm';
import { IcJobPayloadEntity } from '../ic.entity';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../_shared/convert';

@Injectable()
export class IcJobPayloadRepository extends Repository<IcJobPayloadEntity> {

    constructor(dataSource: DataSource) {
        super(IcJobPayloadEntity, dataSource.createEntityManager());
    }

    @LogErrors()
    async createIcJobPayLoad(inputPayload: string, createdBy: number, status: string): Promise<void> {
            await this.save({
                inputJson: toStringOr(inputPayload),
                type: toStringOr(status),
                createdBy: toNumber(createdBy),
                createdOn: new Date()
            });
    }
}
