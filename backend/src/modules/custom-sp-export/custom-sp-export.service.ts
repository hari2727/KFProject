import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '../../logger';
import { HcmDownloadIntRepository, HCMIntDownloadProfiles } from './custom-sp-export.repository';
import {
    HcmSpExportReqBody,
    HcmSpExportQuery,
    FileFormats,
    FileStages,
    HCMExportEvent,
    HcmSpExportData,
    HCMExportRequestQuery,
    HCMExportRequestBody,
    HcmRmqPushResponse,
    HCMExportResponse,
} from './interfaces';
import { generateUUIDv4 } from '../../common/common.utils';
import { ClientProxy } from '@nestjs/microservices';
import { Kf1HCMExportRmqServiceName } from './microservices.module';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { GenerateHCMIntDownloadProfiles, GenerateHCMIntDownloadStatus } from './custom-sp-export.entity';
import { toNumber } from '../../_shared/convert';
import { safeString } from '../../_shared/safety';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { HcmExportUtils } from './custom-sp-export.utills';

@Injectable()
export class HcmExportService {
    protected logger: LoggerService;

    constructor(
        protected repository: HcmDownloadIntRepository,
        protected hcmProfilesRepository: HCMIntDownloadProfiles,
        @Inject(Kf1HCMExportRmqServiceName)
        protected kf1HCMExportRmq: ClientProxy,
        protected loggers: Loggers,
        @InjectDataSource()
        protected readonly datasource: DataSource,
        protected readonly hcmExportUtils: HcmExportUtils
    ) {
        this.logger = loggers.getLogger(HcmExportService.name);
    }

    @LogErrors()
    async storeDownloadInfo(
        clientId: number,
        userId: number,
        locale: string,
        downloadFormat: FileFormats,
        spIds: number[]
    ) {
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            return await this.datasource.transaction(async () => {
                const result = await this.repository.createHcmExportDownloadStatus(
                    clientId,
                    userId,
                    locale,
                    generateUUIDv4(),
                    downloadFormat,
                    queryRunner.manager.getRepository(GenerateHCMIntDownloadStatus)
                );

                const downloadId = result.GenerateHCMIntDownloadID;
                const entities: GenerateHCMIntDownloadProfiles[] = spIds.map((item) => ({
                    GenerateHCMIntDownloadID: downloadId,
                    ClientJobID: toNumber(item),
                }));

                await this.hcmProfilesRepository.insertProfileIdForDownload(entities, queryRunner);

                queryRunner.commitTransaction();

                return result.GenerateHCMIntDownloadStatusID;
            });
        } catch (e) {
            queryRunner.rollbackTransaction();
            throw e;
        } finally {
            queryRunner.release();
        }
    }

    async hcmCustomSpExport(
        query: HcmSpExportQuery,
        body: HcmSpExportReqBody
    ): Promise<HCMExportResponse<FileFormats>> {
        try {
            const clientId = query.clientId || query.loggedInUserClientId;
            const locale = query.lcid || query.locale;
            const userId = query.userId;
            const downloadFormat = body.downloadFormat;
            const spIds = body.successprofileIds;

            if (!Array.isArray(spIds) || spIds.length === 0) {
                throw new BadRequestException('Success Profile IDs are required');
            }

            if (downloadFormat === FileFormats.JSON && spIds.length > 5) {
                throw new BadRequestException('JSON format is not supported for more than 5 Success Profiles');
            }

            const downloadUuid = await this.storeDownloadInfo(clientId, userId, locale, downloadFormat, spIds); // no need to keep inside try-catch

            return await this.handleHcmExport(clientId, locale, downloadUuid, spIds, downloadFormat);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            } else {
                throw new InternalServerErrorException('Internal server error');
            }
        }
    }

    @LogErrors()
    private async handleHcmExport(
        clientId: number,
        locale: string,
        downloadUuid: string,
        spIds: number[],
        downloadFormat: FileFormats
    ): Promise<HCMExportResponse<typeof downloadFormat>> {
        try {
            await this.repository.updateHcmExportDownloadStatus(clientId, FileStages.INPROGRESS, downloadUuid);

            let res: HCMExportResponse<typeof downloadFormat>;

            if (downloadFormat === FileFormats.HCM) {
                res = await this.sendHcmExportToRmq(spIds, clientId);
            } else {
                const details = await this.getDetails(clientId, locale, downloadUuid);

                if (downloadFormat === FileFormats.JSON) {
                    res = await this.hcmExportUtils.getCustomHCMJSON(details);
                } else if (downloadFormat === FileFormats.CSV) {
                    res = await this.hcmExportUtils.getHcmCsv(details);
                } else if (downloadFormat === FileFormats.EXCEL) {
                    res = await this.hcmExportUtils.getHcmExcel(details, clientId);
                }
            }

            await this.repository.updateHcmExportDownloadStatus(clientId, FileStages.SUCCESS, downloadUuid);

            return res;
        } catch (e) {
            await this.repository.updateHcmExportDownloadStatus(clientId, FileStages.FAILED, downloadUuid);
            throw e;
        }
    }

    @LogErrors()
    async customSpExportHcm(query: HCMExportRequestQuery, body: HCMExportRequestBody): Promise<any> {
        let spIds: number[];

        //if jobCodes are present, give it preference, else spIds
        if (body.jobCodes instanceof Array && body.jobCodes.length > 0) {
            const mappings = await this.repository.getCustomSPIdWithJobCodes(query.clientId, body.jobCodes);

            if (mappings.length !== body.jobCodes.length) {
                const jobCodeSet = new Set<string>();

                for (const mapping of mappings) {
                    jobCodeSet.add(mapping.KF1JobCode);
                }

                const missingJobCodes = body.jobCodes.filter((jobCode) => !jobCodeSet.has(jobCode));

                throw new BadRequestException(`Missing mappings for job codes: ${missingJobCodes.join(', ')}`);
            }

            spIds = mappings.map((mapping) => mapping.AIAutoCustomSPID);
        } else if (body.successprofileIds instanceof Array && body.successprofileIds.length > 0) {
            spIds = body.successprofileIds;
        } else {
            throw new BadRequestException('Either jobCodes or successprofileIds should be provided');
        }
        const customQuery: HcmSpExportQuery = {
            ...query,
            userId: 0,
            loggedInUserClientId: query.clientId,
            locale: query.lcid,
        };

        const customBody: HcmSpExportReqBody = {
            ...body,
            successprofileIds: spIds,
        };

        return await this.hcmCustomSpExport(customQuery, customBody);
    }

    @LogErrors()
    async getDetails(clientId: number, lcid: string, uuid: string): Promise<HcmSpExportData> {
        const [
            competencies,
            drivers,
            education,
            generalExperiences,
            managerialExperiences,
            responsibilities,
            skills,
            successProfiles,
            tasks,
            tools,
            traits,
        ] = await Promise.all([
            this.repository.customSPExportCompetencies(clientId, lcid, uuid),
            this.repository.customSPExportDrivers(clientId, lcid, uuid),
            this.repository.customSPExportEducation(clientId, lcid, uuid),
            this.repository.customSPExportGeneralExp(clientId, lcid, uuid),
            this.repository.customSPExportManagerialExp(clientId, lcid, uuid),
            this.repository.customSPExportResponsibilities(clientId, lcid, uuid),
            this.repository.customSPExportSkills(clientId, lcid, uuid),
            this.repository.customSPExportSuccessProfiles(clientId, lcid, uuid),
            this.repository.customSPExportTasks(clientId, lcid, uuid),
            this.repository.customSPExportTools(clientId, lcid, uuid),
            this.repository.customSPExportTraits(clientId, lcid, uuid),
        ]);

        return {
            competencies,
            drivers,
            education,
            generalExperiences,
            managerialExperiences,
            responsibilities,
            skills,
            successProfiles,
            tasks,
            tools,
            traits,
        };
    }

    @LogErrors()
    async sendHcmExportToRmq(spIds: number[], clientId: number): Promise<HcmRmqPushResponse> {
        const exportedSpIds: number[] = [];
        const skippedSpIds: number[] = [];

        const batchSize = 100;
        for (let i = 0; i < spIds.length; i += batchSize) {
            const spIdsBatch = spIds.slice(i, i + batchSize);
            const request_ids: Record<string, number> = {};
            let kf1_client_key: string;
            for (const spId of spIdsBatch) {
                const [remoteJobId, Kf1ClientKey] = await this.getRemoteJobIdFromSpId(clientId, spId);
                if (remoteJobId == null) {
                    skippedSpIds.push(spId);
                    continue; //skipping if remoteJobId is not found
                }
                request_ids[remoteJobId] = spId;
                if (Kf1ClientKey != null) kf1_client_key = Kf1ClientKey;
                exportedSpIds.push(spId);
            }

            const evt: HCMExportEvent = {
                payload: {
                    header: {
                        type: 'exporthsm.init',
                        timestamp: new Date().toISOString(),
                        status: 'success',
                        client_id: String(clientId),
                        request_id_count: spIdsBatch.length,
                        kf1_client_key: kf1_client_key,
                    },
                    data: {
                        request_ids: request_ids,
                    },
                },
            };

            this.kf1HCMExportRmq.send('', evt).subscribe({
                next: () => {
                    this.logger.debug('Message sent');
                },
                error: (e) => {
                    this.logger.debug(`Error sending message: ${safeString(e)}`);
                },
                complete: () => {
                    this.logger.debug('Message sent completed');
                },
            });
        }

        return {
            message: 'Export has been initiated',
            exportedSPIds: exportedSpIds,
            skippedSpIds: skippedSpIds,
        };
    }

    @LogErrors()
    async getRemoteJobIdFromSpId(clientId: number, spId: number): Promise<[string, string] | [undefined, undefined]> {
        const dbRes = await this.repository.getRemoteJobIdFromSpId(clientId, spId);

        if (!dbRes || !dbRes.length) {
            return [undefined, undefined];
        }

        return [dbRes[0].RemoteJobID, dbRes[0].Kf1ClientKey];
    }
}
