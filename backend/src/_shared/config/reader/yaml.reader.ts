import { parse } from 'yaml';
import { ConfigReader } from './reader';
import { readFileSync } from 'node:fs';
import { registerConfigReader } from './registry';

export class YamlConfigReader implements ConfigReader {
    protected config: any;

    constructor(path: string) {
        this.config = parse(readFileSync(path, 'utf8'));
        registerConfigReader(path, this);
    }

    get(key: string): any {
        return this.config[key];
    }
}
