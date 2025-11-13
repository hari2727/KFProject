import { Injectable } from '@nestjs/common';
import { BulkMappingSkillsDataService } from './bms-data.service';
import { BulkMappingSkillsDataMapper } from './bms-data.mapper';
import {
    BulkMappingSkillsQuery,
    BulkMappingSkillsStagingPayload,
    BulkMappingSkillsStagingResponse,
} from './bms.interfaces';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { safeNumber } from '../../_shared/safety';

@Injectable()
export class BulkMappingSkillsService {

    constructor(
        protected dataService: BulkMappingSkillsDataService,
        protected dataMapper: BulkMappingSkillsDataMapper,
    ) {}

    @LogErrors()
    async stageSkillComponents(query: BulkMappingSkillsQuery, body: BulkMappingSkillsStagingPayload): Promise<BulkMappingSkillsStagingResponse> {
            const clientId = Math.max(0, Number(query.preferredClientId)) || Math.max(0, Number(query.loggedInUserClientId));
            if (!clientId || clientId < 1) {
                throw `No valid clientId provided`;
            }

            const userId = Number(query.userId);
            if (!userId || userId < 1) {
                throw `No valid userId provided`;
            }

            if (!body.skills || !body.skills.length) {
                throw `No skills provided`;
            }

            if (!body.successProfileIds || !body.successProfileIds.length) {
                throw `No successProfileIds provided`;
            }

            const itemModificationIdResponse = await this.dataService.obtainItemModificationId(clientId, userId);
            if (!itemModificationIdResponse?.length) {
                throw `No itemModificationId found for provided clientId: ${safeNumber(clientId)}`;
            }
            const itemModificationId = itemModificationIdResponse[0].ItemModificationID;
            const DTOs = this.dataMapper.createStagingDTOs(itemModificationId, body);

            await Promise.all([
                this.dataService.insertStagingProfiles(DTOs.profiles),
                this.dataService.insertStagingSkillLevels(DTOs.skillLevels),
                this.dataService.insertStagingSkillComponents(DTOs.skillComponents),
            ]);

            return {
                itemModificationId
            };
    }
}
