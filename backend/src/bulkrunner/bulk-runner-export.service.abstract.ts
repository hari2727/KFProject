import { Request } from 'express';
import { TaskGroupCreateResponse } from './bulk-runner.interface';

export abstract class BulkRunnerExportService {

    abstract createTaskGroup(request: Request): Promise<TaskGroupCreateResponse>;
    abstract runTask(request: Request): Promise<void>;
    abstract updateTaskResult(request: Request): Promise<void>
    abstract updateTaskGroup(request: Request): Promise<void>;

}
