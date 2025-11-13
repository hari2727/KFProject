import { AppResponseOptions } from './app-response.options';

export class AppResponse<T = unknown> {
    constructor(public readonly options: AppResponseOptions<T>) {
    }
}
