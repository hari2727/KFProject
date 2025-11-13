import { Injectable } from '@nestjs/common';
import { IgCmsModel, IgCmsXmlModel } from '../model/ig-cms-model.i';
import { IgModel } from '../model/ig-model.i';
import { IgCmsModelReader } from './ig-cms-model.reader';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../../_shared/https/https.service';
import { ConfigService } from '../../../_shared/config/config.service';
import { safeString } from '../../../_shared/safety';

@Injectable()
export class IgCmsConnectionXml {

    protected hostXml = 'should be read from env file';
    protected interviewGuidesHostXml = 'should be read from env file';

    constructor(
        protected http: HttpsService,
        protected modelReader: IgCmsModelReader,
        protected configService: ConfigService,
    ) {}

    protected async getHeadersXml(): Promise<{ authorization: string; 'x-api-key': string }> {
        return {
            authorization: await this.getTokenXml(),
            'x-api-key': this.configService.get('CMS_API_KEY'),
        };
    }

    @LogErrors()
    protected async getTokenXml(): Promise<string> {
            const xApiKey = this.configService.get('CMS_API_KEY');
            const response: IgCmsModel.IgGetTokenResponse = (await this.http.post(
                `${this.hostXml}authenticate`,
                { 'x-api-key': xApiKey },
                {
                    accessKey: '',
                },
            )) as IgCmsModel.IgGetTokenResponse;

            if (!response.success) {
                throw safeString(`Get token failed ${response}`);
            }

            return response.token;
    }

    @LogErrors()
    async getInterviewGuidesXml(): Promise<IgModel.CompetencyRoot[]> {
            const response: IgCmsXmlModel.Response = await this.getInterviewGuidesFromCmsXml();
            return this.modelReader.mapXmlResponseToCompetencyRoots(response);
    }

    @LogErrors()
    protected async getInterviewGuidesFromCmsXml(): Promise<IgCmsXmlModel.Response> {
            const response: IgCmsXmlModel.Response = (await this.http.get(
                `${this.interviewGuidesHostXml}`,
                await this.getHeadersXml(),
            )) as IgCmsXmlModel.Response;

            return response;
    }
}
