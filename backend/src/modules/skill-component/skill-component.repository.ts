import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { toBit, toLocale, toNumber, toStringOr } from '../../_shared/convert';
import { Loggers } from '../../_shared/log/loggers';
import {
    ComponentBaseDBDetails,
    ComponentBaseDetails,
    ComponentDetailsContextSkillDetails,
    ComponentDetailsDBResponse,
    ComponentDetailsUsageCount,
    ComponentSkillDBMapping,
    ComponentsSkillsDBMappings,
    SkillBaseDetails,
    SkillDetailsComponentRevertCount,
    SkillDetailsContextComponentDetails,
    SkillDetailsDBResponse,
    SkillDetailsLevel,
    SkillDetailsUsageCount,
    StagedComponent
} from './skill-component.interface';
import { ComponentUpdateDTO, SkillListItemResponse } from './skill-component.dto';
import { anyTo01 } from '../../common/common.utils';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';
import { isNullish } from '../../_shared/is';
import { AppCode as ec } from '../../app.const';
import { SubcategoryType } from '../responsibilities/responsibilities.interface';

@Injectable()
export class SkillComponentRepository {

    protected logger: LoggerService;

    constructor(
        protected sql: TypeOrmHelper,
        protected loggers: Loggers
    ) {
        this.logger = loggers.getLogger(SkillComponentRepository.name);
    }

    async getSkillListItems(modelGUID: string, modelVersion: string, clientId: number, locale: string): Promise<SkillListItemResponse[]> {
        return this.mapSkillListItemsDBResponse(await this.sql.query(`
                exec CMM.dbo.GetCLSkillModelDetail
                    @InputModelGUID = :modelGuid,
                    @InputModelVersion = :modelVersion,
                    @LCID = :locale,
                    @ClientID = :clientId
            `,
            {
                modelGuid: modelGUID,
                modelVersion: modelVersion,
                locale: toLocale(locale),
                clientId: toNumber(clientId),
            }
        ));
    }

    protected mapSkillListItemsDBResponse(rows: any[]): SkillListItemResponse[] {
        return rows.map(row => ({
            id: toNumber(row.JobSubCategoryID),
            name: row.JobSubCategoryName ?? '',
            categoryName: row.JobCategoryName ?? '',
            isCustom: anyTo01(row.IsCustomJobSubCategory),
            isActive: anyTo01(row.DisplayJobSubCategory ?? 1),
            successProfilesNumber: toNumber(row.CountOfSPUsingSkill),
            coreComponent: {
                name: row.JobSkillComponentName ?? '',
                isCore: anyTo01(row.CoreSupportFlag)
            },
        }))
    }

    async getSkillDetails(skillId: number, clientId: number, locale: string): Promise<SkillDetailsDBResponse> {
        const response = await this.sql.queryDataSets(`
                exec CMM.dbo.GetOneSubCategoryWithLevelsComponents
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @JobSubCategoryID = :skillId
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(locale),
                skillId: toNumber(skillId),
            }
        );

        return {
            details: this.mapSkillCoreDetailsFromDBResponse(response['LEVEL_INFORMATIONS'][0]),
            components: this.mapSkillDetailsComponentsDBResponse(response['SKILL_COMPONENT_DETAILS'] || []),
            levels: this.mapSkillDetailsLevelsDBResponse(response['LEVEL_INFORMATIONS'] || []),
            usageCount: this.mapSkillDetailsUsageCountDBResponse(response['USAGE_COUNT']|| []),
            revertCount: this.mapSkillDetailsRevertCountDBResponse(response['COMPONENT_REVERT_FLAG'] || []),
        };
    }

    async getOriginalSkillComponents(skillId: number, clientId: number, locale: string): Promise<SkillDetailsContextComponentDetails[]> {
        const response = await this.sql.query(`
                exec CMM.dbo.GetSkillStandardComponents
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @JobSubCategoryID = :skillId
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(locale),
                skillId: toNumber(skillId),
            }
        );

        return response.map(row => ({
            id: toNumber(row.JobSkillComponentId),
            name: toStringOr(row.JobSkillComponentName),
            code: toStringOr(row.JobSkillComponentCode),
            isCustom: toBit(row.ComponentIsCustom),
            isActive: toBit(row.isActive),
            isCore: toBit(row.CoreSupportFlag),
            successProfilesNumber: toNumber(row.CountOfSP),
        }));
    }

    async revertSkillComponentsChanges(skillId: number, clientId: number, userId: number): Promise<void> {
        const result = await this.sql.query(`
                exec CMM.dbo.RevertComponentsForSkill
                    @ClientID = :clientId,
                    @UserId = :userId,
                    @JobSubCategoryID = :skillId
            `,
            {
                clientId: toNumber(clientId),
                userId: toNumber(userId),
                skillId: toNumber(skillId),
            }
       );

        if (result[0]?.ExceptionCode !== ec.SUCCESS) {
            throw result[0];
        }
    }

    protected mapSkillCoreDetailsFromDBResponse(row: any): SkillBaseDetails {
        return {
            id: toNumber(row.JobSubCategoryId),
            name: toStringOr(row.JobSubCategoryName),
            originalName: toStringOr(row.JobSubCategoryOriginalName),
            description: toStringOr(row.JobSubCategoryDescription),
            originalDescription: toStringOr(row.JobSubCategoryOriginalDescription),
            jobCategoryId: toNumber(row.JobCategoryId),
            jobFamilyId: toStringOr(row.JobFamilyID),
            jobSubFamilyId: toStringOr(row.JobSubFamilyID),
            isActive: toBit(row.DisplayJobSubCategory),
            isCustom: toBit(row.IsCustomJobSubCategory)
        };
    }

    protected mapSkillDetailsLevelsDBResponse(rows: any[]): SkillDetailsLevel[] {
        return rows.map(row => ({
            id: toNumber(row.JobLevelDetailID),
            description: toStringOr(row.JobLevelDetailDescription),
            originalDescription: toStringOr(row.OriginalJobLevelDescription),
            level: toNumber(row.JobLevelID),
            isCustom: toBit(row.IsCustomLevel),
        } as SkillDetailsLevel));
    }

    protected mapSkillDetailsComponentsDBResponse(rows: any[]): SkillDetailsContextComponentDetails[] {
        return rows.map(row => ({
            id: toNumber(row.JobSkillComponentID),
            name: toStringOr(row.JobSkillComponentName),
            code: toStringOr(row.JobSkillComponentCode),
            guid: toStringOr(row.JobSkillComponentGUID),
            isActive: toBit(row.isActive),
            isCore: toBit(row.CoreSupportFlag),
            isCustom: toBit(row.ComponentIsCustom),
            successProfilesNumber: toNumber(row.NoOfSPUsingComponent),
            mappingId: toNumber(row.JobSkillComponentMappingID),
        } as SkillDetailsContextComponentDetails));
    }

    protected mapSkillDetailsRevertCountDBResponse(rows: any[]): SkillDetailsComponentRevertCount[] {
        return rows.map(row => ({
            revertCount: toNumber(row.Revert)
        } as SkillDetailsComponentRevertCount));
    }

    protected mapSkillDetailsUsageCountDBResponse(rows: any[]): SkillDetailsUsageCount[] {
        return rows.map(row => ({
            profileId: toNumber(row.Profileid),
            profileType: toStringOr(row['Profile type'], ''),
            createdBy: toStringOr(row['Created by']),
            count: toNumber(row.Count)
        } as SkillDetailsUsageCount));
    }

    async initModelUpdates(clientId: number, userId: number, locale:string, modelId: string, modelVersion: string): Promise<void> {
        await this.sql.query(`
                DECLARE @tablevar TABLE (
                    ItemModificationID BIGINT
                )
                insert into CMM.dbo.ItemModificationSubCategory (
                    ItemType,
                    CompetencyModelGUID,
                    CompetencyModelVersion,
                    LCID,
                    ClientID,
                    ModifiedBy,
                    InsertDate,
                    ModificationComplete
                )
                OUTPUT
                    INSERTED.ItemModificationID
                INTO
                    @tablevar
                values (
                    :Type,
                    :ModelId,
                    :ModelVersion,
                    :LCID,
                    :ClientId,
                    :UserID,
                    :TimeStamp,
                    0
                )
                SELECT
                    ItemModificationID AS ItemID
                FROM
                    @tablevar
            `,
            {
                Type: toStringOr(SubcategoryType.TECHNICAL_SKILLS),
                ModelId: toStringOr(modelId)?.trim(),
                ModelVersion: toStringOr(modelVersion)?.trim(),
                LCID: toLocale(locale),
                ClientId: toNumber(clientId),
                UserID: toNumber(userId),
                TimeStamp: new Date().toISOString()
            }
        );
    }

    async initComponentUpdates(skillId: number, clientId: number, userId: number): Promise<number> {
        const result = await this.sql.query(`
                DECLARE @Output TABLE (
                    ItemModificationID BIGINT
                );

                INSERT INTO
                    CMM.dbo.ItemModificationSkillComponent (
                        JobSubCategoryId,
                        ClientID,
                        UserID,
                        StatusID,
                        CreatedOn
                    )
                OUTPUT
                    INSERTED.ItemModificationID
                INTO
                    @Output
                SELECT
                    :skillId,
                    :clientId,
                    :userId,
                    NULL,
                    GETDATE();

                SELECT
                    *
                FROM
                    @Output;
            `,
            {
                skillId: toNumber(skillId),
                clientId: toNumber(clientId),
                userId: toNumber(userId)
            }
        );

        const operationId = toNumber(result?.shift()?.ItemModificationID);
        if (!operationId) {
            throw `Error while obtaining item modification for skill ${toNumber(skillId)} for client ${toNumber(clientId)} for userId ${toNumber(userId)}`;
        }

        return operationId;
    }

    async addComponentUpdates(operationId: number, DTOs: Partial<ComponentUpdateDTO>[]): Promise<void> {
        await this.sql.insert(
            DTOs,
            'CMM.dbo.ItemModificationSkillComponentDetails',
            [
                'ItemModificationID',
                'JobSkillComponentId',
                'JobSkillComponentCode', // non-null for standard
                'JobSkillComponentGUID', // some random stuff for a custom component
                'JobSkillComponentName',
                'IsDeleted',
                'IsActive',
                'CoreSupportFlag',
                'LCID',
                'ActionType'
            ],
            dto => [
                toNumber(operationId),
                toNumber(dto.id),
                toStringOr(dto.code),
                toStringOr(dto.guid),
                toStringOr(dto.name),
                0,
                isNullish(dto.isActive) ? null : toBit(dto.isActive),
                isNullish(dto.isCore) ? null : toBit(dto.isCore),
                toLocale(dto.locale),
                dto.operationType
            ]
        );
    }

    async finalizeComponentUpdates(operationId: number): Promise<void> {
        await this.sql.queryDataSets(`
                exec CMM.dbo.AddUpdateSkillComponents
                    @ItemModificationID = :itemModificationID
            `,
            {
                itemModificationID: toNumber(operationId)
            }
        );
    }


    async getStagedComponents(operationId: number): Promise<StagedComponent[]> {
        return this.mapStagedComponentsDbResponse(await this.sql.query(`
                select
                    *
                from
                    CMM.dbo.ItemModificationSkillComponentDetails
                where
                    ItemModificationID = :itemModificationID
            `,
            {
                itemModificationID: toNumber(operationId)
            }
        ));
    }

    protected mapStagedComponentsDbResponse(rows: any[]): StagedComponent[] {
        return rows.map(row => ({
            id: toNumber(row.JobSkillComponentId),
            code: toStringOr(row.JobSkillComponentCode),
            guid: toStringOr(row.JobSkillComponentGUID),
            name: toStringOr(row.JobSkillComponentName),
            IsDeleted: toBit(row.IsDeleted),
            IsActive: toBit(row.IsActive),
            isCore: toBit(row.CoreSupportFlag),
            isCustom: toBit(row.JobSkillComponentGUID),
            locale: toLocale(row.LCID),
        }));
    }


    async getComponentDetails(componentId: number, clientId: number, locale: string) : Promise<ComponentDetailsDBResponse> {
        const response = await this.sql.queryDataSets(`
                exec CMM.dbo.GetOneSkillComponentDetail
                    @ClientID = :clientId,
                    @LCID = :locale,
                    @JobSkillComponentID = :componentId
            `,
            {
                clientId: toNumber(clientId),
                locale: toLocale(locale),
                componentId: toNumber(componentId),
            }
        );

        return {
            details: this.mapComponentCoreDetailsFromDBResponse(response['SKILL_DETAILS']?.[0] || {}),
            skills: this.mapComponentDetailsSkillsFromDbResponse(response['SKILL_DETAILS'] || []),
            usageCount: this.mapComponentDetailsUsageCountDBResponse(response['COMPONENT_USAGE_COUNT'] || []),
        };
    }

    protected mapComponentCoreDetailsFromDBResponse(row: any): ComponentBaseDetails {
        return {
            id: toNumber(row.JobSkillComponentID),
            name: toStringOr(row.JobSkillComponentName),
            isCustom: toBit(row.IsCustomComponent),
        };
    }

    protected mapComponentDetailsSkillsFromDbResponse(rows: any[]): ComponentDetailsContextSkillDetails[] {
        return rows.map(row => ({
            id: toNumber(row.JobSubCategoryID),
            name: toStringOr(row.JobSubCategoryName),
            categoryName: toStringOr(row.JobCategoryName),
            isActive: toBit(row.isActive),
            isCore: toBit(row.CoreSupportFlag),
            isCustom: toBit(row.IsCustomJobSubCategory),
            successProfilesNumber: toNumber(row.CountOfSPUsingSkill),
        }));
    }

    protected mapComponentDetailsUsageCountDBResponse(rows: any[]): ComponentDetailsUsageCount[] {
        return rows.map(row => ({
            profileId: toNumber(row.Profileid),
            profileType: toStringOr(row['Profile type'], ''),
            createdBy: toStringOr(row['Created by']),
            count: toNumber(row.Count)
        } as ComponentDetailsUsageCount));
    }

    async updateComponentGlobalActiveState(componentId: any, isActive: any, clientId: number, skillId?: any) : Promise<void> {
        await this.sql.query(`
                exec CMM.dbo.UpdateComponentToggle
                    @ClientID = :clientId,
                    @UserId = 0,
                    @JobSkillComponentId = :componentId,
                    @JobSubCategoryId = :skillId,
                    @isActive = :isActive
            `,
            {
                clientId: toNumber(clientId),
                componentId: toNumber(componentId),
                isActive: toBit(isActive),
                skillId: toNumber(skillId)
            }
        );
    }


    async getComponentsSkillsMappings(modelGuid: string, modelVersion: string, clientId: number, locale: string): Promise<ComponentsSkillsDBMappings> {
        const resultSets = await this.sql.queryDataSets(`
                exec CMM.dbo.GetCLSkillComponentDetail
                    @InputModelGUID = :modelGuid,
                    @InputModelVersion = :modelVersion,
                    @LCID = :locale,
                    @ClientID = :clientId
            `,
            {
                modelGuid: modelGuid,
                modelVersion: modelVersion,
                locale: toLocale(locale),
                clientId: toNumber(clientId),
            }
        );

        const components: ComponentBaseDBDetails[] = (resultSets['COMPONENTS_LIST'] || []).map((row: any) => ({
            id: toNumber(row.JobSkillComponentId),
            name: toStringOr(row.JobSkillComponentName),
            code: toStringOr(row.JobSkillComponentCode),
            guid: toStringOr(row.JobSkillComponentGUID),
            isCustom: toBit(row.ComponentIsCustom),
            successProfilesNumber: toNumber(row.NoOfSPUsingComponent),
            isActive: toNumber(row.IsActive)
        } as ComponentBaseDBDetails));

        const componentsSkillMappings: ComponentSkillDBMapping[] = (resultSets['COMPONENT_SKILL_MAPPING'] || []).map((row: any) => ({
            componentId: toNumber(row.JobSkillComponentID),
            skillId: toNumber(row.JobSubCategoryID)
        } as ComponentSkillDBMapping));

        return {
            components,
            mappings: componentsSkillMappings
        };
    }

}
