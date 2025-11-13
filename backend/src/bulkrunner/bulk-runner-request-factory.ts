import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import {
    AuthCallbackRequestOptions,
    ClientCallbackRequestOptions,
    CreateTaskGroupRequest,
    CreateTaskGroupRequestOptions,
    ReplayTaskGroupRequest,
    ReplayTaskGroupRequestOptions,
} from './bulk-runner.interface';
import { RequestFactory } from '../common/request-factory';
import { ConfigService } from '../_shared/config/config.service';

@Injectable()
export class BulkRunnerRequestFactory extends RequestFactory {

    protected runnerApiBase: string;

    constructor(
        protected configService: ConfigService,
    ) {
        super(configService);
        this.runnerApiBase = this.configService.get('URL_KFHUB_RUNNER_API_BASE');
    }

    generateCreateTaskGroupRequest(options: CreateTaskGroupRequestOptions): AxiosRequestConfig<CreateTaskGroupRequest> {
        const url = this.buildURL(this.runnerApiBase, '/taskgroups');
        return {
            method: 'POST',
            url,
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateAuthHeaders(options.auth),
                'Content-Type': 'application/json',
            },
            data: this.buildRequestBody<CreateTaskGroupRequest>({
                userId: options.userId,
                clientId: options.clientId,
                taskGroupConfig: {
                    taskType: options.taskType,
                    taskTimeout: options.taskTimeout,
                    taskGroupTimeToLive: options.taskGroupTimeToLive,
                    taskGroupPriority: options.taskGroupPriority,
                },
                taskGroupData: options.taskGroupData,
                taskData: options.taskData || [],
            }),
        };
    }

    generateReplayTaskGroupRequest(options: ReplayTaskGroupRequestOptions): AxiosRequestConfig<ReplayTaskGroupRequest> {
        const url = this.buildURL(this.runnerApiBase, '/taskgroups', options.taskGroupId, 'replay');
        return {
            method: 'POST',
            url,
            headers: {
                ...this.generateApplicationHeaders(),
                ...this.generateAuthHeaders(options.auth),
                'Content-Type': 'application/json',
            },
            data: {},
        };
    }

    generateCallbackRequest<T = any>(options: ClientCallbackRequestOptions<T>): AxiosRequestConfig<T> {
        return this.filterEmpty<AxiosRequestConfig>({
            method: options.callback.method as any,
            url: options.callback.url,
            headers: options.callback.headers,
            data: this.filterEmpty<T>(options.payload),
        });
    }

    generateAuthCallbackRequest<T = any>(options: AuthCallbackRequestOptions<T>): AxiosRequestConfig<T> {
        return this.filterEmpty<AxiosRequestConfig>({
            ...options.callback,
            headers: {
                'Content-Type': 'application/json',
                ...this.generateApplicationHeaders(),
                ...this.generateAuthHeaders(options.auth),
                ...(options.callback.headers || {}),
            },
            data: this.filterEmpty<T>(options.callback.data),
        });
    }

}
