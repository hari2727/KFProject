import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ClientTaskRunnerRequest, TaskGroupCreateResponse } from '../../bulkrunner/bulk-runner.interface';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import axios, { AxiosRequestConfig } from 'axios';
import { BulkRunnerExportService } from '../../bulkrunner/bulk-runner-export.service.abstract';
import { getSuccessProfileSingleExportTaskGroupConfig } from './success-profile-single-export.const';
import { SuccessProfileSingleExportRequestBody, } from './success-profile-single-export.interface';
import { ExportCommonService } from '../export/export.service';
import {
    SuccessProfileExportEntityFormat,
    SuccessProfileExportEntityType
} from '../export/success-profile.export.const';
import {
    SuccessProfileExportTaskData,
    SuccessProfileExportTaskGroupData,
} from '../export/success-profile.export.interface';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { SuccessProfileSingleExportRoute } from './success-profile-single-export.route';
import { AuthDetails } from '../../common/request-factory.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class SuccessProfileSingleExportService implements BulkRunnerExportService {

    constructor(
        protected request: BulkRunnerRequestFactory, //
        protected helper: ExportCommonService,
    ) {}

    @LogErrors()
    handleAction(action: ClientAction, request: Request): Promise<any> {
        if (action === ClientAction.CREATE_TASK_GROUP) {
            return this.createTaskGroup(request);
        }
        if (action === ClientAction.RUN_TASK) {
            return this.runTask(request);
        }
        if (action === ClientAction.UPDATE_TASK_RESULT) {
            return this.updateTaskResult(request);
        }
        if (action === ClientAction.UPDATE_TASK_GROUP) {
            return this.updateTaskGroup(request);
        }
        throw `Unknown action type "${action}"`;
    }

    @LogErrors()
    async createTaskGroup(request: Request): Promise<TaskGroupCreateResponse> {
            const body = request.body as SuccessProfileSingleExportRequestBody;
            const auth = this.request.getAuthDetails(request);
            const totalEntries = 1;
            const requestOptions = this.request.generateCreateTaskGroupRequest({
                userId: body.userId,
                clientId: body.clientId,
                auth,
                taskGroupData: this.buildTaskGroupData(body, auth, totalEntries),
                taskData: this.buildTaskData(body),
                ...getSuccessProfileSingleExportTaskGroupConfig(totalEntries),
            });
            return (await axios(requestOptions)).data.data;
    }

    @LogErrors()
    protected buildTaskGroupData(body: SuccessProfileSingleExportRequestBody, auth: AuthDetails, totalEntries: number): SuccessProfileExportTaskGroupData {
        const data: SuccessProfileExportTaskGroupData = {
            auth,
            userId: Number(body.userId),
            clientId: Number(body.clientId),
            totalTasks: totalEntries,
        };
        if (body.excludeSections !== undefined) {
            for (const id of body.excludeSections) {
                if (!Number(id)) {
                    throw `Bad excludeSection "${id}"`;
                }
            }
            data.excludeSections = body.excludeSections;
        }
        if (body.locale !== undefined) {
            data.locale = body.locale;
        }
        if (body.hideLevels !== undefined) {
            data.hideLevels = Number(body.hideLevels) || 0;
        }
        if (body.countryId !== undefined) {
            data.countryId = String(body.countryId);
        }
        if (body.exportName !== undefined) {
            data.exportName = String(body.exportName);
        }

        return data;
    }

    @LogErrors()
    protected buildTaskData(body: SuccessProfileSingleExportRequestBody): SuccessProfileExportTaskData[] {
        const id = Number(body.id);
        if (isNaN(id) || id < 1) {
            throw `Bad entity id "${id}"`;
        }
        const type = body.type;
        if (!Object.values(SuccessProfileExportEntityType).includes(type)) {
            throw `Bad entity type "${type}"`;
        }
        const format = body.format;
        if (format !== undefined && !Object.values(SuccessProfileExportEntityFormat).includes(format)) {
            throw `Bad entity export format "${format}"`;
        }
        return [
            {
                id,
                type,
                format: format || SuccessProfileExportEntityFormat.PDF,
            },
        ];
    }

    @LogErrors()
    async runTask(request: Request): Promise<void> {
        const body = request.body as ClientTaskRunnerRequest;
            const taskGroupData = JSON.parse(body.taskGroup.options) as SuccessProfileExportTaskGroupData;
            const taskData = JSON.parse(body.task.options) as SuccessProfileExportTaskData;

            const auth = this.request.getAuthDetails(request);
            const callbackParams = this.request.generateAuthCallbackRequest({
                auth,
                callback: {
                    method: 'POST',
                    url: this.request.buildLocalURL(SuccessProfileSingleExportRoute.BASE, ClientAction.UPDATE_TASK_RESULT),
                    data: {
                        callback: (request.body as ClientTaskRunnerRequest).callback,
                    }
                }
            });

            let exportRequest: AxiosRequestConfig;
            if (taskData.type === SuccessProfileExportEntityType.SUCCESS_PROFILE) {
                exportRequest = this.request.getDownloadSuccessProfileCallbackRequest({
                    auth: taskGroupData.auth || auth,
                    id: taskData.id,
                    clientId: taskGroupData.clientId,
                    userId: taskGroupData.userId,
                    locale: taskGroupData.locale,
                    countryId: taskGroupData.countryId,
                    hideLevels: taskGroupData.hideLevels,
                    excludeSections: taskGroupData.excludeSections,
                    exportName: taskGroupData.exportName,
                    callback: callbackParams,
                });
            } else {
                exportRequest = this.request.getDownloadJobDescriptionCallbackRequest({
                    auth: taskGroupData.auth || auth,
                    id: taskData.id,
                    clientId: taskGroupData.clientId,
                    userId: taskGroupData.userId,
                    locale: taskGroupData.locale,
                    countryId: taskGroupData.countryId,
                    format: String(taskData.format),
                    exportName: taskGroupData.exportName,
                    callback: callbackParams,
                });
            }

            this.helper.callExportLambdaAPIWithCallback(exportRequest);
    }


    async updateTaskResult(request: Request): Promise<void> {
        await this.helper.updateTaskResult(request.body);
    }


    async updateTaskGroup(request: Request): Promise<void> {
        await this.helper.updateSingleExportTaskGroup(request);
    }

}
