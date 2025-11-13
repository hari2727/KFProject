import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { KfTarcContentService } from './kftarc-content.service';
import {
    KfTarcContentInterface as Kf,
    KfTarcLearningContentBody,
    KfTarcLearningContentDTO,
    KfTarcQuery
} from './kftarc-content.interface';
import { AppCode as ec } from '../../app.const';
import { KfTarchContentRoute } from './kftarc-content.route';
import { MapErrors } from '../../_shared/error/map-errors.decorator';

@Controller(KfTarchContentRoute.LEARNING_COURSES)
export class KfTarcContentController {
    constructor(protected service: KfTarcContentService) {}

    // 201
    @Post()
    @MapErrors({ errorCode: ec.GET_LEARNING_COURSES_ERR })
    handlePostRoute(@Body() body: Kf.RequestBody) {
        return this.service.validateContent(body);
    }
}

@Controller(KfTarchContentRoute.LEARNING_CONTENT)
export class KfTarcLearningContentController {
    constructor(protected service: KfTarcContentService) {}

    // apiTitle: 'Get learning content',
    @Get()
    @MapErrors({ errorCode: ec.LEARNING_CONTENT_ERR })
    async handleLearningContent(@Query() query: KfTarcLearningContentDTO) {
        if (query.outputType && query.outputType === 'FULL') {
            return await this.service.getLearningAssetsByCompsRoleLevels(query);
        }

        return await this.service.handleLearningContent(query);
    }

    @Post()
    async lc(@Body() body: KfTarcLearningContentBody, @Query() query: KfTarcQuery) {
        return this.service.lcPost(body, query);
    }
}
