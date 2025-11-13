import { DataSource } from 'typeorm';
import { toUnique } from '../collection/collection';
import { toStringOr } from '../convert';
import { isInstanceOf } from '../is';

interface ParsedTableName {
    database?: string;
    schema?: string;
    table: string;
}

export interface TableColumnMeta {
    columnName: string;
    dataType: string;
    characterMaximumLength?: number;
    numericPrecision?: number;
    numericScale?: number;
}

class _Raw {
    constructor(public readonly value) {}
}

export const Raw = (value: string): _Raw => new _Raw(toStringOr(value));

export const isRaw = (value: any): boolean => isInstanceOf(value, _Raw);

export const parseDbTableName = (input: string): ParsedTableName => {
    const parts: string[] = [];
    const len = input.length;
    let i = 0;

    while (i < len) {
        let value = '';
        if (input[i] === '[') {
            i++;
            while (i < len) {
                if (input[i] === ']') {
                    if (input[i + 1] === ']') {
                        value += ']'; // escaped ]
                        i += 2;
                    } else {
                        i++; // end of bracke
                        break;
                    }
                } else {
                    value += input[i++];
                }
            }
            parts.push(value);
        } else {
            while (i < len && input[i] !== '.') {
                value += input[i++];
            }
            parts.push(value.trim());
        }
        if (input[i] === '.') i++;
    }

    // Normalize empty schema in db..table
    if (parts.length === 3 && parts[1] === '') {
        parts[1] = 'dbo';
    }

    if (parts.length < 4 && parts.length) {
        return {
            table: parts.pop(),
            schema: parts.pop(),
            database: parts.pop(),
        };
    }

    throw 'Bad table name';
};

export const unescapeDbName = (input: string): string => {
    if (input.startsWith('[') && input.endsWith(']')) {
        return input.slice(1, -1).replace(/\]\]/g, ']');
    }
    return input;
};

export const escapeDbNameQuotes = (input: string): string => {
    return input.replace(/'/g, `''`);
};

export const escapeDbName = (input: string): string => {
    return '[' + input.replace(/\]/g, ']]') + ']';
};

export const escapeDbTableName = (input: string): string => {
    const parsed: ParsedTableName = parseDbTableName(input);
    if (!parsed) {
        return null;
    }
    return ['database', 'schema', 'table'].map(i => parsed[i] ? escapeDbName(parsed[i]) : false).filter(Boolean).join('.');
};

/*
const t = [
    'A.b.C',
    'A..C',
    'C',
    'b.C',
    '[A[a]]].[b].[C]',
    '[A [a]]]..[C]',
    '[C c]',
    '[C [c]]]',
    '[[b]]].[C]',
    '[b b].[C c]',
    '[A a]..[[C]]]',
    '[My DB]..[Table.Name]',
    '[A].[b].[C]]1]',
    '[ A ].[ b ].[ C]]1 ]',
    'schema.table',
    '[Table only]'
];

for (const tt of t) {
    console.log(tt, escapeDbTableName(tt))
}
 */
export const escapeLikePattern = (input: string): string => {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/\[/g, '\\[');
};

export const escapeQueryWithParams = (dataSource: DataSource, query: string, params: any): [string, any[]] => {
    return dataSource.driver.escapeQueryWithParameters(query, params, {});
};

export const escapeAndRunQueryWithParams = async <T = any>(dataSource: DataSource, query: string, params: any, beforeQueryCallback?: (query: any, params: any, rawQuery?: any, rawParams?: any) => void): Promise<T> => {
    const [escapedQuery, escapedParams] = escapeQueryWithParams(dataSource, query, params);
    if (beforeQueryCallback) {
        beforeQueryCallback(escapedQuery, escapedParams, query, params);
    }

    const logger = dataSource.logger;
    if (logger) {
        logger.log('info', {
            escapedQuery,
            escapedParams
        });
    }
    return await dataSource.query(escapedQuery, escapedParams);
};

export const packEntities = <T = any>(entities: T[], maxParams = 1500): T[][] => {
    const safeEntities: T[] = [...entities];
    const packs: T[][] = [];
    const packSize = Math.max(1, Math.floor(maxParams / (Object.keys(entities[0]).length || 1)));
    while (safeEntities.length) {
        packs.push(safeEntities.splice(0, packSize));
        if (packs.length > entities.length) {
            break;
        }
    }
    return packs;
};

export const calculatePackSize = (paramsPerRow: number): number =>
    Math.round(2000 / (paramsPerRow || 1));

export const queryDataSets = <T = unknown>(dataSource: DataSource, sqlQuery: string, params?: any, divider = 'ResultSet'): Promise<T> =>
    new Promise<T>(async (resolve, reject) => {
        if (params) {
            [ sqlQuery, params ] = escapeQueryWithParams(dataSource, sqlQuery, params);
        }
        const stream = await dataSource.createQueryRunner().stream(sqlQuery, params ?? []);
        const response = {} as T;
        let pointer: string;
        // @ts-ignore
        stream.on('data', (chunk: T) => {
            const resultSetName = chunk ? chunk[divider] : undefined;
            if (resultSetName) {
                pointer = resultSetName;
                response[pointer] = response[pointer] || [];
            } else if (pointer) {
                response[pointer].push(chunk);
            }
        });
        stream.on('end', () => resolve(response as T));
        stream.on('error', (e) => reject(e));
    });

export const buildInsertUpdateValuesQueryFragment =
    <T = any>(columnNames: string[], values: T[], valuesGenerator: (value: T) => any[])
    : { queryFragment: string; params: any; } => {
        const params = {};
        const indexedColumnNames = columnNames.map((columnName, index) => `Value_${index}`);
        const queryFragment = values.map((value, rowIndex) => {
            const tuple = valuesGenerator(value);
            if (!tuple) {
                return;
            }

            if (tuple.some(isRaw)) {
                const paramNames = indexedColumnNames.map((columnName, index) => {
                    const value = tuple[index] ?? null;
                    if (isRaw(value)) {
                        return value.value;
                    }

                    const paramName = `${columnName}_${rowIndex}`;
                    params[paramName] = value ;
                    return `:${paramName}`;
                });
                return `(${paramNames.join(', ')})`
            }

            const paramNames = indexedColumnNames.map(columnName => `${columnName}_${rowIndex}`);
            Object.assign(params,
                paramNames.reduce((tupleParams, paramName, i) => (tupleParams[paramName] = tuple[i] ?? null, tupleParams), {})
            );
            return `(${paramNames.map(placeholderName => `:${placeholderName}`).join(', ')})`

        }).filter(Boolean).join(', ');
        return { queryFragment, params };
    };

const buildTableColumnDefinition = (meta: TableColumnMeta): string => {
    const type = meta.dataType.toLowerCase();
    let typeDef = type;

    if (['char', 'nchar', 'varchar', 'nvarchar', 'binary', 'varbinary'].includes(type)) {
        typeDef += `( ${ meta.characterMaximumLength === -1 ? 'max' : (meta.characterMaximumLength ?? 1)})`;
    }
    else if (['decimal', 'numeric'].includes(type)) {
        typeDef += `(${ meta.numericPrecision ?? 18 }, ${ meta.numericScale ?? 0 })`;
    }
    else if (['datetime2', 'datetimeoffset', 'time'].includes(type)) {
        typeDef += `(${ meta.numericScale ?? 7 })`;
    }
    else if (['float'].includes(type)) {
        typeDef += `(${ meta.numericPrecision ?? 53 })`;
    }

    return `${escapeDbName(meta.columnName)} ${typeDef} NULL`;
};

export const getDbTableColumnsMeta = async (dataSource: DataSource, tableName: string): Promise<TableColumnMeta[]> => {
    const parsed = parseDbTableName(tableName);

    return (
        await escapeAndRunQueryWithParams(dataSource, `
            ${ parsed.database ? `USE ${parsed.database};` : ''}

            SELECT
                COLUMN_NAME as columnName,
                DATA_TYPE as dataType,
                CHARACTER_MAXIMUM_LENGTH as characterMaximumLength,
                NUMERIC_PRECISION as numericPrecision,
                NUMERIC_SCALE as numericScale
            FROM
                INFORMATION_SCHEMA.COLUMNS
            WHERE
                TABLE_NAME = '${ escapeDbNameQuotes(parsed.table) }'
                ${ parsed.schema ? `
                    AND
                TABLE_SCHEMA = '${ escapeDbNameQuotes(parsed.schema) }'
                ` : '' }
            ;
            `,
            {}
        )
    );
};

// todo: unit-tests
export const templateInsert = async <T = any>(dataSource: DataSource, DTOs: T[], tableName: string, columnNames: string[], tupleValuesGenerator: (value: T) => any[]): Promise<any[]> => {
    const ret: any[] = [];

    if (!DTOs?.length) {
        return ret;
    }

    let insertedOutputColumnNames: string = '';
    let insertedTableColumnDefinitions: string = '';
    let insertedTableColumnNames: string = '';
    try {
        const meta = await getDbTableColumnsMeta(dataSource, tableName);
        insertedOutputColumnNames = meta.map(meta => `inserted.${ escapeDbName(meta.columnName) }`).join(', ');
        insertedTableColumnDefinitions = meta.map(meta => buildTableColumnDefinition(meta)).join(', ');
        insertedTableColumnNames = meta.map(meta => escapeDbName(meta.columnName)).join(', ');
    } catch (e) {
    }

    const startQueryFragment = `
        ${ !!insertedTableColumnDefinitions ? `
            DECLARE @Inserted TABLE (${insertedTableColumnDefinitions});
        `: '' }
        INSERT INTO ${escapeDbTableName(tableName)} (${columnNames.map(escapeDbName).join(', ')})
        ${ !!insertedOutputColumnNames ? `
            OUTPUT ${ insertedOutputColumnNames } INTO @Inserted (${ insertedTableColumnNames })
        ` : ''}
        VALUES
    `;

    const tailQueryFragment = !!insertedTableColumnDefinitions
        ? `
            ;
            SELECT
                *
            FROM
                @Inserted
            ;
        `
        : '';

    for (const pack of packEntities(DTOs, calculatePackSize(columnNames.length))) {
        const { queryFragment, params } = buildInsertUpdateValuesQueryFragment(columnNames, pack, tupleValuesGenerator);
        if (!queryFragment) {
            continue;
        }
        const r = await escapeAndRunQueryWithParams(dataSource, `${startQueryFragment} ${queryFragment} ${tailQueryFragment}`, params);
        if (Array.isArray(r)) {
            ret.push(...r);
        }
    }

    return ret;
};

export const updateByKeys = async <T = any>(dataSource: DataSource, DTOs: T[], tableName: string, columnNames: string[], keyColumnNames: string[], valuesGenerator: (value: T) => any[]): Promise<void> => {
    const ret: any[] = [];

    if (!DTOs?.length) {
        return;
    }

    if (!columnNames.length) {
        throw 'No columnNames given';
    }

    if (columnNames.length !== toUnique(columnNames).length) {
        throw 'columnNames contains non-unique names';
    }

    if (!keyColumnNames.length) {
        throw 'No keyColumnNames given';
    }

    if (keyColumnNames.length !== toUnique(keyColumnNames).length) {
        throw 'keyColumnNames contains non-unique names';
    }

    for (const k of keyColumnNames) {
        if (!columnNames.includes(k)) {
            throw 'keyColumnNames is not a subset of columnNames';
        }
    }

    if (keyColumnNames.length >= columnNames.length) {
        throw 'No columns to update but keyColumnNames';
    }

    const _allColumnNames = columnNames.map(escapeDbName);
    const _keyColumnNames = keyColumnNames.map(escapeDbName);
    const _updateColumnNames = _allColumnNames.filter(i => !_keyColumnNames.includes(i));

    const startQueryFragment = `

            UPDATE t
            SET
                ${ _updateColumnNames.map(i => `t.${i} = v.${i}`).join(', ') }
            FROM
                ${ escapeDbTableName(tableName) } t
            JOIN
                (
                    VALUES
    `;
    const tailQueryFragment = `

                ) AS v (${ _allColumnNames.join(',') })
                    ON
                        ${ _keyColumnNames.map(i => `t.${i} = v.${i}`).join(' AND ') };
    `;

    for (const pack of packEntities(DTOs, calculatePackSize(columnNames.length))) {
        const { queryFragment, params } = buildInsertUpdateValuesQueryFragment(columnNames, pack, valuesGenerator);
        if (!queryFragment) {
            continue;
        }
        await escapeAndRunQueryWithParams(dataSource, `${startQueryFragment} ${queryFragment} ${tailQueryFragment}`, params);
    }
};
