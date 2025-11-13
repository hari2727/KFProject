import { Repository } from 'typeorm';
import { IcJobInsertEntity } from '../ic.entity';
import { IcInsertJobData, IcJob } from '../ic.interface';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../_shared/convert';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class IcJobDataRepository extends Repository<IcJobInsertEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(IcJobInsertEntity, sql.dataSource.createEntityManager());
    }

    @LogErrors()
    async insertIcJobs(icJobs: Partial<IcInsertJobData[]>): Promise<void> {
            const bulkInsert: IcJobInsertEntity[] = [];
            icJobs.forEach((data) => {
                const db = new IcJobInsertEntity();
                db.profileUploadFromEmpPayDataId = toNumber(data.profileUploadFromEmpPayDataId);
                db.companyId = toNumber(data.companyId);
                db.createBy = toNumber(data.createBy);
                db.profileRecordId = toNumber(data.profileRecordId);
                db.jobCode = toStringOr(data.jobCode);
                db.referenceLevel = toNumber(data.referenceLevel);
                db.kfFamilyCode = toStringOr(data.kfFamilyCode);
                db.kfSubFamilyCode = toStringOr(data.kfSubFamilyCode);
                db.clientJobTitle = toStringOr(data.clientJobTitle);
                db.bicProfileJRTDetailId = toStringOr(data.bicProfileJRTDetailId);
                db.architectJobCode = toStringOr(data.architectJobCode);
                db.customProfileID = toNumber(data.customProfileID);
                db.mappedSPClientJobId = toNumber(data.mappedSPClientJobId);
                db.createdOn = new Date();

                bulkInsert.push(db);
            });

            await this.createQueryBuilder().insert().into(IcJobInsertEntity).values(bulkInsert).execute();
    }

    @LogErrors()
    async pushIcJobsIntoTalentHub(clientId: number, uuid: string): Promise<IcJob[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.LoadThUploadedProfiles
                    @ClientID = :clientId,
                    @ProfileUploadFromEmpPayDataStatusID = :uuid
            `,
            {
                uuid: toStringOr(uuid),
                clientId: toNumber(clientId)
            }
        );
    }

}
