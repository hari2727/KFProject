import { Repository } from 'typeorm';

export const getCurrentTimeStamp = async (repository: Repository<any>): Promise<Date> =>
    (await repository.query('SELECT CURRENT_TIMESTAMP as t'))[0].t;
