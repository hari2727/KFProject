import { Controller, Get, Query } from '@nestjs/common';
import { KfhubContentLibraryRoute } from './content-library.route';
import { FrameworkService } from './competencies/framework/framework.service';
import { Translation, TranslationsQuery } from './competencies/framework/framework.interface';

@Controller(KfhubContentLibraryRoute.BASE)
export class ContentLibraryController {
    constructor(protected frameworkService: FrameworkService) {}

    @Get(KfhubContentLibraryRoute.TRANSLATIONS)
    async getRoles(@Query() query: TranslationsQuery): Promise<Translation[]> {
        return await this.frameworkService.getLanguageCompetencies(query);
    }
}
