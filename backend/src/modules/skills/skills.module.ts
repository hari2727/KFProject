import { Module } from '@nestjs/common';
import { SkillsController } from "./skills.controller";
import { SkillsService } from "./skills.service";
import { UserService } from "../../common/user/user.service";
import { ResponsibilitiesService } from '../responsibilities/responsibilities.service';
import { ResponsibilitiesRepository } from '../responsibilities/responsibilities.repository';
import { SkillsRepository } from './skills.repository';
import { TechnicalSkillTransformer } from './skills.transformer';

@Module({
    providers: [
        SkillsService,
        UserService,
        ResponsibilitiesService,
        ResponsibilitiesRepository,
        SkillsRepository,
        TechnicalSkillTransformer
    ],
    controllers: [
        SkillsController,
    ],
})
export class SkillsModule {}
