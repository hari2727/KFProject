import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Global()
@Module({})
export class TypeOrmEntityModule {
    static forRoot(entities: EntityClassOrSchema[]): DynamicModule {
        const ee = TypeOrmModule.forFeature(entities);

        return {
            module: TypeOrmEntityModule,
            imports: [ee],
            exports: [ee],
        };
    }
}
