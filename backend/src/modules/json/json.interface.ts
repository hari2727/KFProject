export interface GetJsonRequest {
    id: string;
    clientId: string;
}

export interface StoreJsonRequest extends GetJsonRequest {
    json: object;
}

export interface RemoveJsonRequest {
    ids: string;
    clientId: string;
}

export interface JsonUpdateResponse {
    id: number;
    json: object;
    modifiedOn: Date;
}

export interface GetJsonResponse extends JsonUpdateResponse {
}

export interface StoreJsonResponse extends JsonUpdateResponse {
}

export interface RemoveJsonResponse {
    ids: number[];
    clientId: number;
}
