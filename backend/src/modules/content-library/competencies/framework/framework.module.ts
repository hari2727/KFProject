import { Module } from '@nestjs/common';
import { FrameworkService } from './framework.service';
import { FrameworkRepository } from './framework.repository';

@Module({
    providers: [
        FrameworkService,
        FrameworkRepository,
    ],
})
export class FrameworkModule {}
