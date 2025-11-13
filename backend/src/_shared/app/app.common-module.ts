import { Global, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RequestMetaService } from '../request/meta/request-meta.service';
import { RequestMetaRawReader } from '../request/meta/request-meta.reader';

@Global()
@Module({
    providers: [
        UserService,
        RequestMetaService,
        RequestMetaRawReader,
    ],
    exports: [
        UserService,
        RequestMetaService,
        RequestMetaRawReader,
    ],
})
export class AppCommonModule { }
