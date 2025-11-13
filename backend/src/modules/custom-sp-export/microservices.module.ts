import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { ClientProvider } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { ConfigService } from '../../_shared/config/config.service';

export const Kf1HCMExportRmqServiceName = 'KF1_HCM_EXPORT_RMQ_SERVICE';

const getRmqClientOptions = (config: ConfigService): Promise<ClientProvider> | ClientProvider => {
    const rmqUrl = config.get('KF1_RMQ_URL');
    const rmqUser = config.get('KF1_RMQ_USER');
    const password = config.get('KF1_RMQ_PASSWORD');
    const queue = config.get('KF1_HCM_EXPORT_QUEUE');
    const appName = config.get('APP_NAME');

    const connectionUrl = `amqps://${rmqUser}:${password}@${rmqUrl}`;

    return {
        transport: Transport.RMQ,
        options: {
            urls: [connectionUrl],
            queue: queue,
            noAck: true,
            queueOptions: {
                durable: true,
            },
            serializer: {
                serialize: value => {
                    const data = value.data;
                    data.properties = {
                        payloadId: randomUUID(),
                        traceId: value.id,
                        applicationId: appName,
                    };
                    return data;
                },
            },
        },
    };
};

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                inject: [ ConfigService ],
                name: Kf1HCMExportRmqServiceName,
                useFactory: (config: ConfigService) => getRmqClientOptions(config),
            }
        ]),
    ],
    exports: [
        ClientsModule,
    ],
})
export class MicroservicesModule {}
