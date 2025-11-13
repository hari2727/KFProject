import { DataSource, Repository } from 'typeorm';
import { ClientJob } from '../ic.entity';
import { IcSpSkillsData } from '../ic.interface';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../_shared/convert';

@Injectable()
export class IcClientJobRepository extends Repository<ClientJob> {

    constructor(dataSource: DataSource) {
        super(ClientJob, dataSource.createEntityManager());
    }

    @LogErrors()
    async updateJobDescription(parseData: IcSpSkillsData): Promise<void> {
            await this.update(
                {
                    clientJobId: toNumber(parseData.pmBicCode)
                },
                {
                    jobDescription: toStringOr(parseData.description),
                    modifiedOn: new Date()
                }
            );
    }
}
