import { Module } from '@nestjs/common';
import { KfTarcCertificationController } from './kftarc-certification.controller';
import { KfTarcCertificationService } from './kftarc-certification.service';
import { KfTarcCertificationRepository } from './kftarc-certification.repository';

@Module({
    providers: [
        KfTarcCertificationRepository,
        KfTarcCertificationService,
    ],
    controllers: [
        KfTarcCertificationController,
    ],
})
export class KfTarcCertificationModule {}
