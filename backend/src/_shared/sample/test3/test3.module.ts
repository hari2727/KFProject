import { Module } from '@nestjs/common';
import { Test3Controller } from './test3.controller';
import { TestRepository } from '../test/test.repository';

@Module({
    providers: [
        TestRepository
    ],
    controllers: [Test3Controller],
})
export class Test3Module {}
