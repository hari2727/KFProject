import { Injectable } from '@nestjs/common';
import {
    GetIgSkillQuestionsOptions,
    GetIgSkillsDetailsOptions,
    GetSuccessProfileIGSkillsQuestionsOptions,
    IgSkillDTO,
    IgSkillQuestionDTO,
    IgSkillStagingQuestionDTO,
    SetIgSkillOperationDetailsOptions,
    SuccessProfileIGSkillQuestionDTO,
} from './skills-service.types';
import {
    GetIGSkillsDetailsCountSqlDTO,
    GetIGSpecificSkillDetailSqlDTO,
    GetSuccessProfileIGSkillQuestionSqlDTO,
} from './skills-data-service.types';
import { toBit, toLocale, toNumber } from '../../../_shared/convert';
import { TypeOrmHelper } from '../../../_shared/db/typeorm.helper';

@Injectable()
export class IgSkillsDataService {

    constructor(protected sql: TypeOrmHelper) {
    }

    protected shiftDate(date: Date, ms: number): Date {
        date.setMilliseconds(date.getMilliseconds() + ms);
        return date;
    }

    async insertStagingSkillQuestions(dtos: IgSkillStagingQuestionDTO[]): Promise<void> {
        const modifiedOn = new Date();

        await this.sql.insert(
            dtos,
            'SuccessProfile.dbo.ItemModificationIGSkillDetails',
            [
                'ItemModificationIGSkillID',
                'ClientID',
                'JobSubCategoryID',
                'JobSubCategoryCde',
                'JobSubCategoryName',
                'JobSubCategoryDescription',
                'JobLevelDetailOrder',
                'ItemType',
                'ItemCode',
                'ItemDescription',
                'ItemEnabled',
                'ModifiedOn',
                'ModifiedBy',
            ],
            dto => [
                toNumber(dto.operationId),
                toNumber(dto.clientId),
                toNumber(dto.skillId),
                dto.skillCode,
                dto.skillName,
                dto.skillDescription,
                toNumber(dto.level),
                dto.type,
                dto.code,
                dto.description,
                toBit(dto.isEnabled),
                this.shiftDate(modifiedOn, 1100).toISOString(),
                toNumber(dto.editorId),
            ]
        );
    }

    async finalizeSkillQuestionsChange(operationId: number): Promise<void> {
        await this.sql.query(`
                 exec SuccessProfile.dbo.UploadJobSubCategoryIGSkillDetails
                     @InItemModificationIGSkillID = :operationId
            `,
            {
                operationId: Number(operationId),
            }
        );
    }

    async addSkillOperationDetails(options: SetIgSkillOperationDetailsOptions): Promise<number> {
        const response = await this.sql.query(`
                DECLARE @Output TABLE (
                    ItemModificationIGSkillID BIGINT
                );
                INSERT INTO
                    SuccessProfile.dbo.ItemModificationIGSkill (
                        ClientID,
                        CreatedOn,
                        JobSubCategoryID,
                        ISReverted
                    )
                OUTPUT
                    INSERTED.ItemModificationIGSkillID
                INTO
                    @Output
                SELECT
                    :clientId,
                    :createdOn,
                    :skillId,
                    :isReverted
                ;
                SELECT * FROM @Output;
            `,
            {
                clientId: toNumber(options.clientId),
                skillId: toNumber(options.skillId),
                isReverted: toBit(options.isReverted),
                createdOn: new Date().toISOString(),
            }
        );
        if (!response?.length) {
            throw `No ItemModificationIGSkillID found for provided input`;
        }
        return Number(response[0].ItemModificationIGSkillID);
    }

    async getSkillDTO(options: GetIgSkillsDetailsOptions): Promise<IgSkillDTO> {
        return (await this.getSkillDTOs(options)).find(i => !options.skillId || i.id === options.skillId);
    }

    async getSkillDTOs(options: GetIgSkillsDetailsOptions): Promise<IgSkillDTO[]> {
        return this.mapSkillDTOs(await this.sql.query(`
                exec SuccessProfile.dbo.GetIGSkillsDetailsCount
                    @InClientID = :clientId,
                    @InJobSubCategoryID = :jobSubCategoryID,
                    @InSkillsLinkedToCustomSP = :linkedToCustomSuccessProfile
            `,
            {
                clientId: toNumber(options.clientId),
                jobSubCategoryID: toNumber(options.skillId),
                linkedToCustomSuccessProfile: options.linkedToCustomSuccessProfile ? 1 : null
            }
        ));
    }

    protected mapSkillDTOs(dtos: GetIGSkillsDetailsCountSqlDTO[]): IgSkillDTO[] {
        return dtos.map(i => ({
            clientId: Number(i.ClientId),
            id: Number(i.JobSubCategoryID),
            code: String(i.JobSubCategoryCode),
            name: i.JobSubCategoryName || '',
            description: i.JobSubCategoryDescription || '',
            negativeBehaviourCount: Number(i.Negative_Behaviour) || 0,
            positiveBehaviourCount: Number(i.Positive_Behaviour) || 0,
            questionareCount: Number(i.Questionare) || 0,
            modifiedOn: Date.parse(i.LastModifiedDate),
            isCustom: Boolean(Number(i.IsCustomJobSubCategory)),
            isActive: true,
        }));
    }

    async getSkillQuestionDTOs(options: GetIgSkillQuestionsOptions): Promise<IgSkillQuestionDTO[]> {
        return this.mapSkillQuestionDTOs(await this.sql.query(
            options.showStandardData
                ? `
                    exec SuccessProfile.dbo.GetIGSpecificStandardSkillDetail
                        @InClientID = :clientId,
                        @InJobSubCategoryID = :skillId
                ` : `
                    exec SuccessProfile.dbo.GetIGSpecificSkillDetail
                        @InClientID = :clientId,
                        @InJobSubCategoryID = :skillId
            `,
            {
                clientId: toNumber(options.clientId),
                skillId: toNumber(options.skillId)
            }
        ));
    }

    protected mapSkillQuestionDTOs(dtos: GetIGSpecificSkillDetailSqlDTO[]): IgSkillQuestionDTO[] {
        return dtos.map(i => ({
            clientId: Number(i.ClientId),
            skillId: Number(i.JobSubCategoryID),
            id: Number(i.JobSubCategoryIGSkillDetailsID),
            level: Number(i.JobLevelDetailOrder),
            type: String(i.ItemType),
            code: i.ItemCode || null,
            description: i.ItemDescription || '',
            status: i.Status,
            isActive: Boolean(Number(i.ItemEnabled)),
            isCustom: Boolean(Number(i.IsCustomIGData)),
            modifiedOn: i.LastModifiedDate ? Date.parse(i.LastModifiedDate) : null,
        }));
    }


    async getSuccessProfileIGSkillsQuestionDTOs(options: GetSuccessProfileIGSkillsQuestionsOptions): Promise<SuccessProfileIGSkillQuestionDTO[]> {
        return this.mapSuccessProfileIGSkillsQuestionDTOs(await this.sql.query(`
                exec SuccessProfile.dbo.GetIGSkillDetailForProfile
                    @InClientJobID = :successProfileId,
                    @InClientID = :clientId,
                    @InJobSubcategoryIDs = :skillIds,
                    @InLCID = :locale
            `,
            {
                successProfileId: toNumber(options.successProfileId),
                clientId: toNumber(options.clientId),
                skillIds: options.skillIds.map(Number).join(','),
                locale: toLocale(options.locale)
            }
        ));
    }

    protected mapSuccessProfileIGSkillsQuestionDTOs(dtos: GetSuccessProfileIGSkillQuestionSqlDTO[]): SuccessProfileIGSkillQuestionDTO[] {
        return dtos.map(i => ({
            skillId: Number(i.JobSubCategoryID),
            type: String(i.ItemType),
            description: i.ItemDescription || '',
        }));
    }

}
