import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { AppCode as ec } from '../../app.const';
import {
    IcBicsBodyParams,
    IcBicsGrouped,
    IcBodyProps,
    IcInsertJobData,
    IcJob,
    IcQueryProps,
    IcResponse,
    IcSpSkillsData
} from './ic.interface';
import { generateUUIDv4, okResponse } from '../../common/common.utils';
import { IcJobStatusRepository } from './repositories/ic.jobStatus.repository';
import { IcJobDataRepository } from './repositories/ic.jobData.repository';
import { IcJobPayloadRepository } from './repositories/ic.jobPayload.repository';
import { IcJsonType, IcUploadStatus, SourceType } from './ic.enum';
import { IcJobTopSkillsRepository } from './repositories/ic.jobTopSkils.repository';
import { IcExportService } from './export/export.service';
import { OutputType } from './export/export.const';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { toNumber, toStringOr } from '../../_shared/convert';
import { safeString } from '../../_shared/safety';

@Injectable()
export class IcService {
  protected logger: LoggerService;

  constructor(
    protected icJobStatusRepository: IcJobStatusRepository,
    protected icJobDataRepository: IcJobDataRepository,
    protected icJobPayloadRepository: IcJobPayloadRepository,
    protected icJobTopSkillsRepository: IcJobTopSkillsRepository,
    protected icExportService: IcExportService,
    protected loggers: Loggers,
  ) {
      this.logger = loggers.getLogger(IcService.name);
  }

    @LogErrors()
  async insertIcProfileData(query: IcQueryProps, body: IcBodyProps): Promise<IcResponse> {
    const bodyLogging = { ...body };
    delete bodyLogging.jobs;
        this.logger.debug(safeString(`insertIcProfileData payload: ${JSON.stringify(bodyLogging)}`));
      const uuid = generateUUIDv4();

      const sourceType = (body.sourceType) ? body.sourceType : SourceType.PROFILE_TYPE;

      await this.icJobPayloadRepository.createIcJobPayLoad(JSON.stringify(body), +query.userId, IcJsonType.INSERT);

      const icJobStatus = await this.icJobStatusRepository.createIcJobStatus(body.clientOrgId, +query.userId, sourceType, uuid, IcUploadStatus.PROFILE_UPLOAD_IN_PROGRESS, +body.externalClientId);

      const icProfileUploadId = icJobStatus.profileUploadFromEmpPayDataId; //insertedId

      const icJobs = this.restructureIcInsertJobData(body, icProfileUploadId, query);

      const chunks = this.divideInChunks(icJobs, 10);

      for (const chunk of chunks) {
        await this.icJobDataRepository.insertIcJobs(chunk);
      }

      const jobs: IcJob[] = await this.icJobDataRepository.pushIcJobsIntoTalentHub(+body.externalClientId, uuid);
      const result: IcResponse = {
        success: true,
        externalClientId: body.externalClientId,
        clientOrgId: body.clientOrgId,
        jobs: jobs,
      };
      if (jobs.length > 0 && jobs[0].pmBicCode) {
        await this.updateIcJobStatus(icProfileUploadId, uuid, IcUploadStatus.PROFILE_UPLOAD_SUCCESSFULL);

        if(sourceType === SourceType.PROFILE_TYPE) {
            this.icExportService.exportProfiles({
              clientId: +body.externalClientId,
              locale: 'en',
              guid: uuid,
              output: OutputType.Beehive,
              target: body.target,
            }).catch(e => this.logger.error('Error in exportProfiles', e));
          }

          return result;
      }
      await this.updateIcJobStatus(icProfileUploadId, uuid, IcUploadStatus.ERROR_IN_PROFILE_UPLOAD);
      return {
        ...result,
        success: false,
        error: {
          message: `Error in loading jobs for ${body.externalClientId}`,
          code: ec.INTERNAL_SERVER_ERROR
        }
      };
  }

    @LogErrors()
  protected restructureIcInsertJobData(body: IcBodyProps, icJobStatusId: number, query: IcQueryProps): IcInsertJobData[] {
      let profileRecordId = 1;

      return body.jobs.map((job) => {

        let customProfileId: number = null;
        let mappeddSPClientJobId: number = null;

        if (job.isBic) {
          customProfileId = 0;
          mappeddSPClientJobId = job.bicSpid;
        } else {
          customProfileId = job.bicSpid;
          mappeddSPClientJobId = job.bicSpid;
        }
        return {
          profileUploadFromEmpPayDataId: toNumber(icJobStatusId),
          profileRecordId: profileRecordId++,
          companyId: toNumber(body.externalClientId),
          createBy: toNumber(query.userId),
          jobCode: job.bicCode.substring(0, 3) + job.jobCode.substring(job.bicCode.length - 2),
          referenceLevel: +(job.bicCode.substring(job.bicCode.length - 2)),
          kfFamilyCode: job.bicCode.substring(0, 2),
          kfSubFamilyCode: job.bicCode.substring(0, 3),
          clientJobTitle: toStringOr(job.jobTitle),
          mappedSPClientJobId: toNumber(mappeddSPClientJobId),
          customProfileID: toNumber(customProfileId),
          bicProfileJRTDetailId: toStringOr(job.bicCode),
          architectJobCode: toStringOr(job.jobCode)
        }
      });
  }

    @LogErrors()
  protected async updateIcJobStatus(icJobStatusId: number, uuid: string, status: IcUploadStatus): Promise<void> {
      await this.icJobStatusRepository.updateIcJobStatus(icJobStatusId, uuid, status);
  }

  @LogErrors()
  async insertIcBicsBulkData(body: IcBicsBodyParams): Promise<any> {
      const icBicsData = this.groupByBicCode(body);
      await this.icJobTopSkillsRepository.insertBulkIcBics(icBicsData);
      await this.icJobTopSkillsRepository.updateAndDeleteIcSkillStagingTables();
      return okResponse;
  }

  protected groupByBicCode(bics: IcBicsBodyParams): IcBicsGrouped {
    const grouped = bics.bicsInfo.reduce((r, a) => {
        const { bic_code, ...items } = a;
        r[a.bic_code] = [...r[a.bic_code] || [], items];
        return r;
    }, {});
    return grouped;
  }

    @MapErrors({ errorCode: ec.INPUT_VAL_ERR })
    @LogErrors()
    async updateIcSkillsData(query: IcQueryProps, body: IcSpSkillsData): Promise<any> {
      await this.icJobPayloadRepository.createIcJobPayLoad(JSON.stringify(body), +query.loggedInUserClientId, IcJsonType.UPDATE);

      const checkPmBicCode = parseFloat(body.pmBicCode);
      const isPmBicCodeNumeric = isNaN(checkPmBicCode) ? null : checkPmBicCode

      if (isPmBicCodeNumeric === null) {
        throw 'pmBicCode is required and should be a number';
      }

      await this.icJobTopSkillsRepository.updateIcCustomProfile(body);

      return okResponse;
  }


  protected divideInChunks<T>(body: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];

    while (body.length) {
      const chunk = body.splice(0, chunkSize);
      chunks.push(chunk);
    }

    return chunks;
  }
}
