import { ConfigReader } from './reader';
import { readFileSync } from 'node:fs';
import { registerConfigReader } from './registry';
import * as JSON5 from 'json5';

export class JsonConfigReader implements ConfigReader {
    protected config: any;

    constructor(path: string) {
        this.config = JSON5.parse(readFileSync(path, 'utf8'));
        registerConfigReader(path, this);
    }

    get(key: string): string {
        return this.config[key];
    }
}
