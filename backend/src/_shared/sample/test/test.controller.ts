import {
    BadGatewayException,
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Query,
    Res
} from '@nestjs/common';
import { LogErrors } from '../../log/log-errors.decorator';
import { ConfigService } from '../../config/config.service';
import { AppError } from '../../error/app-error';
import { HttpsService } from '../../https/https.service';
import { Loggers } from '../../log/loggers';
import { createAppSuccessResponse } from '../../response/response';
import { Response } from 'express';
import { readFileSync } from 'node:fs';
import { AppResponse } from '../../response/app-response';
import { LogExecution } from '../../log/log-execution.decorator';
import { Headers } from '@nestjs/common/decorators/http/route-params.decorator';
import { setExecutionStats } from '../../log/log-execution';
import { ContextError } from '../../error/context-error';

@Controller('test')
export class TestController {

    constructor(
        protected config: ConfigService,
        protected https: HttpsService,
        protected loggers: Loggers,

        // @InjectModel(INTERVIEW_GUIDE_MODEL, MongoDbConnectionName.SuccessProfile)
        // protected preferencesData: Model<any>,

        // @InjectRepository(TestEntity)
        // protected repo: Repository<TestEntity>,

        // protected customRepo: TestRepository,
    ) {}

    @Get()
    @LogExecution({ args: true })
    async perform(
        @Query() query: any,
        @Headers() req: any,
        @Body() body: any,
    ): Promise<any> {
        // return setExecutionStats(null, 'moar');
        const resp = await this.delegated('всем бы так жить', query);

        return setExecutionStats(resp, { stringOhMyString: { it_took_4_sec: true } });

        return setExecutionStats(createAppSuccessResponse({
            status: 'всем бы так жить'
        }, { status: 201 }), { label: '100 yeats!' });
        throw 'ww';
        throw new BadGatewayException('qwerty', { cause: '123' });
        throw new BadRequestException();
        throw new BadRequestException(`invalid request body`);
        throw 'clientId is unknown';
        throw new ContextError('ClientId is unknown', {
            clientId: 123
        });
        throw false;
        throw new HttpException('go away', 300);
        throw new Error(process.env['AWS_SECRET_ACCESS_KEY']);
        return 'qwe'
    }

    @LogExecution()
    protected async delegated(message: string, query: any): Promise<any> {
        if (query.e !== undefined) {
            throw '(/Users/oleg.bezuglov/Work/kfhub_arch_svc_nest/src/_shared/sample/test/test.controller.ts:78:1';
        }
        return Object.keys(query);
    }

    @Post()
    @LogErrors()
    async performPost(): Promise<any> {
        return 'posted'
    }

    @Get('download')
    @LogErrors()
    async downloadFile(@Res() res: Response): Promise<any> {
        // return new AppResponse({
        //     status: 200,
        //     headers: {
        //         'Content-Type': 'application/octet-stream',
        //         'Content-Disposition': `attachment; filename=test.txt`,
        //     },
        //     data: readFileSync(__dirname + '/../../../../kfhub_arch_svc_nest.tar.gz')
        // });
        // res.setHeader('Content-Type', 'text/plain');
        // res.setHeader('Content-Disposition', `attachment; filename=test.txt`);
        // res.status(200);
        //
        // return res.send(readFileSync(__dirname + '/../../../../kfhub_arch_svc_nest.tar.gz'));
        //
        // throw new AppError('qwerty', 500, { cause: { date: new Date}});
        // throw new HttpException('go away', 300);
        // throw new Error(process.env['AWS_SECRET_ACCESS_KEY']);
        // return 'posted'
    }
}
