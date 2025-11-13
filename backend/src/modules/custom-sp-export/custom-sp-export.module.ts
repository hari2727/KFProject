import { Module } from '@nestjs/common';
import { HcmExportService } from './custom-sp-export.service';
import { HcmExportController } from './custom-sp-export.controller';
import { HcmDownloadIntRepository, HCMIntDownloadProfiles } from './custom-sp-export.repository';
import { MicroservicesModule } from './microservices.module';
import { HcmExportUtils } from './custom-sp-export.utills';

@Module({
    imports: [MicroservicesModule],
    providers: [HcmExportService, HcmDownloadIntRepository, HCMIntDownloadProfiles, HcmExportUtils],
    controllers: [HcmExportController],
    exports: [HCMIntDownloadProfiles, HcmDownloadIntRepository],
})
export class HcmExportModule {}
