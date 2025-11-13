import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { Request } from 'express';
import { ClientAction, TaskGroupStatus, TaskStatus } from '../../bulkrunner/bulk-runner.const';
import {
    ClientTaskGroupUpdateRequest,
    ClientTaskRunnerRequest,
    TaskGroupCreateResponse,
} from '../../bulkrunner/bulk-runner.interface';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { TaskEntity } from '../../bulkrunner/data/task.entity';
import axios, { AxiosRequestConfig } from 'axios';

import {
    SuccessProfileBulkExportArchiveEntry,
    SuccessProfileBulkExportCompletedTaskResult,
    SuccessProfileBulkExportRequestBody,
    SuccessProfileBulkExportTaskGroupResult,
    SuccessProfileBulkExportTaskGroupResultPayload,
    UpdateTaskGroupResultRequest,
    UpdateTaskGroupResultTransitData,
} from './success-profile-bulk-export.interface';
import {
    archiveSize,
    getSuccessProfileBulkExportTaskGroupConfig,
    maxSuccessProfileBulkExportRetries
} from './success-profile-bulk-export.const';
import { Utils } from '../../common/common.utils';
import { SuccessProfileBulkExportRoute } from './success-profile-bulk-export.route';
import { BulkRunnerTaskGroupsDataService } from '../../bulkrunner/data/taskgroups-data.service';
import { S3Archiver } from '../../common/s3/s3archiver';
import {
    ArchiveS3FilesCallback,
    AWSBucketCollectionInfo,
    HashedAWSBucketCollectionInfo,
} from '../../common/s3/s3archiver.interface';
import { BulkRunnerExportService } from '../../bulkrunner/bulk-runner-export.service.abstract';
import { TaskGroupEntity } from '../../bulkrunner/data/taskgroup.entity';
import { ExportCommonService } from '../export/export.service';
import {
    SuccessProfileExportTaskData,
    SuccessProfileExportTaskGroupData,
} from '../export/success-profile.export.interface';
import {
    SuccessProfileExportEntityFormat,
    SuccessProfileExportEntityType
} from '../export/success-profile.export.const';
import { Loggers } from '../../_shared/log/loggers';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { safeNumber, safeString } from '../../_shared/safety';

@Injectable()
export class SuccessProfileBulkExportService implements BulkRunnerExportService {
    protected logger: LoggerService;
    constructor(
        protected request: BulkRunnerRequestFactory,
        protected tasksDataService: BulkRunnerTasksDataService,
        protected tasksGroupDataService: BulkRunnerTaskGroupsDataService,
        protected helper: ExportCommonService,
        protected s3Utils: S3Archiver,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(SuccessProfileBulkExportService.name);
    }

    handleAction(action: string, request: Request): Promise<any> {
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
        if (action === ClientAction.UPDATE_TASK_GROUP_RESULT) {
            return this.updateTaskGroupResult(request);
        }
        throw safeString(`Unknown action type "${action}"`);
    }

    @LogErrors()
    async createTaskGroup(request: Request): Promise<TaskGroupCreateResponse> {
            const body = request.body as SuccessProfileBulkExportRequestBody;
            const totalEntries = Object.values(body.ids).reduce((a, b) => a.concat(b), []).length;
            if (!totalEntries) {
                throw 'No ids passed';
            }
            const requestOptions = this.request.generateCreateTaskGroupRequest({
                userId: body.userId,
                clientId: body.clientId,
                auth: this.request.getAuthDetails(request),
                taskGroupData: this.buildTaskGroupData(body, totalEntries),
                taskData: this.buildTaskData(body),
                ...getSuccessProfileBulkExportTaskGroupConfig(totalEntries),
            });
            return (await axios(requestOptions)).data.data;
    }

    @LogErrors()
    protected buildTaskGroupData(body: SuccessProfileBulkExportRequestBody, totalEntries: number): SuccessProfileExportTaskGroupData {
        const data: SuccessProfileExportTaskGroupData = {
            clientId: Number(body.clientId),
            userId: Number(body.userId),
            totalTasks: totalEntries,
            retriesLeft: maxSuccessProfileBulkExportRetries,
        };
        if (body.excludeSections !== undefined) {
            for (const id of body.excludeSections) {
                if (!Number(id)) {
                    throw safeString(`Bad excludeSection value "${id}"`);
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

    protected buildTaskData(body: SuccessProfileBulkExportRequestBody): SuccessProfileExportTaskData[] {
        const allowedTypes = Object.values(SuccessProfileExportEntityType) as string[];
        const data: SuccessProfileExportTaskData[] = [];
        for (const rawType in body.ids) {
            if (!allowedTypes.includes(rawType)) {
                throw safeString(`Bad "${rawType}" entity type`);
            }
            const type = rawType as SuccessProfileExportEntityType;
            for (const rawId of body.ids[type]) {
                const id = Number(rawId);
                if (isNaN(id) || id < 1) {
                    throw safeString(`Bad entity id "${id}" of type "${type}"`);
                }
                data.push({ id, type, format: SuccessProfileExportEntityFormat.PDF });
            }
        }
        return data;
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
                    url: this.request.buildLocalURL(SuccessProfileBulkExportRoute.BASE, ClientAction.UPDATE_TASK_RESULT),
                    data: {
                        callback: (request.body as ClientTaskRunnerRequest).callback,
                    }
                }
            });

            let exportRequest: AxiosRequestConfig;
            if (taskData.type === SuccessProfileExportEntityType.SUCCESS_PROFILE) {
                exportRequest = this.request.getDownloadSuccessProfileCallbackRequest({
                    auth,
                    id: taskData.id,
                    clientId: taskGroupData.clientId,
                    userId: taskGroupData.userId,
                    locale: taskGroupData.locale,
                    countryId: taskGroupData.countryId,
                    hideLevels: taskGroupData.hideLevels,
                    excludeSections: taskGroupData.excludeSections,
                    callback: callbackParams,
                });
            } else {
                exportRequest = this.request.getDownloadJobDescriptionCallbackRequest({
                    auth,
                    id: taskData.id,
                    clientId: taskGroupData.clientId,
                    userId: taskGroupData.userId,
                    locale: taskGroupData.locale,
                    countryId: taskGroupData.countryId,
                    format: String(taskData.format),
                    callback: callbackParams,
                });
            }

            this.helper.callExportLambdaAPIWithCallback(exportRequest);
    }

    async updateTaskResult(request: Request): Promise<void> {
        await this.helper.updateTaskResult(request.body);
    }

    @LogErrors()
    async updateTaskGroup(request: Request): Promise<void> {
        const body = request.body as ClientTaskGroupUpdateRequest;

        try {
            const taskGroup = body.taskGroup;
            const payload: Partial<SuccessProfileBulkExportTaskGroupResultPayload> = {};

            let allTasks: TaskEntity[] = [];
            let taskGroupStatus = taskGroup.status;

            const taskGroupOptions = this.readTaskGroupOptions(taskGroup);
            const retriesLeft = taskGroupOptions.retriesLeft || 0;
            let shouldReplayTasks = false;

            if ([TaskGroupStatus.QUEUED, TaskGroupStatus.IN_PROGRESS].includes(taskGroup.status)) {

                if (taskGroupOptions.totalTasks === body.tasks.length) {
                    allTasks = body.tasks as TaskEntity[];
                } else {
                    allTasks = await this.tasksDataService.getByTaskGroupId(taskGroup.id);
                }

                taskGroupStatus = this.helper.calculateBulkExportTaskGroupStatus(taskGroup, allTasks);

                if ([TaskGroupStatus.POST_PROCESSING, TaskGroupStatus.FAILED].includes(taskGroupStatus)) {
                    shouldReplayTasks = allTasks.some(i => i.status === TaskStatus.FAILED) && retriesLeft > 0;
                }
            }

            if (shouldReplayTasks) {
                taskGroupStatus = TaskGroupStatus.IN_PROGRESS;
                payload.status = taskGroupStatus;

                taskGroupOptions.retriesLeft = retriesLeft - 1;
                taskGroup.options = JSON.stringify(taskGroupOptions);

                await this.tasksGroupDataService.updateTaskGroup(taskGroup);

                if (taskGroupStatus !== taskGroup.status) {
                    await axios(
                        this.request.generateCallbackRequest({
                            callback: body.callback,
                            payload,
                        })
                    );
                }

                await axios(this.request.generateReplayTaskGroupRequest({
                    auth: this.request.getAuthDetails(request),
                    taskGroupId: taskGroup.id
                }));

            } else if (taskGroupStatus !== taskGroup.status) {
                payload.status = taskGroupStatus;

                if (taskGroupStatus === TaskGroupStatus.POST_PROCESSING) {
                    payload.result = this.buildTaskGroupResults(allTasks);
                    await this.callForCompletedTasksResultsAWSBundling(taskGroup, payload, request);

                } else {
                    await axios(
                        this.request.generateCallbackRequest({
                            callback: body.callback,
                            payload,
                        })
                    );
                }
            }
        } catch (e) {
            await this.helper.updateTaskGroupWithError(request, e);
            throw e;
        }
    }

    protected readTaskGroupOptions(taskGroup: TaskGroupEntity): SuccessProfileExportTaskGroupData {
        const options = {
            totalTasks: -1,
        } as SuccessProfileExportTaskGroupData;
        try {
            Object.assign(options, JSON.parse(taskGroup.options));
        } catch (e) {
            this.logger.error(`readTaskGroupOptions: ${safeString(e)}`);
        }
        return options;
    }

    protected buildTaskGroupResults(tasks: TaskEntity[]): SuccessProfileBulkExportTaskGroupResult {
        const result: SuccessProfileBulkExportTaskGroupResult = {
            completed: [],
            failed: [],
            archives: [],
        };
        for (const task of tasks) {
            const taskResult = this.helper.readTaskResult(task);

            if (taskResult.status === TaskStatus.COMPLETED && !taskResult.error) {
                result.completed.push({
                    id: taskResult.id,
                    status: taskResult.status,
                    ...taskResult.data,
                });
            } else {
                result.failed.push({
                    id: taskResult.id,
                    status: taskResult.status,
                    error: taskResult.error,
                });
            }
        }
        return result;
    }

    @LogErrors()
    protected async callForCompletedTasksResultsAWSBundling(taskGroup: TaskGroupEntity, payload: SuccessProfileBulkExportTaskGroupResultPayload, request: Request): Promise<void> {
        const body = request.body as ClientTaskGroupUpdateRequest;
        const headers = request.headers;

            const callback: ArchiveS3FilesCallback = {
                method: 'post',
                url: this.request.buildLocalURL(SuccessProfileBulkExportRoute.BASE, ClientAction.UPDATE_TASK_GROUP_RESULT),
                headers: { ...headers },
            };
            const headerNames = Object.keys(callback.headers);
            for (const headerName of headerNames) {
                if (['content-length', 'host'].includes(headerName.toLowerCase())) {
                    delete callback.headers[headerName];
                }
            }

            payload.result.archives = [];

            const packs: HashedAWSBucketCollectionInfo[] = [];
            const { bucket, region, filePaths, fileNames } = this.extractAWSCollectionInfo(payload.result.completed);

            while (filePaths.length) {
                const filePathsBatch = filePaths.splice(0, archiveSize || 1);
                const fileNamesBatch = fileNames.splice(0, archiveSize || 1);
                const filesHash = Utils.getMd5(filePathsBatch);
                packs.push({
                    filePaths: filePathsBatch,
                    fileNames: fileNamesBatch,
                    filesHash: filesHash,
                });
            }

            for (const pack of packs) {
                payload.result.archives.push({
                    id: pack.filesHash,
                    bucket,
                    region,
                    filekey: null,
                    status: TaskStatus.RUNNING,
                });
            }

            taskGroup.result = JSON.stringify(payload.result);
            await this.tasksGroupDataService.updateTaskGroup(taskGroup);

            for (const pack of packs) {
                await this.s3Utils.archiveS3Files<UpdateTaskGroupResultTransitData>(
                    bucket,
                    region,
                    pack.filePaths,
                    taskGroup.type,
                    taskGroup.clientId,
                    pack.filesHash,
                    callback,
                    pack.fileNames,
                    {
                        groupId: taskGroup.id,
                        finalCallback: body.callback,
                        filesHash: pack.filesHash,
                    },
                );
            }
    }

    protected extractAWSCollectionInfo(results: SuccessProfileBulkExportCompletedTaskResult[]): AWSBucketCollectionInfo {
        const buckets: string[] = [];
        const regions: string[] = [];
        const fileNames: string[] = [];
        const filePaths: string[] = [];

        for (const result of results) {
            try {
                const { bucket, filekey, filename, location, region } = result;
                if (!bucket || !filekey || !filename || !location || !region) {
                    throw 'Bad response';
                }
                if (!regions.includes(region)) {
                    regions.push(region);
                    if (regions.length > 1) {
                        break;
                    }
                }
                if (!buckets.includes(bucket)) {
                    buckets.push(bucket);
                    if (buckets.length > 1) {
                        break;
                    }
                }
                filePaths.push(filekey);
                // good place to sanitize
                fileNames.push(decodeURIComponent(result.filename));
            } catch (e) {
                this.logger.error(`Bad task ${safeNumber(result.id)} results`, safeString(e));
            }
        }
        if (!regions.length) {
            throw 'No regions found';
        }
        if (regions.length > 1) {
            throw 'Task results contain different source regions';
        }
        if (!buckets.length) {
            throw 'No buckets found';
        }
        if (buckets.length > 1) {
            throw 'Task results contain different source Buckets';
        }
        return { bucket: buckets.shift(), region: regions.shift(), filePaths, fileNames };
    }

    @LogErrors()
    async updateTaskGroupResult(request: Request): Promise<void> {
        const body = request.body as UpdateTaskGroupResultRequest;

            this.validateTaskGroupId(body.transitData.groupId);
            const taskGroupId = body.transitData.groupId;

            const taskGroup = await this.tasksGroupDataService.getById(taskGroupId);
            if (!taskGroup) {
                throw `Unknown TaskGroup "${safeNumber(taskGroupId)}"`;
            }
            if (!this.isTaskGroupActive(taskGroup)) {
                throw safeString(`TaskGroup "${safeNumber(taskGroupId)}" has status "${taskGroup.status}"`);
            }

            const result = JSON.parse(taskGroup.result) as SuccessProfileBulkExportTaskGroupResult;

            const archiveSlot = result.archives.find(entry => entry.id === body.transitData.filesHash);
            if (!archiveSlot) {
                throw safeString(`Unable to find TaskGroup Results archive slot for "${body.transitData.filesHash}"`);
            }

            Object.assign(archiveSlot, {
                region: body.targetRegion,
                bucket: body.targetBucket,
                filekey: body.targetFileKey,
                filesize: body.targetFileSize || 0,
                status: TaskStatus.COMPLETED,
            } as SuccessProfileBulkExportArchiveEntry);

            taskGroup.result = JSON.stringify(result);
            await this.tasksGroupDataService.updateTaskGroup(taskGroup);

            if (result.archives.every(entry => entry.status === TaskStatus.COMPLETED)) {
                const requestOptions = this.request.generateCallbackRequest({
                    callback: body.transitData.finalCallback,
                    payload: {
                        status: TaskGroupStatus.COMPLETED,
                    },
                });
                await axios(requestOptions);
            }
    }

    protected isTaskGroupActive(taskGroup: TaskGroupEntity): boolean {
        return ![
            TaskGroupStatus.ARCHIVED,
            TaskGroupStatus.CANCELED,
            TaskGroupStatus.REMOVED,
        ].includes(taskGroup.status);
    }

    protected validateTaskGroupId(value: any): void {
        const n = Number(value);
        if (!n || isNaN(n) || n < 0) {
            throw safeString(`Invalid TaskGroup ID value "${value}"`);
        }
    }

}
