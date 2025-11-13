import { AxiosRequestConfig, Method } from 'axios';
import { ClientAction, TaskGroupStatus, TaskStatus } from './bulk-runner.const';
import { TaskGroupEntity } from './data/taskgroup.entity';
import { TaskEntity } from './data/task.entity';
import { AuthHeaders, RequestOptions } from '../common/request-factory.interface';

export interface CreateTaskGroupRequestOptions<G = any, T = any> extends RequestOptions {
    userId: number;
    clientId: number;
    taskType: string;
    taskTimeout: number;
    taskGroupTimeToLive: number;
    taskGroupPriority: number;
    taskGroupData: G;
    taskData: T[];
}

export interface ReplayTaskGroupRequestOptions<G = any, T = any> extends RequestOptions {
    taskGroupId: number;
}

export interface TaskGroupConfig {
    taskType: string;
    taskTimeout: number;
    taskGroupTimeToLive: number;
    taskGroupPriority: number;
    taskGroupPolling?: TaskGroupPollTimingOptions;
}

export interface TaskGroupPollTimingOptions {
    intervals?: number[];
    interval?: number;
    count?: number;
}

// requests

export interface ClientRequest {
    callback: ActivityCallbackRequestConfig;
    action: ClientAction;
}

export interface CreateTaskGroupRequest<G = any, T = any> {
    userId: number;
    clientId: number;
    taskGroupConfig: TaskGroupConfig;
    taskGroupData: G;
    taskData: T[];
}

export interface ReplayTaskGroupRequest {
}

export interface ActivityHeaders extends AuthHeaders {
    activityKey: string;
}

export interface ActivityCallbackRequestConfig extends AxiosRequestConfig<void> {
    method: Method;
    url: string;
    headers: ActivityHeaders;
}

export interface ClientTaskGroupUpdateRequest extends ClientRequest {
    taskGroup: TaskGroupEntity;
    tasks: Partial<TaskEntity>[];
}

export interface ClientTaskGroupUpdateCallbackPayload<T = any> {
    status?: TaskGroupStatus;
    result?: T;
}

export interface ClientCallbackRequestOptions<T = any> {
    callback: ActivityCallbackRequestConfig;
    payload: T;
}

export interface AuthCallbackRequestOptions<T = any> extends RequestOptions {
    callback: AxiosRequestConfig<T>;
}

export interface ClientTaskRunnerRequest extends ClientRequest {
    taskGroup: TaskGroupEntity;
    task: TaskEntity;
}

export interface ClientTaskRunnerCallbackPayload<T = any> {
    status: TaskStatus;
    result?: T;
    invocationHash?: any;
}

export interface TaskGroupPollRequestConfig extends AxiosRequestConfig {
    method: Method;
    url: string;
    headers: AuthHeaders;
}

export interface TaskGroupPollOptions {
    target: TaskGroupPollRequestConfig;
    interval: number;
    count: number;
}

export interface TaskGroupCreateResponse {
    pollOptions: TaskGroupPollOptions;
    taskGroupId: number;
}
