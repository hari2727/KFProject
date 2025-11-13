import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TestEntity } from './test.entity';
import { TypeOrmHelper } from '../../db/typeorm.helper';

let i = 0;

@Injectable()
export class TestRepository extends Repository<TestEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(TestEntity, sql.dataSource.createEntityManager());
        console.log(`TestRepository ${++i}`);
    }

    async test(): Promise<any> {
        return this.query('SELECT (5+5) as T');
    }
}
