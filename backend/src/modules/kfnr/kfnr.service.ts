import { BadRequestException, Injectable } from '@nestjs/common';
import {
    KfTarcSuccessProfilesDetailsService
} from '../successprofiles-details/kftarc-success-profiles-details.service';
import { AppCode as ec } from '../../app.const';
import { GetSpId, SuccessProfileDetailRequest } from './kfnr.interface';
import { KfnrRepository } from './kfnr.repository';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class KfnrService {

    constructor(protected kfnrRepository: KfnrRepository, protected kfSuccessProfileDetailService: KfTarcSuccessProfilesDetailsService) {}

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getSpId(bicCode: string, versionNo: string): Promise<GetSpId.Response> {
        this.validateQueryParams(bicCode, versionNo);
            const [dbRes] = await this.kfnrRepository.getSpIdByBicCodeAndVersionNo(bicCode, versionNo);
            return {
                spId: dbRes?.SPID ?? null,
            };
    }

    protected validateQueryParams(bicCode: string, versionNo: string): void {
        if (!/^[a-zA-Z0-9]+$/.test(bicCode)) {
            throw new BadRequestException('Provide valid BIC code');
        }
        if (!versionNo || !/^\d*\.?\d*$/.test(versionNo)) {
            throw new BadRequestException('provide valid version number');
        }
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    async getClientJobDetail(jobCode: string, grade: string, request: SuccessProfileDetailRequest): Promise<Object> {
            const [dbRes] = await this.kfnrRepository.getClientJobIdByJobCodeAndGrade(jobCode, grade);
            if (dbRes && dbRes?.ClientJobID) {
                return await this.kfSuccessProfileDetailService.getSuccessProfileDetails(dbRes.ClientJobID, request);
            }
            return null;
    }
}
