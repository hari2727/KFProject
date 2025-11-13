import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { IcRoute } from './ic.route';
import { IcService } from './ic.service';
import { IcBicsBodyParams, IcBodyProps, IcQueryProps, IcResponse, IcSpSkillsData } from './ic.interface';
import { IcExportService } from './export/export.service';
import { ExportRequestBody } from './export/export.interface';
import { Response } from 'express';
import { IcUploadService } from './ic-upload.service';
import { SkillsFileUploadResponse, SkillsFileUploadTargetRequestBody } from './ic-upload.i';

@Controller(IcRoute.BASE)
export class IcController {

    constructor(
        protected service: IcService,
        protected uploadService: IcUploadService,
        protected exportService: IcExportService,
        ) {}

    // apiTitle: 'Add IC Jobs data',
    @Post(IcRoute.JOBS)
    async insertIcProfileData(@Query() query: IcQueryProps, @Body() body: IcBodyProps): Promise<IcResponse> {
        return await this.service.insertIcProfileData(query, body);
    }

    // apiTitle: 'Get skills xlsx file upload url',
    @Post(IcRoute.BICS_XLSX_UPLOAD)
    async getICSkillsFileUploadURL(@Body() body: SkillsFileUploadTargetRequestBody): Promise<SkillsFileUploadResponse> {
        return await this.uploadService.getSkillsFileUploadURL(body);
    }

    // apiTitle: 'Add bics data - upload top 20 skills Json',
    @Post(IcRoute.BICS)
    async insertIcProfileBulkData(@Query() query: IcQueryProps, @Body() body: IcBicsBodyParams):Promise<any> {
        return await this.service.insertIcBicsBulkData(body);
    }

    // apiTitle: 'update skills data',
    @Post(IcRoute.SKILLS)
    async updateIcSkillData(@Query() query: IcQueryProps, @Body() body: IcSpSkillsData) {
        return await this.service.updateIcSkillsData(query, body);
    }

    // apiTitle: 'Export SPs data to excel',
    @Post(IcRoute.EXPORT)
    async profileExport(@Body() body: ExportRequestBody, @Res() response: Response): Promise<any> {
        response.setTimeout(60 * 1000);
        return await this.exportService.exportProfiles(body, response);
    }

}
