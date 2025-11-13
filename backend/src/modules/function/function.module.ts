import { Module } from '@nestjs/common';
import { FunctionService } from './function.service';
import { FunctionController } from './function.controller';
import { FunctionRepository } from './function.repository';

@Module({
    providers: [
        FunctionService,
        FunctionRepository,
    ],
    controllers: [
        FunctionController,
    ],
})
export class FunctionModule {}
