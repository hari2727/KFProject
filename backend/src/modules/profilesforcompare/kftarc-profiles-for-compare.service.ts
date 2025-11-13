import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { RequestCommon } from '../../common/common.utils';
import {
    ProfileCompareQuery,
    ProfileMatchAndCompareDBResponse,
    ProfileMatchAndCompareResponse
} from './kftarc-profiles-for-compare.interface';
import { KfTarcProfilesForCompareRepository } from './kftarc-profiles-for-compare.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../_shared/https/https.service';
import { ConfigService } from '../../_shared/config/config.service';
import { Loggers } from '../../_shared/log/loggers';

@Injectable()
export class KfTarcProfilesForCompareService extends RequestCommon {

    protected logger: LoggerService;

    constructor(
        protected https: HttpsService,
        protected kfProfileCompareRepository: KfTarcProfilesForCompareRepository,
        protected configService: ConfigService,
        protected loggers: Loggers,
    ) {
        super(configService);
        this.logger = loggers.getLogger(KfTarcProfilesForCompareService.name);
    }

    async getJobsInBulk(query, request) {
        const token = String(request.headers.authtoken);
        const psSessionId = request.headers['ps-session-id'];

        const successprofileIds = query.successprofileIds ? query.successprofileIds.split('|') : query.successprofileIds;
        if (!successprofileIds || successprofileIds.length > 5) {
            throw new BadRequestException('Number of jobs should be < 5');
        }

        const headers = this.getKfhubApiHeaders(token, psSessionId);

        return await Promise.all(
            successprofileIds.map(
                id => this.https.get(this.getSuccessProfileUrl(id), headers)
            )
        );
    }

    @LogErrors()
    async getJobRoleTypeById(query: ProfileCompareQuery): Promise<ProfileMatchAndCompareResponse[]> {
        const profileMatchCompareDBResponse: ProfileMatchAndCompareDBResponse[] =
            await this.kfProfileCompareRepository.getJobRoleByTypeId(query);
        return this.mapMatchAndCompareDBResponseToResponse(profileMatchCompareDBResponse);
    }

    @LogErrors()
    protected mapMatchAndCompareDBResponseToResponse(profileMatchAndCompareDBResponse: ProfileMatchAndCompareDBResponse[]): ProfileMatchAndCompareResponse[] {
        return (profileMatchAndCompareDBResponse || []).map(item => ({
            id: item?.ClientJobID?.toString(),
            title: item.JobName,
            standardHayGrade: item?.HayReferenceLevel?.toString(),
            shortProfile: item.ShortProfile,
            levelName: item.KFManagementName,
            profileType: item.LevelType,
        }));
    }

}
