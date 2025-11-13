import {
  GetSecretValueCommand,
  SecretsManagerClient,
  SecretsManagerServiceException,
} from '@aws-sdk/client-secrets-manager';
import { KF1Logger } from './../logger';

export const fetchSecrets = async (secretName: string, awsRegion: string) => {
  try {
    const client = new SecretsManagerClient({
      region: awsRegion,
    });

    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found or contains no data.`);
    }

    return JSON.parse(response.SecretString ?? '{}');
  } catch (error) {
    // Handle specific AWS SDK errors
    if (error instanceof SecretsManagerServiceException) {
      KF1Logger.error(`AWS Secrets Manager Error: ${error.message}`);
      if (error.name === 'ResourceNotFoundException') {
        KF1Logger.error(`Secret ${secretName} not found.`);
      }
    } else if (
      error.name === 'CredentialsError' ||
      error.name === 'CredentialsProviderError' ||
      error.message.includes('could not load credentials')
    ) {
      KF1Logger.error(
        'Credentials are unavailable or misconfigured:',
        error.message,
      );
    } else {
      KF1Logger.error('Error fetching secrets:', error.message);
    }
    throw error;
  }
};