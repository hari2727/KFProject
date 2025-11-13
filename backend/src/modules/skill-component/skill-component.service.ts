import { Injectable } from '@nestjs/common';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { ComponentListItemResponse, ComponentUpdateDTO, SkillListItemResponse } from './skill-component.dto';
import {
    ComponentDetailsResponse,
    CreateComponentOptions,
    CreateComponentsPayload,
    CreateComponentsResponse,
    SkillComponentsLinksPayload,
    SkillDetailsResponse,
    SkillOriginalComponentsResponse,
    StagedComponent
} from './skill-component.interface';
import { SkillComponentRepository } from './skill-component.repository';
import { isNullish } from '../../_shared/is';
import { toLocale, toNumber } from '../../_shared/convert';
import { ComponentBulkOperation, ComponentBulkOperationInput } from './skill-component.const';

@Injectable()
export class SkillComponentService {

    constructor(
        protected repo: SkillComponentRepository,
    ) {
    }

    @LogErrors()
    async getSkillListItems(modelGUID: string, modelVersion: string, clientId: number, locale: string): Promise<SkillListItemResponse[]> {
        return await this.repo.getSkillListItems(modelGUID, modelVersion, clientId, locale);
    }

    @LogErrors()
    async getSkillDetails(skillId: number, clientId: number, locale: string): Promise<SkillDetailsResponse> {
        const data = await this.repo.getSkillDetails(skillId, clientId, locale);
        return {
            ...data.details,
            components: data.components,
            levels: data.levels,
            revertCount: data.revertCount.shift().revertCount,
            usageCount: data.usageCount,
        };
    }

    @LogErrors()
    async getOriginalSkillComponents(skillId: number, clientId: number, locale: string): Promise<SkillOriginalComponentsResponse> {
        const data = await this.repo.getOriginalSkillComponents(skillId, clientId, locale);
        return {
            components: data
        };
    }

    @LogErrors()
    async revertSkillChanges(skillId: number, clientId: number, userId: number): Promise<any> {
        await this.repo.revertSkillComponentsChanges(skillId, clientId, userId);
        return {
            skillId
        };
    }

    @LogErrors()
    async linkSkillsAndComponents(payload: SkillComponentsLinksPayload, clientId: number, userId: number, locale: string, modelId: string, modelVersion: string): Promise<void> {
        locale = toLocale(locale);

        for (const [ skillId, componentsMap ] of Object.entries(payload.skills)) {

            const componentActivityState: { [componentId: string]: number } = {};
            const DTOs: ComponentUpdateDTO[] = [];

            for (const [ componentId, item ] of Object.entries(componentsMap)) {

                if (!isNullish(item.isActive)) {
                    componentActivityState[componentId] = item.isActive;
                }

                if (!isNullish(item.isCore)) { // add item.name once you need to update title
                    const actionType = toNumber(item.actionType);
                    DTOs.push({
                        id: toNumber(componentId),
                        name: item.name ?? null,
                        code: item.code ?? null,
                        guid: item.guid ?? null,
                        isActive: item.isActive ?? null,
                        isCore: item.isCore ?? null,
                        locale: locale,
                        operationType:
                            actionType === ComponentBulkOperationInput.ADD ? ComponentBulkOperation.ADD :
                                ComponentBulkOperation.EDIT
                    });
                }
            }

            if (DTOs.length) {
                await this.performComponentUpdates(toNumber(skillId), clientId, userId, locale, modelId, modelVersion, DTOs);
            }

            for (const componentId in componentActivityState) {
                await this.repo.updateComponentGlobalActiveState(componentId, componentActivityState[componentId], clientId, skillId);
            }
        }
    }

    @LogErrors()
    async createComponents(payload: CreateComponentsPayload, clientId: number, userId: number, locale: string, modelId:string, modelVersion: string): Promise<CreateComponentsResponse> {
        const skillId = toNumber(payload.skillId);

        const DTOs: Partial<ComponentUpdateDTO>[] = [];
        for (const item of payload.components || []) {
            DTOs.push({
                name: item.name,
                isActive: item.isActive,
                isCore: item.isCore,
                locale: locale,
                operationType: ComponentBulkOperation.ADD
            });
        }

        let components: StagedComponent[] = [];

        if (DTOs.length) {
            const operationId = await this.performComponentUpdates(skillId, clientId, userId, locale, modelId, modelVersion, DTOs);
            components = await this.repo.getStagedComponents(operationId);
        }
        return {
            skillId,
            components
        };
    }

    @LogErrors()
    async getComponentListItems(modelGUID: string, modelVersion: string, clientId: number, locale: string): Promise<ComponentListItemResponse[]> {
        const response = await this.repo.getComponentsSkillsMappings(modelGUID, modelVersion, clientId, locale);

        return response.components.map(component => {
            const skillsIds: number[] = response.mappings
                    .filter(skill => skill.componentId == component.id)
                    .map(data => data.skillId);

            return {
                id: component.id,
                name: component.name,
                code: component.code,
                guid: component.guid,
                isCustom: component.isCustom,
                successProfilesNumber: component.successProfilesNumber,
                isActive : component.isActive,
                skillsIds
            } as ComponentListItemResponse;
        });
    }

    @LogErrors()
    async getComponentDetails(componentId: number, clientId: number, locale: string) : Promise<ComponentDetailsResponse> {
        const data = await this.repo.getComponentDetails(componentId, clientId, locale);
        return {
            ...data.details,
            skills: data.skills,
            usageCount: data.usageCount
        };
    }

    @LogErrors()
    async updateComponentDetails(componentId: number, payload: CreateComponentOptions, clientId: number, userId: number, locale: string) : Promise<void> {
        if (!isNullish(payload.isActive)) {
            await this.repo.initModelUpdates(clientId, userId, locale, payload.modelGUID, payload.modelVersion);
            await this.repo.updateComponentGlobalActiveState(componentId, payload.isActive, clientId);
        }
    }

    protected async performComponentUpdates(skillId: number, clientId: number, userId: number, locale: string, modelId:string, modelVersion:string, DTOs: Partial<ComponentUpdateDTO>[]): Promise<number> {
        await this.repo.initModelUpdates(clientId, userId, locale, modelId, modelVersion);
        const operationId = await this.repo.initComponentUpdates(skillId, clientId, userId);
        await this.repo.addComponentUpdates(operationId, DTOs);
        await this.repo.finalizeComponentUpdates(operationId);
        return operationId;
    }

}
