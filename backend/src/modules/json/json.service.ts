import { Injectable } from '@nestjs/common';
import { GetJsonResponse, RemoveJsonResponse, StoreJsonResponse } from './json.interface';
import { SuccessProfileJsonRepository } from './json.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class SuccessProfileJsonService {

    constructor(
        protected repository: SuccessProfileJsonRepository,
    ) {}

    @LogErrors()
    async setJson(clientId: number, id: number, json: object): Promise<StoreJsonResponse> {
        try {
            return (await this.repository.insertFullJson(clientId, id, json));
        } catch (e) {
            return (await this.repository.updateFullJson(clientId, id, json));
        }
    }

    @LogErrors()
    async getJson(clientId: number, id: number): Promise<GetJsonResponse> {
            const data = await this.repository.selectFullJson(clientId, id);
            return {
                id: data.id,
                json: JSON.parse(data.json),
                modifiedOn: data.modifiedOn,
            };
    }

    @LogErrors()
    async removeJson(clientId: number, rawIds: string): Promise<RemoveJsonResponse> {
            const ids =
                decodeURIComponent(rawIds || '').split(',').map(i => parseInt(i.trim(), 10)).filter(Boolean);
            if (!ids.length) {
                throw new Error('No ids given');
            }
            await this.repository.removeFullJson(clientId, ids);
            return {
                ids,
                clientId,
            };
    }
}
