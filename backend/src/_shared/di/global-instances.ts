import { ConfigService } from '../config/config.service';
import { LoggerService } from '../../logger';

interface _GlobalInstances {
    Logger?: LoggerService;
    Config?: ConfigService;
}

export const globalInstances: _GlobalInstances = {};
