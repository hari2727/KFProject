import { Repository } from 'typeorm';
import { IcJobTopSkillsEntity } from '../ic.entity';
import { IcBicsGrouped, IcSpSkillsData, } from '../ic.interface';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../_shared/convert';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class IcJobTopSkillsRepository extends Repository<IcJobTopSkillsEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(IcJobTopSkillsEntity, sql.dataSource.createEntityManager());
    }

    @LogErrors()
    async insertBulkIcBics(icBics: IcBicsGrouped): Promise<void> {
            const bulkInsert: IcJobTopSkillsEntity[] = [];

            for (const bic_code of Object.keys(icBics)) {
                const db = new IcJobTopSkillsEntity();
                db.clientJobId = 0;
                db.jrtDetailId = toStringOr(bic_code);
                db.topSkillsJson = JSON.stringify(icBics[bic_code]);
                db.createdOn = new Date();
                bulkInsert.push(db);
            }

            await this.createQueryBuilder().insert().into(IcJobTopSkillsEntity).values(bulkInsert).execute();
    }

    @LogErrors()
    async updateIcCustomProfile(parseData: IcSpSkillsData): Promise<void> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.SPUpdateICCustomProfile
                    @InClientJobID = :jobId,
                    @InJobDesc = :jobDescription,
                    @InSkillsJSON = :skillsJSON
            `,
            {
                jobId: toNumber(parseData.pmBicCode),
                jobDescription: toStringOr(parseData.description),
                skillsJSON: JSON.stringify(parseData.skills.normSkills)
            }
        );
    }

    @LogErrors()
    async updateAndDeleteIcSkillStagingTables(): Promise<void> {
            return await this.query(`
                UPDATE CJIC
                SET
                    ClientJobId = CJ.ClientJobId,
                    JobDescriptionModelID = CJ.JobDescriptionModelID
                FROM
                    SuccessProfile.dbo.ClientJobICTopSkills CJIC
                INNER JOIN
                    SuccessProfile.dbo.Clientjob CJ
                        ON
                            CJIC.JRTDetailID = CJ.JRTDetailID
                INNER JOIN
                    SuccessProfile.dbo.ClientStandardModelMapping csm
                        ON
                            CJ.JobDescriptionModelID = CSM.JobDescriptionModelID
                                AND
                            CSM.clientid = 0
                WHERE
                    1=1
                        AND
                    CJIC.ClientjobID = 0
                        AND
                    CSM.IsActive =1
                        AND
                    CJ.JobSourceID = 0
                        AND
                    clientjobstatusid not in (4, 8)
                ;

                DELETE CJIC
                FROM
                    SuccessProfile.dbo.clientjobictopskills cjic
                INNER JOIN
                    (
                        SELECT
                            MAX(cjic.ClientJobICTopSkillsID) ClientJobICTopSkillsID,
                            cjic.clientjobid clientjobid
                        FROM
                            SuccessProfile.dbo.clientjobictopskills cjic
                        INNER JOIN
                            SuccessProfile.dbo.clientjob cj
                                ON
                                    cj.clientjobid = cjic.clientjobid
                                        AND
                                    cj.jobsourceid IN (0, 1)
                        WHERE
                            cjic.parentclientjobid IS NULL
                        GROUP BY
                            cjic.clientjobid
                    ) tmp
                        ON
                            cjic.clientjobid = tmp.clientjobid
                                AND
                            cjic.ClientJobICTopSkillsID <> tmp.ClientJobICTopSkillsID
                ;`
            );
    }


}
