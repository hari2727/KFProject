import { ForbiddenException } from '@nestjs/common';
import { RequestMeta } from './request-meta.i';

export const assertIsSuperUser = (meta: RequestMeta): void => {
    if (!meta?.isSuperUser) {
        throw new ForbiddenException();
    }
}
