import { Injectable } from '@nestjs/common';
import { GetIntelligenceCloudPermissionsRequest, IntelligenceCloudPermissions } from './icp.interface';
import { IntelligenceCloudPermissionsDataService } from './icp.data.service';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class IntelligenceCloudPermissionsService {

    constructor(
        protected dataService: IntelligenceCloudPermissionsDataService,
    ) {}

    @LogErrors()
    async getPermissions(query: GetIntelligenceCloudPermissionsRequest): Promise<IntelligenceCloudPermissions> {
            const clientId = Number(query.clientId || query.loggedInUserClientId);
            if (!clientId) {
                throw `No valid clientId provided`;
            }
            return {
                isICClient: await this.dataService.isIntelligenceCloudClient(clientId),
            };
    }
}
