import { Module } from '@nestjs/common';
import { IgCmsConnection } from './cms/ig-cms-connection.service';
import { IgController } from './ig.controller';
import { IgService } from './ig.service';
import { IgDraftTransformer } from './generate-draft/ig-draft-generator';
import { IgCmsModelReader } from './cms/ig-cms-model.reader';
import { IgModelComparator } from './generate-draft/ig-model-comparator';
import { IgMssqlService } from './database/ig-mssql-service';
import { IgCustomCompetenciesService } from './custom-competencies/ig-custom-competencies.service';
import { IgDraftTransformerCustomCompetencies } from './generate-draft/ig-draft-generator-custom-competencies';
import { IgSkillsService } from './skills/skills-service';
import { IgSkillsDataService } from './skills/skills-data-service';
import { IgSkillsMapperService } from './skills/skills-mapper-service';
import { IgSkillsController } from './skills/skills.controller';

@Module({
    providers: [
        IgService,
        IgSkillsService,
        IgSkillsDataService,
        IgSkillsMapperService,
        IgCmsConnection,
        IgDraftTransformer,
        IgModelComparator,
        IgCmsModelReader,
        IgMssqlService,
        IgCustomCompetenciesService,
        IgDraftTransformerCustomCompetencies,
    ],
    controllers: [
        IgController,
        IgSkillsController,
    ],
})
export class IgModule {}
