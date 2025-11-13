import { CypherService } from './cypher.service';
import { ConfigEncryptionAlgorithm, ConfigSecretEnvVariableName } from '../config/config.const';
export const DEFAULT_KF_SECURE_ENV_SECRET_PASSWORD = 'dev123';

export const updateSecretEnvironmentVariable = (value: string) => {
    process.env[ConfigSecretEnvVariableName] = value;
}

export const getDefaultCypherService = (secret?: string): CypherService => new CypherService(
    ConfigEncryptionAlgorithm,
    secret ?? process.env[ConfigSecretEnvVariableName] ?? DEFAULT_KF_SECURE_ENV_SECRET_PASSWORD
)
