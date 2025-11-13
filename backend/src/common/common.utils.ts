import { Injectable } from '@nestjs/common';
import { TransformOptions } from 'class-transformer';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { CmsApi, CmsEnvs } from '../modules/interviewguide/model/ig-cms-enum';
import { maxLambdaAwaitTimeout } from './common.const';
import { KfPermissions, KfRestrictions } from './common.interface';
import { ConfigService } from '../_shared/config/config.service';
import { toBoolean } from '../_shared/convert';

export const toPropertyName = (value: string): string =>
    value
        .split(/[^A-Z\d]+/i)
        .map((s, i) => (s.length ? (i ? s.charAt(0).toUpperCase() : s.charAt(0).toLowerCase()) + (s.length > 1 ? s.slice(1).toLowerCase() : '') : s))
        .join('');

export const clone = <T = any>(value: T): T => JSON.parse(JSON.stringify(value));

export const options: TransformOptions = { toClassOnly: true };

export const okResponse = {
    StatusCode: 200,
    ExceptionCode: 'RES.20000',
};

export class Utils {
    static simulateJson = (inputData: any): Promise<any> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(inputData);
            }, 200);
        });
    };
    static getMd5 = (val: any) => createHash('md5').update(String(val)).digest('hex');
}

export const find = (givenArray = [], key: string, value: any): { found: boolean; index?: number } => {
    for (let i = 0; i < givenArray.length; i++) {
        if (givenArray[i][key] === value) {
            return { index: i, found: true };
        }
    }
    return { found: false };
};

@Injectable()
export class RequestCommon {
    protected env: string;

    constructor(
        protected configService: ConfigService,
    ) {
        this.env = CmsEnvs[this.configService.get('APP_ENV')];
    }

    getSuccessProfileBaseUrl() {
        return this.getKfhubApiBaseUrl() + '/v1/hrms/successprofiles';
    }

    getJobDescriptionBaseUrl() {
        return this.getKfhubApiBaseUrl() + '/v1/hrms/jobdescriptions';
    }

    getKfhubApiBaseUrl() {
        return this.configService.get('URL_KFHUB_API_BASE');
    }

    getKfhubApiTarcBaseUrl() {
        return this.configService.get('URL_KFHUB_TARC_REPORT_API_BASE');
    }

    getKfiCmsAuthApiUrl() {
        return this.configService.get('CMS_API_BASE') + '/' + this.env + CmsApi.AUTHENTICATE;
    }

    getKfiCmsClientJobDecisionApiUrl() {
        return this.configService.get('CMS_API_BASE') + '/' + this.env + '/secure/scaas/kfas/bic/sliders-translation';
    }

    getSuccessProfileUrl(id?: number) {
        return this.getSuccessProfileBaseUrl() + (id ? `/${id}` : '');
    }

    getJobDescriptionsUrl(id?: number) {
        return this.getJobDescriptionBaseUrl() + (id ? `/${id}` : '');
    }

    getUrlForCachedJsonRemoval(clientId: number, ids: number) {
        return this.getSuccessProfileBaseUrl() + '/json/full?clientId=' + clientId + '&ids=' + ids;
    }

    getPermissionsUrl() {
        return this.getSuccessProfileBaseUrl() + '/permissions';
    }

    getTraitsAndDriversApiUrl() {
        return this.getKfhubApiBaseUrl() + '/v1/hrms/assessments/actions/calculateassessmentscoringattributes';
    }

    getKfhubApiHeaders(authToken: string, psSessionId) {
        const hasSessionId = psSessionId ? { 'ps-session-id': psSessionId } : undefined;
        return {
            authToken,
            ...hasSessionId,
            'application-name': 'PRODUCTS_HUB',
            applicationName: 'TALENT_ARCHITECT',
            'Content-Type': 'application/json',
        };
    }

    checkUAMPointsRestrictions = ({ hasExecutiveAccessByPointValue, hasPointValueAccess, pointValue = null }): KfRestrictions => {
        const isExec = hasExecutiveAccessByPointValue && hasPointValueAccess ? 1 : !hasExecutiveAccessByPointValue && hasPointValueAccess ? 2 : 0;
        return { isExec, pointValue };
    };
}

export const generateUUIDv4 = () => {
    const rng = () => {
        var _crypto = _interopRequireDefault(require('crypto'));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }
        const rnds8Pool = new Uint8Array(256);
        let poolPtr = rnds8Pool.length;
        function rng() {
            if (poolPtr > rnds8Pool.length - 16) {
                _crypto.default.randomFillSync(rnds8Pool);

                poolPtr = 0;
            }
            return rnds8Pool.slice(poolPtr, (poolPtr += 16));
        }
        return rng();
    };

    const validate = (val: string) => {
        const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        function validateUuid(uuid) {
            return typeof uuid === 'string' && regex.test(uuid);
        }
        return validateUuid(val);
    };

    const stringify = (vals: Uint8Array) => {
        /* Convert 16 byte arr to UUID string format of mask:
        XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX*/
        const byteToHex = [];

        for (let i = 0; i < 256; ++i) {
            byteToHex.push((i + 0x100).toString(16).substr(1)); //@TODO
        }

        function stringify(arr, offset = 0) {
            const uuid = (
                byteToHex[arr[offset + 0]] +
                byteToHex[arr[offset + 1]] +
                byteToHex[arr[offset + 2]] +
                byteToHex[arr[offset + 3]] +
                '-' +
                byteToHex[arr[offset + 4]] +
                byteToHex[arr[offset + 5]] +
                '-' +
                byteToHex[arr[offset + 6]] +
                byteToHex[arr[offset + 7]] +
                '-' +
                byteToHex[arr[offset + 8]] +
                byteToHex[arr[offset + 9]] +
                '-' +
                byteToHex[arr[offset + 10]] +
                byteToHex[arr[offset + 11]] +
                byteToHex[arr[offset + 12]] +
                byteToHex[arr[offset + 13]] +
                byteToHex[arr[offset + 14]] +
                byteToHex[arr[offset + 15]]
            ).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
            if (!validate(uuid)) {
                throw TypeError('stringified UUID result is invalid');
            }
            return uuid;
        }
        return stringify(vals);
    };

    function v4() {
        const rnds = rng();

        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80; // Copy bytes to buffer, if provided

        return stringify(rnds);
    }
    return v4();
};

export class MssqlUtils {
    static insertBigSet = async (valuesArr: {}[], context: Repository<any>, insertFunction = 'insert', paramsLimit = 1000) => {
        const rowsBatch = Math.floor(paramsLimit / Object.keys(valuesArr[0]).length);
        const cycles = Math.ceil(valuesArr.length / rowsBatch);
        for (let i = 0; i < cycles; i++) {
            await context[insertFunction](valuesArr.slice(i * rowsBatch, (i + 1) * rowsBatch));
        }
    };

    static throwErrorOnIncorrectDbResponse(dbResponse: unknown): void {
        if (Array.isArray(dbResponse) && dbResponse?.length === 1 && dbResponse[0].StatusCode === 1) {
            const errorResponse: any = dbResponse[0];
            throw new Error(errorResponse.ExceptionCode);
        }
    }
}

export const isNotAWSAPIGatewayTimeOut = (startDate: Date): boolean => new Date().getTime() - startDate.getTime() < maxLambdaAwaitTimeout;

export const checkSpecialCharacter = (str: string): boolean => {
    const specialChars = /[<>""%;#@=]/;
    return specialChars.test(str);
};

export const escapeSingleQuote = (str): string => {
    return str ? str.replace("'", "'") : str;
};

export const validateQueryParams = (query: any): boolean =>
    Object.keys(query).some(key =>
        key === 'preferredClientId'
            ? !/^[1-9]\d*$/.test(query[key])
            : key === 'preferredLocale'
            ? !isValidLocale(query[key])
            : key === 'outputType'
            ? !query[key]
            : key === 'modelVersion'
            ? !query[key]
            : key === 'subCategoryIds'
            ? query[key].split('|').some(i => !/^[0-9]\d*$/.test(i))
            : false,
    );

export const anyTo01 = (value: any): 1 | 0 =>
    Number(toBoolean(value)) as (1 | 0);

export const getUAMPointRestriction = (permissions: KfPermissions): KfRestrictions => {
    const isExec = !permissions.hasPointValueAccess ? 0 : permissions.hasExecutiveAccessByPointValue ? 1 : 2;
    return { isExec, pointValue: permissions.pointValue };
};

export const isValidLocale = (value: string): boolean =>
    /^[a-z]{2}(-[a-z]{2})?$/i.test(value);


export const stripObjectKeys = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>  => {
    const newObj = {} as Omit<T, K>;
    for (const [key, value] of Object.entries(obj)) {
        if (!keys.includes(key as K)) {
            newObj[key] = value as T[K];
        }
    }
    return newObj;
}