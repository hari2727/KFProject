import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ClientTaskRunnerRequest, TaskGroupCreateResponse } from '../../bulkrunner/bulk-runner.interface';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import axios from 'axios';
import { BulkRunnerExportService } from '../../bulkrunner/bulk-runner-export.service.abstract';
import { getSuccessProfileMatrixExportTaskGroupConfig } from './success-profile-matrix-export.const';
import {
    SuccessProfileMatrixExportRequestBody,
    SuccessProfileMatrixExportTaskData,
    SuccessProfileMatrixExportTaskGroupData,
} from './success-profile-matrix-export.interface';
import { ExportCommonService } from '../export/export.service';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { AuthDetails } from '../../common/request-factory.interface';
import { SuccessProfileMatrixExportRoute } from './success-profile-matrix-export.route';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class SuccessProfileMatrixExportService implements BulkRunnerExportService {

    constructor(
        protected request: BulkRunnerRequestFactory, //
        protected helper: ExportCommonService,
    ) {}

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
            const body = request.body as SuccessProfileMatrixExportRequestBody;
            const auth = this.request.getAuthDetails(request);
            const totalEntries = 1;
            const requestOptions = this.request.generateCreateTaskGroupRequest({
                userId: body.userId,
                clientId: body.clientId,
                auth,
                taskGroupData: this.buildTaskGroupData(body, auth, totalEntries),
                taskData: this.buildTaskData(body),
                ...getSuccessProfileMatrixExportTaskGroupConfig(totalEntries),
            });
            return (await axios(requestOptions)).data.data;
    }

    protected buildTaskGroupData(body: SuccessProfileMatrixExportRequestBody, auth: AuthDetails, totalEntries: number): SuccessProfileMatrixExportTaskGroupData {
        if (!body.exportUrl) {
            throw 'No exportUrl provided';
        }
        if (!body.companyName) {
            throw 'No companyName provided';
        }
        const data: SuccessProfileMatrixExportTaskGroupData = {
            auth,
            userId: Number(body.userId),
            clientId: Number(body.clientId),
            exportUrl: String(body.exportUrl).replace(/([rR][mM])/g, '(($1))'),
            companyName: String(body.companyName),
            showShortProfile: Boolean(body.showShortProfile),
            totalTasks: totalEntries,
        };
        if (body.exportName !== undefined) {
            data.exportName = String(body.exportName);
        }
        return data;
    }

    protected buildTaskData(body: SuccessProfileMatrixExportRequestBody): SuccessProfileMatrixExportTaskData[] {
        return [{}];
    }

    @LogErrors()
    async runTask(request: Request): Promise<void> {
        const body = request.body as ClientTaskRunnerRequest;
         const taskGroupData = JSON.parse(body.taskGroup.options) as SuccessProfileMatrixExportTaskGroupData;

            const auth = this.request.getAuthDetails(request);
            const callbackParams = this.request.generateAuthCallbackRequest({
                auth,
                callback: {
                    method: 'POST',
                    url: this.request.buildLocalURL(SuccessProfileMatrixExportRoute.BASE, ClientAction.UPDATE_TASK_RESULT),
                    data: {
                        callback: (request.body as ClientTaskRunnerRequest).callback,
                    }
                }
            });
            const exportRequest = this.request.getSuccessProfilesMatrixViewExportRequest({
                auth: taskGroupData.auth || auth,
                clientId: taskGroupData.clientId,
                userId: taskGroupData.userId,
                exportUrl: taskGroupData.exportUrl,
                showShortProfile: taskGroupData.showShortProfile,
                companyName: taskGroupData.companyName,
                callback: callbackParams,
            });

            this.helper.callExportLambdaAPIWithCallback(exportRequest);
    }


    async updateTaskResult(request: Request): Promise<void> {
        await this.helper.updateTaskResult(request.body);
    }


    async updateTaskGroup(request: Request): Promise<void> {
        await this.helper.updateSingleExportTaskGroup(request);
    }

}
