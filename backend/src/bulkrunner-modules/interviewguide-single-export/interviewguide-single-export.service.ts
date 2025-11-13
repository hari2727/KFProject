import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ClientTaskRunnerRequest, TaskGroupCreateResponse } from '../../bulkrunner/bulk-runner.interface';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import axios, { AxiosRequestConfig } from 'axios';
import { BulkRunnerExportService } from '../../bulkrunner/bulk-runner-export.service.abstract';
import { getInterviewGuideSingleExportTaskGroupConfig } from './interviewguide-single-export.const';
import {
    InterviewGuideExportEntityFormat,
    InterviewGuideSingleExportRequestBody,
    InterviewGuideSingleExportTaskData,
    InterviewGuideSingleExportTaskGroupData,
} from './interviewguide-single-export.interface';
import { ExportCommonService } from '../export/export.service';
import { ClientAction } from '../../bulkrunner/bulk-runner.const';
import { InterviewGuideSingleExportRoute } from './interviewguide-single-export.route';
import { AuthDetails } from '../../common/request-factory.interface';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { toLocale, toNumber, toStringOr } from '../../_shared/convert';

@Injectable()
export class InterviewGuideSingleExportService implements BulkRunnerExportService {

    constructor(
        protected request: BulkRunnerRequestFactory,
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
        throw 'Unknown action type';
    }

    @LogErrors()
    async createTaskGroup(request: Request): Promise<TaskGroupCreateResponse> {
        const body = request.body as InterviewGuideSingleExportRequestBody;
        const auth = this.request.getAuthDetails(request);
        const totalEntries = 1;
        const requestOptions = this.request.generateCreateTaskGroupRequest({
            userId: body.userId,
            clientId: body.clientId,
            auth,
            taskGroupData: this.buildTaskGroupData(body, request.query, auth, totalEntries),
            taskData: this.buildTaskData(body),
            ...getInterviewGuideSingleExportTaskGroupConfig(totalEntries),
        });
        return (await axios(requestOptions)).data.data;
    }

    @LogErrors()
    protected buildTaskGroupData(body: InterviewGuideSingleExportRequestBody, query: any, auth: AuthDetails, totalEntries: number): InterviewGuideSingleExportTaskGroupData {
        const data: InterviewGuideSingleExportTaskGroupData = {
            auth,
            userId: toNumber(body.userId),
            clientId: toNumber(body.clientId),
            countryId: toNumber(body.countryId) || undefined,
            successProfileId: toNumber(body.successProfileId),
            userLocale: toLocale(query.locale) || undefined,
            locale: toLocale(body.locale) || undefined,
            format: (toStringOr(body.format) || InterviewGuideExportEntityFormat.PDF) as InterviewGuideExportEntityFormat,
            fileName: toStringOr(body.fileName) || undefined,
            totalTasks: totalEntries,
        };

        if (!data.successProfileId || data.successProfileId < 0) {
            throw `Bad successProfileId`;
        }
        if (body.skillIds !== undefined) {
            const skillIds = body.skillIds.map(i => toNumber(i));
            if (skillIds.find(i => !i)) {
                throw 'Bad skillId';
            }
            data.skillIds = skillIds;
        }
        if (body.competencyIds !== undefined) {
            const competencyIds = body.competencyIds.map(i => toNumber(i));
            if (competencyIds.find(i => !i)) {
                throw 'Bad skillId';
            }
            data.competencyIds = competencyIds;
        }
        return data;
    }

    @LogErrors()
    protected buildTaskData(body: InterviewGuideSingleExportRequestBody): InterviewGuideSingleExportTaskData[] {
        const successProfileId = toNumber(body.successProfileId);
        if (!successProfileId || successProfileId < 0) {
            throw 'Bad entity id successProfileId';
        }

        const format = body.format;
        if (format !== undefined && !Object.values(InterviewGuideExportEntityFormat).includes(format)) {
            throw 'Bad entity export format';
        }
        return [
            {
                successProfileId,
                format: format || InterviewGuideExportEntityFormat.PDF,
            },
        ];
    }

    @LogErrors()
    async runTask(request: Request): Promise<void> {
        const body = request.body as ClientTaskRunnerRequest;
        const taskGroupData = JSON.parse(body.taskGroup.options) as InterviewGuideSingleExportTaskGroupData;
        const taskData = JSON.parse(body.task.options) as InterviewGuideSingleExportTaskData;

        const auth = this.request.getAuthDetails(request);
        const callbackParams = this.request.generateAuthCallbackRequest({
            auth,
            callback: {
                method: 'POST',
                url: this.request.buildLocalURL(InterviewGuideSingleExportRoute.BASE, ClientAction.UPDATE_TASK_RESULT),
                data: {
                    callback: (request.body as ClientTaskRunnerRequest).callback,
                }
            }
        });

        let exportRequest: AxiosRequestConfig = this.request.getDownloadInterviewGuideCallbackRequest({
            auth: taskGroupData.auth || auth,
            successProfileId: taskData.successProfileId,
            clientId: taskGroupData.clientId,
            userId: taskGroupData.userId,
            countryId: taskGroupData.countryId,
            userLocale: taskGroupData.userLocale,
            locale: taskGroupData.locale,
            skillIds: taskGroupData.skillIds,
            competencyIds: taskGroupData.competencyIds,
            format: String(taskData.format),
            fileName: taskGroupData.fileName,
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
