import { Module } from '@nestjs/common';
import { ResponsibilitiesService } from './responsibilities.service';
import { ResponsibilitiesController } from './responsibilities.controller';
import { ResponsibilitiesRepository } from './responsibilities.repository';

@Module({
    providers: [
        ResponsibilitiesService,
        ResponsibilitiesRepository,
    ],
    controllers: [
        ResponsibilitiesController,
    ]
})
export class ResponsibilitiesModule {}
