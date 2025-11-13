import { Module } from '@nestjs/common';
import { SuccessProfileJsonService } from './json.service';
import { SuccessProfileJsonController } from './json.controller';
import { SuccessProfileJsonRepository } from './json.repository';

@Module({
    providers: [
        SuccessProfileJsonRepository,
        SuccessProfileJsonService,
    ],
    controllers: [
        SuccessProfileJsonController,
    ],
})
export class SuccessProfileJsonModule {}
