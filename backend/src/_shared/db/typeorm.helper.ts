import { DataSource } from 'typeorm';
import { escapeAndRunQueryWithParams, queryDataSets, templateInsert, updateByKeys } from './typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmHelper {

    constructor(readonly dataSource: DataSource) {
    }

    query<T = any>(query: string, params?: any, beforeQueryCallback?: (query: any, params: any, rawQuery?: any, rawParams?: any) => void): Promise<T> {
        return escapeAndRunQueryWithParams(this.dataSource, query, params, beforeQueryCallback);
    }

    queryDataSets<T = unknown>(sqlQuery: string, params?: any, divider = 'ResultSet'): Promise<T> {
        return queryDataSets(this.dataSource, sqlQuery, params, divider);
    }

    insert<T = any>(DTOs: T[], tableName: string, columnNames: string[], tupleValuesGenerator: (value: T) => any[]): Promise<any[]> {
        return templateInsert(this.dataSource, DTOs, tableName, columnNames, tupleValuesGenerator);
    }

    updateByKeys<T = any>(DTOs: T[], tableName: string, columnNames: string[], keyColumnNames: string[], tupleValuesGenerator: (value: T) => any[]): Promise<void> {
        return updateByKeys(this.dataSource, DTOs, tableName, columnNames, keyColumnNames, tupleValuesGenerator);
    }

}
