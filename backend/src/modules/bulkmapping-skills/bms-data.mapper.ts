import { Injectable } from '@nestjs/common';
import {
    BulkMappingSkillsStagingDTO,
    BulkMappingSkillsStagingPayload,
} from './bms.interfaces';

@Injectable()
export class BulkMappingSkillsDataMapper {

    createStagingDTOs(itemModificationId: number, payload: BulkMappingSkillsStagingPayload): BulkMappingSkillsStagingDTO {
        const DTOs: BulkMappingSkillsStagingDTO = {
            profiles: [],
            skillComponents: [],
            skillLevels: [],
        };

        DTOs.profiles = payload.successProfileIds.map(id => ({
            ItemModificationID: itemModificationId,
            ClientJobID: Number(id),
        }));

        for (const skill of payload.skills) {
            const skillId = Number(skill.skillId);

            DTOs.skillLevels.push({
                ItemModificationID: itemModificationId,
                JobSubCategoryId: skillId,
                JobLevelDetailOrder: skill.levelId ? Number(skill.levelId) : null,
                SectionDetailOrder: Number(skill.order),
            });

            (skill.dependents || []).forEach((dependent, i) => {
                DTOs.skillComponents.push({
                    ItemModificationID: itemModificationId,
                    JobSubCategoryId: skillId,
                    JobSkillComponentName: dependent.jobSkillComponentName,
                    JobSubCategoryDependantOrder: i + 1,
                    JobSkillComponentCode: dependent.jobSkillComponentCode,
                    JobSkillComponentGUID: dependent.jobSkillComponentGUID
                });
            });
        }

        return DTOs;
    }
}
