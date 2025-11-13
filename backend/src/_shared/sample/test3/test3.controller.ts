import { Controller, Get, Post } from '@nestjs/common';
import { LogErrors } from '../../log/log-errors.decorator';
import { ConfigService } from '../../config/config.service';
import { AppError } from '../../error/app-error';
import { HttpsService } from '../../https/https.service';
import { Loggers } from '../../log/loggers';
// import { InjectModel } from '@nestjs/mongoose';
// import { USER_JOB_PREFERENCES } from '../../../models/schemas/kfarch-user-job-preferences.schema';
// import { Model } from 'mongoose';
// import { MongoDbConnectionName } from '../../../models/mongo-db.const';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from '../test/test.entity';
import { TestRepository } from '../test/test.repository';

@Controller('test3')
export class Test3Controller {
    constructor(
        protected config: ConfigService,
        protected https: HttpsService,
        protected logFactory: Loggers,

        // @InjectModel(INTERVIEW_GUIDE_MODEL, MongoDbConnectionName.SuccessProfile)
        // protected preferencesData: Model<any>,

        @InjectRepository(TestEntity)
        protected repo: Repository<TestEntity>,

        protected customRepo: TestRepository,
    ) {}

    @Get()
    async perform(): Promise<any> {
        // return createAppSuccessResponse(123, { message: "privet", code: "всем бы так жить", status: 201 });
        // console.log(this.config);
        // console.log(this.https.delete);
        // console.log(this.logFactory);
        // console.log(this.preferencesData);

        console.log(this.repo);

        console.log(await this.repo.query('SELECT (1+1) AS T'))

        console.log(this.customRepo)
        console.log(await this.customRepo.test())

        // console.log(await this.jobRepository.test2())
        // throw new BadRequestException(`invalid request body`);
        // throw 'clientId is unknown';
        // throw new ContextError('ClientId is unknown', {
        //     clientId: 123
        // });
        // throw false;
        // throw new HttpException('go away', 300);
        // throw new Error(process.env['AWS_SECRET_ACCESS_KEY']);
        return 'qwe'
    }

    @Post()
    // @NormalizeErrors({ message: 'tf' })
    @LogErrors()
    async performPost(): Promise<any> {
        // throw new AppError('qwerty', 500, { cause: { date: new Date}});
        // throw new HttpException('go away', 300);
        // throw new Error(process.env['AWS_SECRET_ACCESS_KEY']);
        return 'posted'
    }
}
