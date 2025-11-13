import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import {
    JobPropertiesByIDData,
    JobPropertiesListData,
    JobPropertiesStatusEnum,
    JobProperty,
    JobPropertyKeys,
    JobPropertyQueryResponse,
    JobPropertyRequest,
    JobPropertyValueMap,
    QueryParams,
    SubProperty,
} from './job-properties.interface';
import { JobPropertyRepository } from './job-properties.repository';
import { JobPropertyTransformer } from './job-properties.transformer';
import { Loggers } from '../../_shared/log/loggers';
import { safeNumber } from '../../_shared/safety';

@Injectable()
export class JobPropertyService {
    protected logger: LoggerService;

    constructor(
        private readonly jobPropertyRepository: JobPropertyRepository,
        private readonly jobPropertyTransformer: JobPropertyTransformer,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(JobPropertyService.name);
    }

    public async getAllJobPropertiesByClientId(clientId: number): Promise<JobPropertiesListData> {
        const [dbResponse, jobPropertiesPublishStatus] = await Promise.all([
            this.jobPropertyRepository.getAllJobPropertiesByClientId(clientId),
            this.jobPropertyRepository.getCurrentStatusOfJobProperties(clientId),
        ]);
        const transformedProperties = this.jobPropertyTransformer.transform(dbResponse);
        return {
            status: jobPropertiesPublishStatus,
            jobProperties: transformedProperties,
        };
    }

    public async getJobPropertiesByJobPropertyId(clientId: number, jobPropertyId: string): Promise<JobPropertiesByIDData> {
        const dbResponse = await this.jobPropertyRepository.getJobPropertiesByJobPropertyId(clientId, jobPropertyId);
        const transformedProperties = this.jobPropertyTransformer.transform(dbResponse);
        return {
            jobProperties: transformedProperties,
        };
    }

    public async publishJobProperties(clientId: number, locale: string, userId: number): Promise<void> {
        await this.jobPropertyRepository.publishJobProperties(clientId, locale, userId);
    }

    async updateJobProperties(query: QueryParams, jobPropertyRequest: JobPropertyRequest): Promise<JobPropertiesListData> {
        let jobPropertyList: JobPropertiesListData;
        let jobPropertyMap: JobPropertyValueMap = {
            UpdateJobProperties: [],
            InsertSubProperties: [],
            UpdateSubProperties: [],
        };

        if (jobPropertyRequest?.jobProperties) {
            this.logger.log(`Updating job properties`);
            jobPropertyRequest.jobProperties.forEach(jobProperty => {
                if (jobProperty?.id && jobProperty.id !== 0) {
                    this.logger.debug(`Updating job property with ID: ${safeNumber(jobProperty.id)}`);
                    const updateJobProperty = this.convertJobPropertyReqToJobProperty(jobProperty);
                    jobPropertyMap[JobPropertyKeys.UPDATE_JOB_PROPERTIES].push(updateJobProperty);
                    this.updateSubProperty(jobProperty.props, jobPropertyMap, updateJobProperty);
                } else {
                    this.logger.debug(`Inserting job property with ID: ${safeNumber(jobProperty.id)}`);
                    const insertJobProperty = this.convertJobPropertyReqToJobProperty(jobProperty);
                    this.jobPropertyRepository.insertJobProperties(query, insertJobProperty);
                    this.updateSubProperty(jobProperty.props, jobPropertyMap, insertJobProperty);
                }
            });
            // Call to repository to insert/update & delete the job properties and sub properties
            await this.updateJobPropertiesList(query, jobPropertyMap);
            await this.deleteJobPropertiesList(jobPropertyMap);
            await this.insertSubPropertyList(query, jobPropertyMap);
            await this.updateSubPropertyList(query, jobPropertyMap);
            jobPropertyList = await this.insertItemModification(query);
        }
        return jobPropertyList;
    }

    private updateSubProperty(subProperties: SubProperty[], jobPropertyMap: JobPropertyValueMap, jobProperty: JobProperty): void {
        // Add the sub property to the `INSERT_SUB_PROPERTIES` array
        if (subProperties && subProperties.length > 0) {
            subProperties.forEach(subProp => {
                if (subProp?.name && subProp?.id && subProp.id !== 0) {
                    const updateSubProperty = this.convertSubPropertyReqToSubProperty(subProp);
                    updateSubProperty.jobPropertyId = jobProperty?.id;
                    updateSubProperty.isActive = jobProperty?.isActive;
                    jobPropertyMap[JobPropertyKeys.UPDATE_SUB_PROPERTIES].push(updateSubProperty);
                } else if (subProp?.name) {
                    const insertSubProperty = this.convertSubPropertyReqToSubProperty(subProp);
                    insertSubProperty.jobPropertyId = jobProperty?.id;
                    insertSubProperty.isActive = true;
                    jobPropertyMap[JobPropertyKeys.INSERT_SUB_PROPERTIES].push(insertSubProperty);
                }
            });
        }
    }

    private convertJobPropertyReqToJobProperty(jobProperty: JobProperty): JobProperty {
        return {
            id: jobProperty.id,
            name: jobProperty.name,
            isActive: jobProperty.isActive,
            isRequired: jobProperty.isRequired,
            isMultiSelected: jobProperty.isMultiSelected,
            isDeleted: jobProperty.isDeleted,
            code: jobProperty.code,
            displayOrder: jobProperty.displayOrder,
        };
    }

    private convertSubPropertyReqToSubProperty(subProperty: SubProperty): SubProperty {
        return {
            id: subProperty.id,
            name: subProperty.name,
            noOfSuccessProfiles: subProperty.noOfSuccessProfiles,
            displayOrder: subProperty.displayOrder,
        };
    }

    private async updateJobPropertiesList(query: QueryParams, jobPropertyMap: JobPropertyValueMap): Promise<void> {
        const updateJobProperties: JobProperty[] = jobPropertyMap[JobPropertyKeys.UPDATE_JOB_PROPERTIES];
        if (updateJobProperties && updateJobProperties.length > 0) {
            //call the repository to update the job properties
            await Promise.all(
                updateJobProperties.map(updateJobProperty =>
                    this.jobPropertyRepository.updateJobProperties(query, updateJobProperty)
                ),
            ).catch(err => {
                this.logger.error('Error updating job properties', err);
                throw err;
            });
        }
    }

    private async insertSubPropertyList(query: QueryParams, jobPropertyMap: JobPropertyValueMap) {
        const insertSubProperties: SubProperty[] = jobPropertyMap[JobPropertyKeys.INSERT_SUB_PROPERTIES];
        await this.jobPropertyRepository.insertSubProperties(query, insertSubProperties);
    }

    private async updateSubPropertyList(query: QueryParams, jobPropertyMap: JobPropertyValueMap) {
        const subProperties: SubProperty[] = jobPropertyMap[JobPropertyKeys.UPDATE_SUB_PROPERTIES];
        if (subProperties && subProperties.length > 0) {
            //call the repository to update the sub properties
            await Promise.all(
                subProperties.map(updateSubProperty =>
                    this.jobPropertyRepository.updateSubProperties(query, updateSubProperty)
                ),
            ).catch(err => {
                this.logger.error('Error updating job SubProperties', err);
                throw err;
            });
        }
    }

    private async deleteJobPropertiesList(jobPropertyMap: JobPropertyValueMap) {
        const jobProperties: JobProperty[] = jobPropertyMap[JobPropertyKeys.UPDATE_JOB_PROPERTIES];
        const subProperties: SubProperty[] = jobPropertyMap[JobPropertyKeys.UPDATE_SUB_PROPERTIES];
        if (jobProperties && jobProperties.length > 0 && subProperties && subProperties.length > 0) {
            //call the repository to delete the job properties and sub properties
            await this.jobPropertyRepository.updateJobPropertiesDeleted(jobProperties, subProperties);
        } else if (jobProperties && jobProperties.length > 0) {
            //call the repository to delete the job properties
            await this.jobPropertyRepository.updateJobPropertiesDeleted(jobProperties, subProperties);
        }
    }

    private async insertItemModification(query: QueryParams): Promise<JobPropertiesListData> {
        //insert item modification
        await this.jobPropertyRepository.insertItemModification(query);
        //call the selJobPropertiesByClient/Publish
        const jobPropertyDBResponse: JobPropertyQueryResponse[] = await this.jobPropertyRepository.getAllJobPropertiesByClientId(query.loggedInUserClientId);
        //call the Publish Status
        const jobPropertiesPublishStatus: JobPropertiesStatusEnum = await this.jobPropertyRepository.getCurrentStatusOfJobProperties(
            query.loggedInUserClientId,
        );
        const transformedProperties = this.jobPropertyTransformer.transform(jobPropertyDBResponse);
        return {
            status: jobPropertiesPublishStatus,
            jobProperties: transformedProperties,
        };
    }
}
