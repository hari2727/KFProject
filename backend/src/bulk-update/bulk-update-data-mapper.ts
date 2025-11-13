import { Injectable } from "@nestjs/common";
import { BulkStagingClientJobDTO } from "./bulk-update.types";

@Injectable()
export class BulkUpdateDataMapper {

    createStagingClientJobDTOs(operationId: number, clientJobIds: Array<string | number>): BulkStagingClientJobDTO[] {
        return clientJobIds.map(id => ({
            operationId,
            clientJobId: Number(id),
        }));
    }

}
