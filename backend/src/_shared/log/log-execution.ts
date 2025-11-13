const ExecutionStatsSymbol = Symbol('#ExecutionStatsSymbol');

export const setExecutionStats = <T>(value: T, uow: any): T => {
    try {
        value[ExecutionStatsSymbol] = uow;
    } catch (e) {
    }
    return value;
}

export const cutExecutionStats = <T>(value: T): T => {
    try {
        const uow = value[ExecutionStatsSymbol];
        delete value[ExecutionStatsSymbol];
        return uow;
    } catch (e) {
    }
    return undefined;
}
