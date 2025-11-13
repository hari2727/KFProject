import { Injectable } from '@nestjs/common';
import { IntelligenceCloudPermissionsDBResponse } from './icp.interface';
import { DataSource } from 'typeorm';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class IntelligenceCloudPermissionsDataService {

    constructor(protected dataSource: DataSource) {
    }

    @LogErrors()
    async isIntelligenceCloudClient(clientId: number): Promise<boolean> {
            const response: IntelligenceCloudPermissionsDBResponse[] =
                await this.dataSource.query(`exec SuccessProfile.dbo.CheckForICClient
                    @ClientID = ${clientId}
                `);
            if (response && response.length) {
                return Boolean(Number(response[0].IsICClient));
            }
            throw 'Invalid DB Response';
    }
}
