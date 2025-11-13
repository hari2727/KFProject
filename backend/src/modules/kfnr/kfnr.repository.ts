import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfnrRepository {

    constructor(protected sql: TypeOrmHelper) {
    }

    async getSpIdByBicCodeAndVersionNo(bicCode: string, versionNo: string): Promise<{ SPID: number }[]> {
        return await this.sql.query(`
                Select
                    CJ.ClientJobID SPID
                From
                    SuccessProfile.dbo.ClientJob CJ
                Inner Join
                    SuccessProfile.dbo.ClientJobextension CJE
                        on
                            CJ.ClientJobID = CJE.ClientJobID
                Where
                    CJ.JobSourceID = 0
                        and
                    CJ.ClientJobStatusID not in (4, 8)
                        and
                    CJ.JRTDetailID = :BicCode
                        and
                    CJE.VersionNo = :VersionNo
            `,
            {
                BicCode: toStringOr(bicCode),
                VersionNo: versionNo,
            }
        );
    }

    @LogErrors()
    async getClientJobIdByJobCodeAndGrade(jobCode: string, grade: string): Promise<{ ClientJobID: number }[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetSPIdBasedOnPayJobCode
                    @InPayJobCode = :JobCode,
                    @InGrade = :Grade
            `,
            {
                JobCode: toStringOr(jobCode),
                Grade: toNumber(grade),
            }
        );
    }
}
