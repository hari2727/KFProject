import { IgCmsModelReader } from './ig-cms-model.reader';
import { IgCmsModel } from '../model/ig-cms-model.i';
import { IgModel } from '../model/ig-model.i';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger';
import { AppCode as ec } from '../../../app.const';
import { CmsApi as cms, CmsEnvs, CompetencyType } from '../model/ig-cms-enum';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';
import { HttpsService } from '../../../_shared/https/https.service';
import { Nullable } from '../../../_shared/types';
import { Loggers } from '../../../_shared/log/loggers';
import { ConfigService } from '../../../_shared/config/config.service';
import { safeString } from '../../../_shared/safety';

@Injectable()
export class IgCmsConnection {
    protected logger: LoggerService;
    protected env: string;
    protected apiBase: string;
    protected accessSecret: string;

    constructor(
        protected http: HttpsService,
        protected modelReader: IgCmsModelReader,
        protected loggers: Loggers,
        protected configService: ConfigService,
    ) {
        this.logger = loggers.getLogger(IgCmsConnection.name);
        this.env = CmsEnvs[this.configService.get('APP_ENV')];
        this.apiBase = this.configService.get('CMS_API_BASE') + '/';
        this.accessSecret = this.configService.get('CMS_ACCESS_KEY');
    }

    @LogErrors()
    async getInterviewGuides(clientId: string, competencyType: CompetencyType): Promise<Nullable<IgModel.CompetencyRoot[]>> {
            const response: IgCmsModel.IgCms = await this.getInterviewGuidesFromCms(clientId, competencyType);
            if (response) return this.modelReader.mapResponseToCompetencyRoots(response, competencyType);
            return null;
    }

    @LogErrors()
    async getCompetencyById(clientId: string, competencyId: string, competencyType: CompetencyType): Promise<Nullable<IgModel.Competency>> {
            const response: IgCmsModel.IgCms = await this.getInterviewGuidesFromCms(clientId, competencyType);
            if (response) return this.modelReader.getCompetencyById(response, competencyId);
        return null;
    }

    @LogErrors()
    async publishInterviewGuide(guide: IgCmsModel.IgCms): Promise<IgCmsModel.IgCmsPublishResponse> {
            const headers = { Authorization: await this.getToken() };
            const url = this.apiBase + this.env + cms.IG;
            const resp = (await this.http.post(url, headers, guide)) as IgCmsModel.IgCmsPublishResponse;
            this.logger.debug(`Guide ID: ${guide.id}, Language: ${guide.lang}, Response: ${JSON.stringify(resp)}`);
            return resp;
    }

    @LogErrors()
    protected async getToken(): Promise<string> {
            const url = this.apiBase + this.env + cms.AUTHENTICATE,
                headers = { Authorization: this.accessSecret, 'Content-Type': 'application/json; charset=utf-8' };
            const response: IgCmsModel.IgGetTokenResponse = (await this.http.post(url, headers, null)) as any;
            if (!response?.success) {
                throw safeString(`Get token failed ${response?.message}`);
            }
            return response.token;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    protected async getInterviewGuidesFromCms(clientId: string, competencyType: CompetencyType, lang = 'en-US'): Promise<Nullable<IgCmsModel.IgCms>> {
        const headers = { Authorization: await this.getToken() };
        let response: IgCmsModel.IgCms = null;
        switch (competencyType) {
            case CompetencyType.STANDART:
                try {
                    const url =
                        this.apiBase + this.env + cms.IG + cms.GET_IG_CLIENT_ID_PREFIX + clientId + cms.CLIENT_ID_POSTFIX + '?lang=' + lang + '&merge=false';

                    response = (await this.http.get(url, headers)) as IgCmsModel.IgCms;
                } catch (e) {
                    this.logger.error('Error in getInterviewGuidesFromCms STANDART', e);
                }
                break;
            case CompetencyType.BASE:
                try {
                    const url = this.apiBase + this.env + cms.IG + cms.GET_IG_BASE_CONTENT + '?lang=' + lang;
                    response = (await this.http.get(url, headers)) as IgCmsModel.IgCms;
                } catch (e) {
                    this.logger.error('Error in getInterviewGuidesFromCms Base Content', e);
                }
                break;
        }
        if (response?.competencies?.length < 1 || response?.Message) {
            throw response?.Message || response;
        }
        return response;
    }
}
