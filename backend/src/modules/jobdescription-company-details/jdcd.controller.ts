import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { handleCallback } from "../../common/response";
import { UserService } from "../../common/user/user.service";
import { tryCustomClientIdValue, tryCustomLocaleValue } from "../../common/request.util";
import { JobDescriptionCompanyDetailsService } from "./jdcd.service";
import { OverriddenClientQuery } from "../../common/common.interface";
import { JobDescriptionCompanyDetailsRoute } from "./jdcd.route";
import { filterLocaleValue } from '../../_shared/safety';

@Controller(JobDescriptionCompanyDetailsRoute.BASE)
export class JobDescriptionCompanyDetailsController {

    constructor(
        protected userService: UserService,
        protected service: JobDescriptionCompanyDetailsService,
    ) {}

    protected async overrideQuery<T extends OverriddenClientQuery>(request: Request, query: T): Promise<T> {
        const clientId = Number(await tryCustomClientIdValue(request, this.userService, query.preferredClientId));
        if (!clientId || clientId < 1) {
            throw `No valid clientId provided`;
        }

        const locale = tryCustomLocaleValue(request, query.preferredLocale);
        if (!filterLocaleValue(locale)) {
            throw `No valid locale provided`;
        }

        return {
            ...query,
            locale,
            loggedInUserClientId: clientId,
        };
    }

    @Get()
    async getJobDescriptionCompanyDetails(
        @Res() response: Response,
        @Req() request: Request,
        @Query() query: OverriddenClientQuery,
    ): Promise<void> {
        /*
            raw: true and all this stuff below to simulate original wM's response format
         */
        await handleCallback(response, async () => {
            try {
                return {
                    success: true,
                    responseCode: "RES.20000",
                    responseMessage: null,
                    data: await this.service.getCompanyDetails(await this.overrideQuery(request, query)),
                    status: {
                        code: "RES.200",
                        message: "",
                    },
                    error: {}
                };
            } catch (e: any) {
                const code = "APP.30065";
                const message = e ? (e?.message ?? e) : null;
                throw {
                    success: false,
                    responseCode: code,
                    responseMessage: message,
                    data: null,
                    status: {
                        code,
                        message,
                    },
                    error: {
                        code,
                        message,
                    }
                };
            }
        }, {
            raw: true
        });
    }

}
