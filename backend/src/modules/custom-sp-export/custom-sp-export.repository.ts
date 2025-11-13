import { DataSource, QueryRunner, Repository } from 'typeorm';
import { GenerateHCMIntDownloadProfiles, GenerateHCMIntDownloadStatus } from './custom-sp-export.entity';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';
import { FileFormats, FileStages, HCMIntDownloadProfilesRequest, BehavioralCompetencyRaw, DriverRaw, EducationRaw, GeneralExperienceRaw, SpRaw, ManagerialExperienceRaw, ResponsibilityRaw, SkillRaw, TaskRaw, ToolRaw, TraitRaw } from './interfaces';


@Injectable()
export class HcmDownloadIntRepository extends Repository<GenerateHCMIntDownloadStatus> {

    constructor(protected sql: TypeOrmHelper) {
        super(GenerateHCMIntDownloadStatus, sql.dataSource.createEntityManager());
    }

    @LogErrors()
    async createHcmExportDownloadStatus(
            clientId: number,
            userId: number,
            locale: string,
            uuid: string,
            downloadFormat: FileFormats,
            repository: Repository<GenerateHCMIntDownloadStatus> = this
    ) {
            const data = new GenerateHCMIntDownloadStatus();
            
            data.GenerateHCMIntDownloadStatusID = uuid;
            data.ClientID = clientId;
            data.LCID = locale;
            data.GenerateHCMDownloadStatusID = FileStages.TRIGGERED;
            data.DownloadType = downloadFormat;
            data.DownloadedOn = new Date().toISOString();
            data.DownloadedBy = userId;

            return await repository.save(data);
    }

    @LogErrors()
    async updateHcmExportDownloadStatus(clientId: number, status: FileStages, uuid: string): Promise<void> {
            await this.update(
                {
                    ClientID: clientId,
                    GenerateHCMIntDownloadStatusID:uuid
                },
                {
                    GenerateHCMDownloadStatusID: status,
                },
            );
    }

    @LogErrors()
    async customSPExportCompetencies(clientId: number, lcid: string, guid: string): Promise<BehavioralCompetencyRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportCompetencies
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportDrivers(clientId: number, lcid: string, guid: string): Promise<DriverRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportDrivers
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportEducation(clientId: number, lcid: string, guid: string): Promise<EducationRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportEducation
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportGeneralExp(clientId: number, lcid: string, guid: string): Promise<GeneralExperienceRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportGeneralExp
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportManagerialExp(clientId: number, lcid: string, guid: string): Promise<ManagerialExperienceRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportManagerialExp
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportResponsibilities(clientId: number, lcid: string, guid: string): Promise<ResponsibilityRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportResponsibilities
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportSkills(clientId: number, lcid: string, guid: string): Promise<SkillRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportSkills
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportSuccessProfiles(clientId: number, lcid: string, guid: string): Promise<SpRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportSuccessProfiles
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportTasks(clientId: number, lcid: string, guid: string): Promise<TaskRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportTasks
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportTools(clientId: number, lcid: string, guid: string): Promise<ToolRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportTools
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async customSPExportTraits(clientId: number, lcid: string, guid: string): Promise<TraitRaw[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GenerateHCMIntCustomSPExportTraits
                    :clientId,
                    :locale,
                    :guid
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(lcid),
                guid: toStringOr(guid)
            }
        );
    }

    @LogErrors()
    async getRemoteJobIdFromSpId(clientId: number, spId: number): Promise<{ RemoteJobID: string; Kf1ClientKey: string }[]> {
        return await this.sql.query(`
                select
                    J.KF1RemoteJobID RemoteJobID,
                    J.Kf1ClientKey Kf1ClientKey
                from
                    SuccessProfile.dbo.AIAutoKFClientJob as J
                inner join
                    SuccessProfile.dbo.KfonePMProfileMapping as M
                        on
                            J.AIAutoKFClientJobID = M.AIAutoKFClientJobID
                where
                    AIAutoCustomSPID = :spId
                        and
                    PMClientID = :clientId
            `,
            {
                clientId: toNumber(clientId),
                spId: toNumber(spId),
            }
        );
    }

    @LogErrors()
    async getCustomSPIdWithJobCodes(clientId: number, jobCodes: string[]): Promise<{ KF1JobCode: string; AIAutoCustomSPID: number }[]> {
        return await this.sql.query(`
            SELECT KF1JobCode, AIAutoCustomSPID 
            FROM AIAutoKFClientJob AS j 
            INNER JOIN KfonePMProfileMapping AS m 
            ON j.AIAutoKFClientJobID = m.AIAutoKFClientJobID 
            WHERE PMClientID = :pmClientId 
            AND KF1JobCode IN (:...jobCodes);
        `, {
            pmClientId: toNumber(clientId),
            jobCodes: jobCodes,
        });
    }
}

@Injectable()
export class HCMIntDownloadProfiles extends Repository<GenerateHCMIntDownloadProfiles> {

    constructor(protected sql: TypeOrmHelper) {
        super(GenerateHCMIntDownloadProfiles, sql.dataSource.createEntityManager());
    }

    @LogErrors()
    async insertProfileIdForDownload(data: HCMIntDownloadProfilesRequest[], queryRunner: QueryRunner) {
        return await this.createQueryBuilder(undefined, queryRunner).insert().into(GenerateHCMIntDownloadProfiles).values(data).execute();
    }

    @LogErrors()
    async getDownloadedDateForSpId(clientId: number, spIds: number[]): Promise<{ CustomSPID: string; RecentDownloadDate: string }[]> {
            return await this.sql.query(
                `select ClientJobID as CustomSPID, Max(DownloadedOn) as RecentDownloadDate
                from GenerateHCMIntDownloadProfiles P inner join GenerateHCMIntDownloadStatus S 
                on P.GenerateHCMIntDownloadID = s.GenerateHCMIntDownloadID where S.ClientID = :clientId 
                and S.GenerateHCMDownloadStatusID = :statusId 
                and ClientJobID in (:...spIds) group by (ClientJobID)`,
                {
                    clientId: clientId,
                    statusId: FileStages.SUCCESS,
                    spIds: spIds,
                }
            );
    }
}
