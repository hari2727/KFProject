import { toArrayOr } from '../convert';
import { ConfigReader } from './reader/reader';
import { ConfigService } from './config.service';
import { getDefaultCypherService } from '../cypher/cypher';

export const configValueToArray = (value: any, delimiter: string = '|'): any[] => {
    return toArrayOr(
        typeof value === 'string'
            ? value.split(delimiter).map(i => i.trim())
            : value
    );
}

export const getConfigService = (reader: ConfigReader): ConfigService => {
    return new ConfigService(getDefaultCypherService(), reader);
}
