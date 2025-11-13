import { Module } from '@nestjs/common';
import { ContentLibraryController } from './content-library.controller';
import { FrameworkRepository } from './competencies/framework/framework.repository';
import { FrameworkService } from './competencies/framework/framework.service';

@Module({
    providers: [
        FrameworkService,
        FrameworkRepository,
    ],
    controllers: [
        ContentLibraryController,
    ],
})
export class ContentLibraryModule {}
