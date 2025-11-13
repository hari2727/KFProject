import { Global, Module } from '@nestjs/common';
import { TypeOrmHelper } from './typeorm.helper';

@Global()
@Module({
    providers: [
        TypeOrmHelper,
    ],
    exports: [
        TypeOrmHelper,
    ],
})
export class TypeOrmAppModule { }
