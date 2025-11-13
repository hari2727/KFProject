import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import * as mockPost from '../../mock/postCriticalExperiences.json';
import * as mockGet from '../../mock/GETCriticalExperienceAPI.json';
import * as mockGetMetaData from '../../mock/getmetadata.json';
import { Utils } from '../../common/common.utils';
import { Util } from './kfhub-critical-experience.util';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ExperienceBody, RequestType } from './kfhub-critical-experience.interface';
import { ValidationModel } from './kfhub-critical-experience.validation.model';

@Injectable()
export class KfhubCriticalExperienceService {
    async postExperienceData(body: ExperienceBody) {
        const errors = await this.validateExperiences(body, RequestType.POST);
        const flatened = errors.flat(1);
        if (flatened.length > 0) {
            throw Util.templateValidationMessages(flatened);
        } else {
            return await Utils.simulateJson(mockPost);
        }
    }

    async putExperienceData(body: ExperienceBody) {
        const errors = await this.validateExperiences(body, RequestType.PUT);
        const flatened = errors.flat(1);
        if (flatened.length > 0) {
            throw Util.templateValidationMessages(flatened);
        } else {
            return await Utils.simulateJson(mockPost);
        }
    }

    async handleGetRoute(@Query() query) {
        const { mockData, experience } = Util.checkQueryParams(query);
        if (mockData) {
            return await this.getMetaDataForExperiences();
        } else if (experience) {
            return await this.getExperienceData();
        } else {
            const errorMessage = `please provide successProfileId for experience or (outputType=METADATA&type=CRITICAL_EXPERIENCE) for metaData`;

            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    protected async getExperienceData(): Promise<any> {
        return await Utils.simulateJson(mockGet);
    }

    protected async getMetaDataForExperiences() {
        return await Utils.simulateJson(mockGetMetaData);
    }

    protected async validateExperiences(body: ExperienceBody, inputRequestType: RequestType): Promise<any> {
        const { sections } = body;
        Util.reqType = inputRequestType;
        const errors = sections.map(async experince => {
            return await this.getValidations(ValidationModel, experince);
        });
        return await Promise.all(errors);
    }

    protected async getValidations(model, value) {
        const toBeValidated = plainToClass(model, value);

        return await validate(toBeValidated, {
            validationError: { target: false },
        });
    }
}
