import { Injectable } from "@nestjs/common";
import { JobProperty, JobPropertyQueryResponse, SubProperty } from "./job-properties.interface";

@Injectable()
export class JobPropertyTransformer {

    public transform(jobPropertiesDbResponse: JobPropertyQueryResponse[]): JobProperty[] {

        const jobPropertyMap: { [key: number]: JobProperty } = {};

        jobPropertiesDbResponse.forEach((entry) => {

            const jobPropertyID = Number(entry.JobPropertyID); // Convert JobPropertyID to a number
            const displayOrder = Number(entry.PropDisplayOrder); // Ensure PropDisplayOrder is a number

            if (!jobPropertyMap[jobPropertyID]) {
                jobPropertyMap[jobPropertyID] = {
                    id: jobPropertyID,
                    name: entry.JobPropertyName,
                    isActive: Boolean(entry.DisplayJobProperty),
                    isRequired: Boolean(entry.IsRequired),
                    isMultiSelected: Boolean(entry.IsMultiSelected),
                    code: entry.JobPropertyCode,
                    displayOrder,
                };
            }

            // Check for all possible null representations
            const isValueValid =
                entry.JobPropertyValueID !== null &&
                entry.JobPropertyValueID !== "null" &&
                entry.JobPropertyValueID !== "NULL" &&
                entry.JobPropertyValueID !== "" &&
                entry.JobPropertyValueID !== undefined &&
                (typeof entry.JobPropertyValueID === "string" ? entry.JobPropertyValueID.trim() !== "" : true);

            // Add SubProperty if the value is valid
            if (isValueValid) {
                const subPropertyID = Number(entry.JobPropertyValueID); // Convert JobPropertyValueID to a number
                const subPropDisplayOrder = Number(entry.SubPropDisplayOrder); // Convert SubPropDisplayOrder to a number

                const prop: SubProperty = {
                    id: subPropertyID,
                    name: entry.JobPropertyValueName,
                    noOfSuccessProfiles: entry.JobCount,
                    displayOrder: subPropDisplayOrder,
                };
                const currentJob = jobPropertyMap[entry.JobPropertyID];
                if (currentJob.props) {
                    currentJob.props.push(prop);
                } else {
                    currentJob.props = [prop];
                }
            }
        });

        // Convert map to array and sort by displayOrder
        const jobProperties = Object.values(jobPropertyMap);

        // Sort each JobProperty's props by displayOrder
        jobProperties.forEach((jobProperty) => {
            jobProperty.props?.sort((a, b) => a.displayOrder - b.displayOrder);
        });

        // Sort the main JobProperty array by displayOrder
        return jobProperties.sort((a, b) => a.displayOrder - b.displayOrder);
    }

}
