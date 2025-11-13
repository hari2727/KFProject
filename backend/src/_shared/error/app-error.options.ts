import { HttpExceptionOptions } from "@nestjs/common";

export interface AppErrorOptions extends HttpExceptionOptions {
    errorCode?: unknown;
    data?: unknown;
}
