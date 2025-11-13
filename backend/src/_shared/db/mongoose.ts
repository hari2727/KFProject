import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import * as path from 'node:path';
import { AuthMechanism } from 'mongodb';
import { ConfigService } from '../config/config.service';
import { toBoolean } from '../convert';

const buildURI = (...hostnames: string[]): string => 'mongodb://' + hostnames.join(',');

export const getMongooseConfig = (configService: ConfigService, dbNameEnvKey: string): MongooseModuleFactoryOptions => {

    const devConnection = configService.get('MONGO_CONNECTION_URL');
    if (devConnection) {
        return {
            uri: devConnection,
        };
    }

    const host = configService.get('MONGO_HOST');
    const replicaHost = configService.get('MONGO_REPLICA_HOST');
    const replicaName = configService.get('MONGO_REPLICA_NAME') || 'rs0';
    const dbName = configService.get(dbNameEnvKey) || dbNameEnvKey;
    const certFilePath = configService.get('MONGO_CERT_FILE');
    const authSource = configService.get('MONGO_DB_AUTH') || 'admin';
    const sslEnabled = toBoolean(configService.get('MONGO_SSL_ENABLED'));
    const username = configService.get('MONGO_U');
    const password = configService.get('MONGO_P');

    const options: MongooseModuleFactoryOptions = {
        uri: buildURI(host),
        dbName,
        retryWrites: false,
        tls: sslEnabled,
        ssl: sslEnabled,
        bufferCommands: false,
        // autoSelectFamily: true,
        socketTimeoutMS: 2000000,
        connectTimeoutMS: 45000,
    };

    if (username && password) {
        options.authMechanism = AuthMechanism.MONGODB_SCRAM_SHA1;
        options.authSource = authSource;
        options.auth = {
            username,
            password,
        };
    }

    if (replicaHost) {
        options.uri = buildURI(host, replicaHost);
        options.replicaSet = replicaName;
    }

    if (options.tls && certFilePath) {
        options.tlsAllowInvalidCertificates = true;
        options.tlsAllowInvalidHostnames = true;
        options.tlsCAFile = path.join(process.cwd(), certFilePath);
    }

    return options;
}
