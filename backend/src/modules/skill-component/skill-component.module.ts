import { Module, ValidationPipe } from '@nestjs/common';
import { SkillComponentService } from './skill-component.service';
import { SkillComponentController } from './skill-component.controller';
import { UserService } from '../../common/user/user.service';
import { APP_PIPE } from '@nestjs/core';
import { SkillComponentRepository } from './skill-component.repository';

@Module({
    providers: [
        SkillComponentService,
        SkillComponentRepository,
        UserService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
    controllers: [SkillComponentController],
})
export class SkillComponentModule {}
