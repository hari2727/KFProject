import { Injectable } from '@nestjs/common';
import { CypherService } from '../cypher/cypher.service';
import { ConfigEncryptedValueMarker } from './config.const';
import { globalInstances } from '../di/global-instances';
import { ConfigReader } from './reader/reader';

@Injectable()
export class ConfigService {
    protected encryptedMarker = ConfigEncryptedValueMarker;

    constructor(
        protected cypher: CypherService,
        protected reader: ConfigReader,
    ) {
        if (globalInstances && !globalInstances.Config) {
            globalInstances.Config = this;
        }
    }

    get(key: string): any {
        return this.getDecryptedValue(this.reader.get(key));
    }

    protected getDecryptedValue(value: any): any {
        if (typeof value === 'string' && value.startsWith(this.encryptedMarker)) {
            value = this.cypher.decryptValue(value.slice(this.encryptedMarker.length));
        }
        return value;
    }

}
