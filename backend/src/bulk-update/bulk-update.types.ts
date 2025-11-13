import { QueryProps } from '../common/common.interface';

export type OperationId = number;

export type DefaultQuery = QueryProps.Default;

export type OverridenClientQuery = DefaultQuery & {
    preferredClientId?: string;
};

export type BulkOperationIdQuery = DefaultQuery & {
    operationId: OperationId;
};

export type BulkOperationIdPayload = {
    operationId: OperationId;
};

export type BulkOperationIdResponse = {
    operationId: OperationId;
};

export type BulkStagingDTO = {
    operationId: OperationId;
};

export type BulkStagingClientJobDTO = BulkStagingDTO & {
    clientJobId: number;
}
