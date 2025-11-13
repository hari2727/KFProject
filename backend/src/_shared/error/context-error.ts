export class ContextError extends Error {
    readonly cause: unknown;

    constructor(message: string, cause: unknown) {
        super(message);
        this.name = ContextError.name;
        this.cause = cause;
    }
}
