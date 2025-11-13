import { DataSource, Repository } from 'typeorm';
import { IcJobStatusEntity } from '../ic.entity';
import { IcStatus } from '../ic.interface';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../_shared/convert';

@Injectable()
export class IcJobStatusRepository extends Repository<IcJobStatusEntity> {

    constructor(dataSource: DataSource) {
        super(IcJobStatusEntity, dataSource.createEntityManager());
    }

    @LogErrors()
    async createIcJobStatus(clientOrgId: string, createdBy: number, uploadedSource: string, uuid: string, status: number, clientId:number): Promise<IcStatus> {
            return await this.save({
                profileUploadFromEmpPayDataStatusId: toStringOr(uuid),
                profileUploadStatusId: toNumber(status),
                clientId: toNumber(clientId),
                createBy: toNumber(createdBy),
                clientOrgId: toStringOr(clientOrgId),
                uploadedSource: toStringOr(uploadedSource),
                createdOn: new Date()
            });
    }

    @LogErrors()
    async updateIcJobStatus(icProfileEmpId: number, uuid: string, status: number): Promise<void> {
            await this.update(
                {
                    profileUploadFromEmpPayDataId: toNumber(icProfileEmpId),
                    profileUploadFromEmpPayDataStatusId: toStringOr(uuid),
                },
                {
                    profileUploadStatusId: toNumber(status),
                }
            );
    }
}
