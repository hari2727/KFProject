import { QueryValues, QueryParamKeys, BoolParams, RequestType } from './kfhub-critical-experience.interface';
let requestType: RequestType;
export class Util {
    static set reqType(input) {
        requestType = input;
    }
    static get reqType() {
        return requestType;
    }
    static checkQueryParams = (query): BoolParams => {
        const bool = {
            mockData: false,
            experience: false,
        };

        if (
            query[QueryParamKeys.outputType] &&
            query[QueryParamKeys.outputType].toUpperCase() === QueryValues.OUTPUTTYPE &&
            query[QueryParamKeys.type] &&
            query[QueryParamKeys.type].toUpperCase() === QueryValues.TYPE
        ) {
            bool.mockData = true;
        }

        if (query[QueryParamKeys.successProfileId] && query[QueryParamKeys.successProfileId].length !== 0) {
            bool.experience = true;
        }

        return bool;
    };

    static templateValidationMessages = errors => {
        if (errors && errors.length > 0) {
            const errMsgs = [];
            errors.forEach(error => {
                if (error.constraints) {
                    const property = error.property;
                    const value = error.value;
                    const constraint = Object.keys(error.constraints)[0];
                    const message = error.constraints[constraint];
                    const errMsg = { value, property, constraint, message };
                    errMsgs.push(errMsg);
                }

                if (error.children && error.children.length > 0) {
                    const childrenErrorMsgs = Util.templateValidationMessages(error.children);
                    errMsgs.push(...childrenErrorMsgs);
                }
            });

            return errMsgs;
        }
    };
}
