import { Module } from '@nestjs/common';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';
import { RequestCommon } from '../../common/common.utils';
import { SlidersRepository } from './sliders.repository';
import { RequestFactory } from '../../common/request-factory';

@Module({
    providers: [
        SlidersService,
        RequestCommon,
        SlidersRepository,
        RequestFactory,
    ],
    controllers: [
        SlidersController,
    ],
})
export class SlidersModule {}
