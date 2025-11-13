import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { KF1Logger } from '../../logger/logger.service';

@Injectable()
export class CypherService {

    protected secret: string;

    constructor(
        protected cypherAlgorithm: string,
        secret: string,
    ) {
        this.secret = this.formatKeyTo16(String(secret) || String(undefined));
    }

    formatKeyTo16(secret: string): string {
        const ivKeyLength = 16;
        return secret.length !== ivKeyLength ? secret.repeat(Math.ceil(16 / secret.length)).slice(0, ivKeyLength) : secret;
    }

    decryptValue(value: string): string {
        let retVal = null;
        try {
            const cryptoKey = crypto.createDecipheriv(this.cypherAlgorithm, this.secret, this.secret);
            const decryptedValue = cryptoKey.update(value, 'hex', 'utf8');
            retVal = decryptedValue + cryptoKey.final('utf8');
        } catch (e: any) {
            KF1Logger.error('Failed to decrypt value', e);
        }
        return retVal;
    }

    encryptValue(value: string): string {
        let retVal = null;
        try {
            const cryptoKey = crypto.createCipheriv(this.cypherAlgorithm, this.secret, this.secret);
            const encryptedValue = cryptoKey.update(value, 'utf8', 'hex');
            retVal = encryptedValue + cryptoKey.final('hex');
        } catch (e: any) {
            KF1Logger.error('Failed to encrypt value', e);
        }
        return retVal;
    }
}
