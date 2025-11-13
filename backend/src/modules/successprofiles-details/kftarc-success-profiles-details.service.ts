import { Injectable } from '@nestjs/common';
import { RequestCommon } from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import { KfTarcSuccessProfileDetailsInterface as Kf } from './kftarc-success-profiles-details.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../_shared/https/https.service';
import { ConfigService } from '../../_shared/config/config.service';

@Injectable()
export class KfTarcSuccessProfilesDetailsService extends RequestCommon {

    constructor(
        protected https: HttpsService,
        protected configService: ConfigService,
    ) {
        super(configService);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getSuccessProfileDetails(spId: number, request: Kf.RequestWithAuthToken): Promise<Object> {
            const url = this.getSuccessProfileUrl(spId);
            const headers = await this.getHeaders(request);
            return await this.https.get(url, headers);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async putSuccessProfileDetails(job: object, clientId: number, spId: number, request: Kf.RequestWithAuthToken): Promise<Kf.SuccessProfileDetailsObjectResponse> {
            const url = this.getSuccessProfileUrl(spId);
            const headers = await this.getHeaders(request);
            const updateSpDetails = await this.https.put(url, headers, { job: job }) as Kf.SuccessProfileDetailsObjectResponse;
            this.deleteCachedJsonById(request, updateSpDetails.id, clientId);
            return updateSpDetails;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async copySuccessProfileDetails(job: object, clientId: number, request: Kf.RequestWithAuthToken): Promise<Kf.SuccessProfileDetailsObjectResponse> {
            const url = this.getSuccessProfileBaseUrl();

            const headers = await this.getHeaders(request);
            const copySpDetails = await this.https.post(url, headers, { job: job }) as Kf.SuccessProfileDetailsObjectResponse;
            return copySpDetails;
    }

    async getHeaders(request: Kf.RequestWithAuthToken) {
        const authToken = request.headers.authtoken;
        const psSessionId = request.headers['ps-session-id'];
        const headers = this.getKfhubApiHeaders(authToken, psSessionId);

        return headers;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    protected async deleteCachedJsonById(request: Kf.RequestWithAuthToken, spId: number, clientId: number): Promise<void> {
            const url = this.getUrlForCachedJsonRemoval(clientId, spId);
            const headers = await this.getHeaders(request);
            await this.https.delete(url, headers);
    }
}
