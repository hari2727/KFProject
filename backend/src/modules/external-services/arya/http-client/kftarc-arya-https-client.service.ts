import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KfTracArya, KfTracAryaAuthenticate } from './kftarc-arya-https-client.interface';
import { AppCode as ec } from '../../../../app.const';
import { MapErrors } from '../../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../../../_shared/https/https.service';
import { ConfigService } from '../../../../_shared/config/config.service';

@Injectable()
export class AryaClient {

    protected url = 'https://iarya.leoforce.com/iaryaapi/api/v1';
    protected sso;
    protected appKey;
    protected token;

    constructor(
        protected https: HttpsService,
        protected configService: ConfigService,
    ) {
        this.sso = this.configService.get('ARYA_SSO_KEY');
        this.appKey = this.configService.get('ARYA_APP_KEY');

        /**
         *
         * Below statements take care of token refreshing for Arya every 1 hour
         *
         */
        this.refreshAuthToken();
        const numberInHours = 1;
        setInterval(() => {
            this.refreshAuthToken();
        }, numberInHours * 60 * 60 * 1000);
    }

    async refreshAuthToken() {
        try {
            const authentication = await this.authenticate();
            this.token = authentication.AuthToken;
        } catch (e) {
            this.token = undefined;
        }
    }

    /* Arya authentication external api failed
     */
    @MapErrors({ errorCode: ec.ARYA_AUTH_ERR })
    @LogErrors()
    async authenticate() {
        try {
            const result = (await this.https.post(
                this.url + '/orgs/Authenticate',
                {
                    SSO: this.sso,
                    AppKey: this.appKey,
                },
                {},
            )) as KfTracAryaAuthenticate;

            if (result.StatusCode === 'OK') {
                return result;
            }
            throw new HttpException(result.Reason, HttpStatus.UNAUTHORIZED);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

    protected internalServerError(result) {
        /**
         *
         * Arya send 500 Internal server error as json response with 200 status
         * Due to this we have add error detector explicitly
         *
         */
        return result.Code === 500;
    }
    /*
    Get arya skill external api failed
     */

    @MapErrors({ errorCode: ec.ARYA_EXTERNAL_ERR })
    @LogErrors()
    async agent(jobTitle, countryId, clientNames = '', industries = '') {
        try {
            /**
             * await is used for promise based error handling
             */

            jobTitle = await this.dropRomanAndNumericalNumbersFor(jobTitle);

            let url = this.url + `/GetCandidateDistributionStats?JobTitle=${jobTitle}&CountryId=${countryId}`;

            if (industries) {
                url += `&Industries=${industries}`;
            }

            if (clientNames) {
                url += `&Companies=${clientNames}`;
            }

            const response = (await this.https.get(url, {
                SSO: this.sso,
                AuthToken: this.token,
            })) as KfTracArya.Response;

            if (this.notSupportedInput(response) || this.internalServerError(response)) {
                return null;
            }

            return response;
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNAUTHORIZED);
        }
    }

    protected notSupportedInput(result) {
        /**
         *
         * Code 628 is not supported input
         *
         * send empty api response in this case
         *
         *  */

        return result.Code === 628;
    }

    dropRomanAndNumericalNumbersFor(spName: string) {
        if (typeof spName !== 'string' || !spName.length) {
            return spName;
        }
        const roman = {
            X: 10,
            V: 5,
            I: 1,
        };

        const found = spName.search('COPY');

        if (found != -1) {
            spName = spName.substr(0, found - 1);
        }
        let i = spName.length - 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const condition = spName[i] == ' ' || roman[spName[i]] || !isNaN(+spName[i]);
            if (condition) {
                i--;
                continue;
            }
            return spName.substr(0, i + 1);
        }
    }
}
