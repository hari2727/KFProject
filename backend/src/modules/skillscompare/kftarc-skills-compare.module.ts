import { Module } from "@nestjs/common";
import { KfTarcCompareSkillsController } from "./kftarc-skills-compare.controller";
import { KfTarcCompareSkillsService } from "./kftarc-skills-compare.service";

@Module({
    providers: [
        KfTarcCompareSkillsService,
    ],
    controllers: [
        KfTarcCompareSkillsController,
    ],
})
export class KfTarcCompareSkillsModule {}
