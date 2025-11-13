import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger';
import { globalInstances } from '../di/global-instances';
import { ConfigService } from '../config/config.service';
import { KF1Logger } from '../../logger/logger.service';

@Injectable()
export class Loggers {

    constructor(configService: ConfigService) {
        globalInstances.Logger ??= this.getLogger('Default');
    }

    getLogger(context?: string): LoggerService {
        return KF1Logger;
    }
}
