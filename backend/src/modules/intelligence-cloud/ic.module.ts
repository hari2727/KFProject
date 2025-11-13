import { Module } from '@nestjs/common';
import { IcController } from './ic.controller';
import { IcService } from './ic.service';
import { IcJobStatusRepository } from './repositories/ic.jobStatus.repository';
import { IcJobDataRepository } from './repositories/ic.jobData.repository';
import { IcJobPayloadRepository } from './repositories/ic.jobPayload.repository';
import { IcClientJobRepository } from './repositories/ic.clientJob.repository';
import { IcJobTopSkillsRepository } from './repositories/ic.jobTopSkils.repository';
import { IcExportService } from './export/export.service';
import { IcExportRepository } from './export/export.repository';
import { RequestFactory } from '../../common/request-factory';
import { IcUploadService } from './ic-upload.service';
import { S3Util } from '../../common/s3-util';

@Module({
    providers: [
        S3Util,
        IcService,
        IcUploadService,
        IcExportService,
        IcExportRepository,
        RequestFactory,
        IcJobStatusRepository,
        IcJobDataRepository,
        IcJobPayloadRepository,
        IcJobTopSkillsRepository,
        IcClientJobRepository,
    ],
    controllers: [
        IcController,
    ],
})
export class IntelligenceCloudModule {}
