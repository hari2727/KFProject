import { Request } from 'express';
import { TaskGroupStatus, TaskStatus } from '../../bulkrunner/bulk-runner.const';
import {
    ActivityCallbackRequestConfig,
    ClientTaskGroupUpdateCallbackPayload,
    ClientTaskGroupUpdateRequest,
    ClientTaskRunnerCallbackPayload,
} from '../../bulkrunner/bulk-runner.interface';
import { BulkRunnerRequestFactory } from '../../bulkrunner/bulk-runner-request-factory';
import { TaskEntity } from '../../bulkrunner/data/task.entity';
import axios, { AxiosRequestConfig } from 'axios';
import { TaskGroupEntity } from '../../bulkrunner/data/taskgroup.entity';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { BulkRunnerTasksDataService } from '../../bulkrunner/data/tasks-data.service';
import {
    DetailedExportTaskResult,
    ExportCallbackResults,
    ExportLambdaResponse,
    ExportTaskResult,
    ExportUpdateTaskResultRequestBody,
    SingleExportTaskGroupResult,
} from './export.interface';
import { CallbackCallbackRequest } from '../../common/request-factory.interface';
import { isNotAWSAPIGatewayTimeOut } from '../../common/common.utils';
import { Loggers } from '../../_shared/log/loggers';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { StopErrors } from '../../_shared/error/stop-errors.decorator';
import { safeCRLFString, safeNumber, safeString } from '../../_shared/safety';

@Injectable()
export class ExportCommonService {

    protected logger: LoggerService;

    constructor(
        protected request: BulkRunnerRequestFactory, //
        protected tasksDataService: BulkRunnerTasksDataService,
        protected loggers: Loggers,
    ) {
        this.logger = loggers.getLogger(ExportCommonService.name);
    }

    async callExportAPI(requestOptions: AxiosRequestConfig): Promise<ClientTaskRunnerCallbackPayload<ExportTaskResult>> {
        let error;
        try {
            const response: any = await axios(requestOptions);
            const data = response.data.data as ExportLambdaResponse;
            if (data.headers && data.headers.Location && data.headers.Filename && data.headers.FileKey && data.headers.Bucket) {
                return {
                    status: TaskStatus.COMPLETED,
                    result: {
                        location: data.headers.Location,
                        filename: data.headers.Filename,
                        filesize: data.headers.FileSize || 0,
                        filekey: data.headers.FileKey,
                        bucket: data.headers.Bucket,
                    },
                };
            }
            if (response.data.error) {
                throw response.data.error;
            } else {
                throw data;
            }
        } catch (e) {
            error = e;
        }
        return {
            status: TaskStatus.FAILED,
            result: {
                error,
            },
        };
    }

    callExportLambdaAPIWithCallback(exportRequest: AxiosRequestConfig<CallbackCallbackRequest<ActivityCallbackRequestConfig>>): void {
        const started = new Date();
        axios(exportRequest).catch(ae => {
            if (isNotAWSAPIGatewayTimeOut(started)) {
                this.logger.error(`callExportLambdaAPIWithCallback: ${ae}`);
                this.updateTaskResult({ callback: exportRequest.data.callback.data.callback, results: ae });
            }
        });
    }

    @LogErrors()
    async updateTaskResult(body: ExportUpdateTaskResultRequestBody): Promise<void> {
            await axios(
                this.request.generateCallbackRequest<ClientTaskRunnerCallbackPayload<ExportTaskResult>>({
                    callback: body.callback,
                    payload: this.readCallbackExportResults(body.results),
                })
            );
    }

    readCallbackExportResults(results: ExportCallbackResults): ClientTaskRunnerCallbackPayload<ExportTaskResult> {
        let error;
        try {
            if (results && results.Location && results.Filename && results.FileKey && results.Bucket && results.Region) {
                return {
                    status: TaskStatus.COMPLETED,
                    result: {
                        location: results.Location,
                        filename: results.Filename,
                        filekey: results.FileKey,
                        filesize: results.FileSize || 0,
                        bucket: results.Bucket,
                        region: results.Region,
                    },
                };
            }
            throw results;
        } catch (e) {
            error = e;
        }
        return {
            status: TaskStatus.FAILED,
            result: {
                error,
            },
        };
    }

    @LogErrors()
    async updateSingleExportTaskGroup(request: Request): Promise<void> {
        const body = request.body as ClientTaskGroupUpdateRequest;

        try {
            const taskGroup = body.taskGroup;
            const payload: Partial<ClientTaskGroupUpdateCallbackPayload<SingleExportTaskGroupResult>> = {};

            let allTasks: TaskEntity[] = [];
            let taskGroupStatus: TaskGroupStatus = taskGroup.status;

            if ([TaskGroupStatus.QUEUED, TaskGroupStatus.IN_PROGRESS].includes(taskGroup.status)) {
                allTasks = body.tasks && body.tasks.length
                    ? body.tasks as TaskEntity[]
                    : await this.tasksDataService.getByTaskGroupId(taskGroup.id);

                if (allTasks.length) {
                    taskGroupStatus = this.calculateSingleExportTaskGroupStatus(taskGroup, allTasks[0]);
                } else {
                    throw `No tasks associated with taskGroup "${safeNumber(taskGroup.id)}"`;
                }
            }

            if (taskGroupStatus !== taskGroup.status) {
                payload.status = taskGroupStatus;

                const task = allTasks[0];
                if ([TaskStatus.COMPLETED, TaskStatus.FAILED].includes(task.status)) {

                    payload.result = this.buildSingleExportTaskGroupResults(task);
                    if (payload.result.error) {
                        payload.status = TaskGroupStatus.FAILED;
                    }
                }

                await axios(
                    this.request.generateCallbackRequest({
                        callback: body.callback,
                        payload,
                    })
                );
            }
        } catch (e) {
            await this.updateTaskGroupWithError(request, e);
            throw e;
        }
    }

    calculateSingleExportTaskGroupStatus(taskGroup: TaskGroupEntity, task: TaskEntity): TaskGroupStatus {
        let taskGroupStatus = taskGroup.status;

        if (task.status === TaskStatus.QUEUED) {
            taskGroupStatus = TaskGroupStatus.QUEUED;
        } else if (task.status === TaskStatus.RUNNING) {
            taskGroupStatus = TaskGroupStatus.IN_PROGRESS;
        } else if (task.status === TaskStatus.FAILED) {
            taskGroupStatus = TaskGroupStatus.FAILED;
        } else if (task.status === TaskStatus.CANCELED) {
            taskGroupStatus = TaskGroupStatus.CANCELED;
        } else if (task.status === TaskStatus.COMPLETED) {
            taskGroupStatus = TaskGroupStatus.COMPLETED;
        } else if (task.status === TaskStatus.REMOVED) {
            taskGroupStatus = TaskGroupStatus.REMOVED;
        }

        return taskGroupStatus;
    }

    calculateBulkExportTaskGroupStatus(taskGroup: TaskGroupEntity, tasks: TaskEntity[]): TaskGroupStatus {
        let taskGroupStatus = taskGroup.status;

        const hasCanceled = tasks.some(t => t.status === TaskStatus.CANCELED);
        const hasCompleted = tasks.some(t => t.status === TaskStatus.COMPLETED);
        const hasFailed = tasks.some(t => t.status === TaskStatus.FAILED);
        const hasQueued = tasks.some(t => t.status === TaskStatus.QUEUED);
        const hasRemoved = tasks.some(t => t.status === TaskStatus.REMOVED);
        const hasRunning = tasks.some(t => t.status === TaskStatus.RUNNING);

        if (taskGroup.status === TaskGroupStatus.QUEUED) {
            if (hasRunning) {
                taskGroupStatus = TaskGroupStatus.IN_PROGRESS;
            } else if (hasQueued) {
                if (hasCompleted || hasFailed || hasCanceled || hasRemoved) {
                    taskGroupStatus = TaskGroupStatus.IN_PROGRESS;
                } else {
                    taskGroupStatus = TaskGroupStatus.QUEUED;
                }
            } else if (hasCompleted) {
                taskGroupStatus = TaskGroupStatus.POST_PROCESSING;
            } else if (hasFailed) {
                taskGroupStatus = TaskGroupStatus.FAILED;
            } else if (hasCanceled) {
                taskGroupStatus = TaskGroupStatus.CANCELED;
            } else if (hasRemoved) {
                taskGroupStatus = TaskGroupStatus.REMOVED;
            }
        } else if (taskGroup.status === TaskGroupStatus.IN_PROGRESS) {
            if (!hasRunning && !hasQueued) {
                if (hasCompleted) {
                    taskGroupStatus = TaskGroupStatus.POST_PROCESSING;
                } else if (hasFailed) {
                    taskGroupStatus = TaskGroupStatus.FAILED;
                } else if (hasCanceled) {
                    taskGroupStatus = TaskGroupStatus.CANCELED;
                } else if (hasRemoved) {
                    taskGroupStatus = TaskGroupStatus.REMOVED;
                }
            }
        }
        return taskGroupStatus;
    }

    protected buildSingleExportTaskGroupResults(task: TaskEntity): SingleExportTaskGroupResult {
        const taskResult = this.readTaskResult(task);
        if (taskResult.status === TaskStatus.COMPLETED && !taskResult.error) {
            return {
                status: taskResult.status,
                ...taskResult.data,
            };
        } else {
            return {
                status: taskResult.status,
                error: taskResult.error,
            };
        }
    }

    readTaskResult(task: Partial<TaskEntity>): DetailedExportTaskResult {
        try {
            const taskResult = JSON.parse(task.result) as ExportTaskResult;
            if (task.status === TaskStatus.COMPLETED) {
                if (taskResult.location && taskResult.filename && taskResult.filekey && taskResult.bucket && taskResult.region) {
                    return {
                        id: task.id,
                        status: task.status,
                        data: {
                            location: taskResult.location,
                            filename: taskResult.filename,
                            filekey: taskResult.filekey,
                            filesize: taskResult.filesize || 0,
                            bucket: taskResult.bucket,
                            region: taskResult.region,
                        },
                    };
                }
            }
            if (taskResult.error) {
                throw taskResult.error;
            }
            throw taskResult;
        } catch (e) {
            this.logger.error(`${safeString(e)} Result for task ${safeNumber(task.id)} with status ${task.status}`);
            return {
                id: task.id,
                status: task.status,
                error: e,
            };
        }
    }

    @StopErrors()
    @LogErrors()
    async updateTaskGroupWithError(request: Request, error: any): Promise<void> {
            await axios(
                this.request.generateCallbackRequest({
                    callback: (request.body as ClientTaskGroupUpdateRequest).callback,
                    payload: {
                        status: TaskGroupStatus.FAILED,
                        result: {
                            error,
                        },
                    },
                })
            )
    }

}
