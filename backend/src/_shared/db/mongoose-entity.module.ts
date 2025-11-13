import { DynamicModule, Global, Module } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Global()
@Module({})
export class MongooseEntityModule {
    static forRoot(connectionName: string, definitions: ModelDefinition[] | Record<string, Schema>): DynamicModule {
        if (!Array.isArray(definitions)) {
            definitions = Object.entries(definitions).map(([name, schema])=> ({ name, schema }));
        }
        const ee = MongooseModule.forFeature(definitions, connectionName);

        return {
            module: MongooseEntityModule,
            imports: [ee],
            exports: [ee],
        };
    }
}
