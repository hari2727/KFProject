import { Module } from '@nestjs/common';
import { KfTarcContentController, KfTarcLearningContentController } from './kftarc-content.controller';
import { KfTarcContentService } from './kftarc-content.service';
import { KfTarchContentRepository } from './kftarc-content.repository';

@Module({
    providers: [
        KfTarcContentService,
        KfTarchContentRepository,
    ],
    controllers: [
        KfTarcContentController,
        KfTarcLearningContentController,
    ],
})
export class KfTarcContentModule {}
