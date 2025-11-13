import { Injectable } from '@nestjs/common';
import { RequestCommon } from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import { KfTarcJobDescriptionsDetailsInterface as Kf } from './kftarc-job-descriptions-details.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../_shared/https/https.service';
import { ConfigService } from '../../_shared/config/config.service';

@Injectable()
export class KfTarcJobDescriptionsDetailsService extends RequestCommon {

    constructor(
        protected https: HttpsService,
        protected configService: ConfigService,
    ) {
        super(configService);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getJobDescriptionsDetails(jdId: number, request: Kf.RequestWithAuthToken): Promise<Object> {
            const url = this.getJobDescriptionsUrl(jdId);
            const headers = await this.getHeaders(request);
            return await this.https.get(url, headers);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async putJobDescriptionsDetails(job: object, clientId: number, jdId: number, request: Kf.RequestWithAuthToken): Promise<Kf.JobDescriptionsDetailsObjectResponse> {
            const url = this.getJobDescriptionsUrl(jdId);
            const headers = await this.getHeaders(request);
            const updateJdDetails = await this.https.put(url, headers, { job: job }) as Kf.JobDescriptionsDetailsObjectResponse;
            this.deleteCachedJsonById(request, updateJdDetails.id, clientId);
            return updateJdDetails;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async copyJobDescriptionsDetails(job: object, clientId: number, request: Kf.RequestWithAuthToken): Promise<Kf.JobDescriptionsDetailsObjectResponse> {
            const url = this.getJobDescriptionBaseUrl();

            const headers = await this.getHeaders(request);
            const copyJdDetails = await this.https.post(url, headers, { job: job }) as Kf.JobDescriptionsDetailsObjectResponse;
            return copyJdDetails;
    }

    async getHeaders(request: Kf.RequestWithAuthToken) {
        const authToken = request.headers.authtoken;
        const psSessionId = request.headers['ps-session-id'];
        const headers = this.getKfhubApiHeaders(authToken, psSessionId);

        return headers;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    protected async deleteCachedJsonById(request: Kf.RequestWithAuthToken, jdId: number, clientId: number): Promise<void> {
            const url = this.getUrlForCachedJsonRemoval(clientId, jdId);
            const headers = await this.getHeaders(request);
            await this.https.delete(url, headers);
    }
}
