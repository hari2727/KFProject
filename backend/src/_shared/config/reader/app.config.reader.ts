import { ConfigReader } from './reader';
import { AppConfig } from './../../../dtos';
import { registerConfigReader } from './registry';

export class AppConfigReader implements ConfigReader {
    protected config: any;
    private static readonly REGISTRY_KEY = 'app-config-memory-reader';

    constructor(data: AppConfig) {
        this.config = data;
        // Register with our custom identifier
        registerConfigReader(AppConfigReader.REGISTRY_KEY, this);
    }

    get(key: string): string {
        return this.config[key];
    }
}
