import { Delimiter, KFFilterExtract, KfFilterItemConfig, KfFilterMetadata, KfFilterMetadataDTO, KfFiltersResponse } from "./metadata.filter.i";

export const normalizeFiltersMetaData = (rows: KfFilterMetadataDTO[]): KfFilterMetadata[] => {
    return rows.map((row) => ({
        id: row.MethodValueID,
        name: row.MethodID === 'GRADES' ? 'CUSTOMGRADESET' : row.MethodID,
        value: row.MethodValueLabel,

        selectionType: row.SearchType,
        hasSubOptions: Boolean(row.JobSubFamilyID || row.JobSubFamilyName || row.GradeSetID || row.GradeSetName),

        optionId: row.GradeSetID ?? row.LevelID,
        optionName: row.GradeSetName ?? row.LevelName,
        optionValue: row.GradeSetName ?? row.LevelName,
        optionOrder: Number(row.LevelOrder) || 0,

        optionType:
            row.MethodID === 'BENCHMARK_JOB' && row.LevelName === 'Non-Benchmark Job'
                ? 'NON_BENCHMARK_JOB'
                : row.MethodID === 'CUSTOMGRADESET'
                    ? 'CUSTOMGRADES'
                    : row.MethodID === 'FUNCTIONS'
                        ? 'SUBFUNCTIONS'
                        : row.MethodID,

        optionDescription: row.Description ?? undefined,

        subOptionId: row.JobSubFamilyID ?? row.LevelID,
        subOptionName: row.JobSubFamilyID ?? row.LevelID,
        subOptionValue: row.JobSubFamilyName ?? row.LevelName,
    }));
};

export const buildFiltersResponse = (rows: KfFilterMetadata[]): KfFiltersResponse => {
    const filters: KfFilterItemConfig[] = [];

    for (const row of rows) {
        let filter = filters.find((i) => i.id === row.id);
        if (!filter) {
            filter = {
                id: row.id,
                name: row.name,
                selectionType: row.selectionType,
                value: row.value,
                options: [],
            };
            filters.push(filter);
        }

        let option = filter.options.find((o) => o.id === row.optionId && o.type === row.optionType);
        if (!option) {
            option = {
                id: row.optionId,
                name: row.optionName,
                value: row.optionValue,
                type: row.optionType,
                description: row.optionDescription,
                order: row.optionOrder,
            };
            filter.options.push(option);
        }

        if (row.hasSubOptions) {
            option.searchOn = option.searchOn || {
                name: row.optionType,
                subOptions: [],
            };

            option.searchOn.subOptions.push({
                id: row.subOptionId,
                name: row.subOptionName,
                value: row.subOptionValue,
                order: row.optionOrder,
            });
        }
    }

    filters.forEach((f) => {
        if (f.options) {
            f.options.sort((a, b) => a.order - b.order);
            f.options.forEach((o) => {
                if (o.searchOn && o.searchOn.subOptions) {
                    o.searchOn.subOptions.sort((a, b) => a.order - b.order);
                }
            });
        }
    });

    return {
        metadata: [
            {
                id: '4',
                name: 'SEARCH_SUCCESS_PROFILES',
                value: 'Levels',
                searchType: 'Levels',
                searchOn: filters,
            },
        ],
    };
};

export const extractSpecificFilters = (filterBy: string, filterValues: string, customFilterNames: string[]): KFFilterExtract => {

    const filterByArr = (filterBy || '').replace(/'/gi, '').split(Delimiter.PIPE);
    const filterValuesArr = (filterValues || '').replace(/'/gi, '').split(Delimiter.PIPE);

    if (filterByArr.length !== filterValuesArr.length) {
        throw `filterBy and filterValues doesn't match`;
    }

    const specificFilterValues: { [ filterName: string ]: string } = {};
    const ignoreIndexes: number[] = [];

    for (const filterName of customFilterNames) {
        specificFilterValues[filterName] = null;
        const index = filterByArr.findIndex(o => o === filterName);
        if (index > -1) {
            ignoreIndexes.push(index);
            const value = filterValuesArr[index].split(Delimiter.COLON).filter(Boolean).join(Delimiter.COMMA);
            if (value.length) {
                specificFilterValues[filterName] = value;
            }
        }
    }

    const updatedFilterBy = filterByArr.filter((_, index) => !ignoreIndexes.includes(index)).join(Delimiter.PIPE);
    const updatedFilterValues = filterValuesArr.filter((_, index) => !ignoreIndexes.includes(index)).join(Delimiter.PIPE);

    return {
        filterBy: updatedFilterBy.length ? updatedFilterBy : null,
        filterValues: updatedFilterValues.length ? updatedFilterValues : null,
        specific: specificFilterValues
    };
};
