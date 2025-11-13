import { fetchSecrets, isLocal } from './../../utils';
import { DEFAULT_KF_SECURE_ENV_SECRET_PASSWORD, updateSecretEnvironmentVariable } from './../cypher/cypher';
import { KF1Logger } from '../../logger/logger.service';

interface ISecretManagerConfig {
    private_Key: string,
    public_certificate: string,
    kf_secure_env_secret_password: string,
}

const formatPemKey = (key: string): string => {
  if (!key) {
      throw new Error('Private key is empty or undefined');
  }

  return key.replace(/\\n/g, '\n');
};

export class SecretManagerConfig {
  private static instance: SecretManagerConfig;
  private privateKey: string = '';
  private publicCertificate: string = '';
  private secureEnvSecretPassword: string = '';
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): SecretManagerConfig {
    if (!SecretManagerConfig.instance) {
      SecretManagerConfig.instance = new SecretManagerConfig();
    }
    return SecretManagerConfig.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return; // Already initialized, no need to fetch again
    }
    /** Default AWS variables */
    const awsKeys = {
      secret: String(process.env.AWS_SECRET_NAME),
      region: String(process.env.AWS_REGION),
    };

    let certs = {
      private_Key: '',
      public_certificate: '',
      kf_secure_env_secret_password: DEFAULT_KF_SECURE_ENV_SECRET_PASSWORD,
    };

    /** Fetch AWS secrets for non-local environments */
    if (!isLocal()) {
      const { secret, region } = awsKeys;
      if (!secret || !region) {
        throw new Error(
          'AWS_SECRET_NAME or AWS_REGION is not defined in the environment variables',
        );
      }
      const awsSecrets = await fetchSecrets(secret, region);
      if (Object.keys(awsSecrets).length) {
        try {
          certs = {
            private_Key: formatPemKey(awsSecrets.private_Key),
            public_certificate: formatPemKey(awsSecrets.public_certificate),
            kf_secure_env_secret_password: awsSecrets.kf_secure_env_secret_password || DEFAULT_KF_SECURE_ENV_SECRET_PASSWORD,
          };
          // Validate the formatted key
          if (!certs.private_Key.includes('-----BEGIN RSA PRIVATE KEY-----') || 
              !certs.private_Key.includes('-----END RSA PRIVATE KEY-----')) {
            throw new Error('Invalid private key format');
          }
        } catch (error) {
          KF1Logger.error('Error formatting private key', error);
          throw error;
        }
      } else {
        throw new Error(
          `Unable to fetch secrets for secret name: ${secret} and region: ${region}`,
        );
      }
    }

    // Store the secrets in instance variables
    this.privateKey = certs.private_Key;
    this.publicCertificate = certs.public_certificate;
    this.secureEnvSecretPassword = certs.kf_secure_env_secret_password;
    this.initialized = true;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('SecretManagerConfig not initialized. Call initialize() first.');
    }
  }

  public get private_Key(): string {
    this.ensureInitialized();
    return this.privateKey;
  }

  public get public_certificate(): string {
    this.ensureInitialized();
    return this.publicCertificate;
  }

  public get kf_secure_env_secret_password(): string {
    this.ensureInitialized();
    return this.secureEnvSecretPassword;
  }

  public get isInitialized(): boolean {
    return this.initialized;
  }
}

// Keep the original function for backward compatibility (optional)
export const secretManagerConfig = async (): Promise<ISecretManagerConfig> => {
  const config = SecretManagerConfig.getInstance();
  await config.initialize();
  updateSecretEnvironmentVariable(config.kf_secure_env_secret_password);
  return {
    private_Key: config.private_Key,
    public_certificate: config.public_certificate,
    kf_secure_env_secret_password: config.kf_secure_env_secret_password,
  };
};