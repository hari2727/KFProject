import * as bodyParser from 'body-parser';

export const rawBodyMiddleware = bodyParser.raw({
    type: '*/*',
    limit: '100mb'
});
