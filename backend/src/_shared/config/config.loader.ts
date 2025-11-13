import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig, AppEnvironment } from './../../dtos';
import { KF1Logger } from '../../logger/logger.service';

export class ConfigLoaderService {
    private readonly configUrl = process.env.CONFIG_URL;
    private readonly localConfigPath = path.resolve(process.cwd(), 'env.json');
    private readonly maxRetries = 3;
    private readonly retryInterval = 3000;

    async loadConfig(): Promise<AppConfig> {
        const config = await this.loadLocalConfig();
        try {
            // Try to load from remote first
            if (process.env.Environment) {
                const remoteConfig = await this.loadRemoteConfig();
                if (remoteConfig) {
                    return remoteConfig;
                }
            }
        } catch (error) {
            KF1Logger.warn('Failed to load remote config, falling back to local', error);
        }

        // Fallback to local config
        return config;
    }

    private async loadRemoteConfig(): Promise<AppConfig | null> {
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                const response = await axios.get(this.configUrl);
                if (response.status === 200) {
                    const data = Array.isArray(response.data) ? response.data[0] : response.data;
                    return data as AppConfig;
                }
            } catch (error) {
                if (i === this.maxRetries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, this.retryInterval));
            }
        }
        return null;
    }

    private async loadLocalConfig(): Promise<AppConfig | null> {
        try {
            if (fs.existsSync(this.localConfigPath)) {
                const configData = await fs.readFileSync(this.localConfigPath, 'utf8');
                return JSON.parse(configData) as AppConfig;
            } else {
                return { APP_ENV: AppEnvironment.local };
            }
        } catch (error) {
            throw new Error(`Failed to load local config: ${error.message}`);
        }
    }
} 