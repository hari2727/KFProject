import { KfTarcContentInterface as Kf } from './kftarc-content.interface';
import * as utils from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { groupBy } from '../../_shared/collection/collection';

export class KfTarcUtil {
    rules(obj: Kf.ContentBody) {
        const bsCondition = obj.JobSectionCode === Kf.Skills.BEHAVIORAL_SKILLS;
        const tsCondition = obj.JobSectionCode === Kf.Skills.TECHNICAL_SKILLS;

        return {
            ruleOne: bsCondition || tsCondition,
            ruleTwo: bsCondition,
            ruleThree: tsCondition,
        };
    }

    ruleOne(body: Kf.ContentBody[][]): Kf.RuleResult {
        const result = [];
        const ranks = [];
        const deleteArrayById = [];
        body.map((parent, i) => {
            let behav = 0;
            let tech = 0;
            parent.map(child => {
                if (this.rules(child).ruleTwo) {
                    child.rank = ranks.length + 1 + '';
                    behav++;
                }
                if (this.rules(child).ruleThree) {
                    child.rank = ranks.length + 1 + '';
                    tech++;
                }
            });
            const condition = behav === 0 || tech === 0;
            if (!condition) {
                deleteArrayById.push(i);
                if (ranks.length < 5) {
                    ranks.push(i);
                    result.push(...parent);
                }
            }
        });
        return { result, deleteArrayById };
    }

    ruleTwo(body: Kf.ContentBody[][], rankFromLastRule): Kf.RuleResult {
        const result = [];
        const ranks = [];
        const deleteArrayById = [];
        body.map((parent, i) => {
            let behav = 0;
            parent.map(child => {
                if (this.rules(child).ruleTwo) {
                    child.rank = +rankFromLastRule + ranks.length + 1 + '';
                    behav++;
                }
            });
            if (behav) {
                deleteArrayById.push(i);
                if (ranks.length < 5) {
                    ranks.push(i);
                    result.push(...parent);
                }
            }
        });
        return { result, deleteArrayById };
    }
    ruleThree(body: Kf.ContentBody[][], rankFromLastRule): Kf.RuleResult {
        const result = [];
        const deleteArrayById = [];
        const ranks = [];

        body.map((parent, i) => {
            let tech = 0;
            parent.map(child => {
                if (this.rules(child).ruleThree) {
                    child.rank = +rankFromLastRule + ranks.length + 1 + '';
                    tech++;
                }
            });
            if (tech) {
                deleteArrayById.push(i);

                if (ranks.length < 5) {
                    ranks.push(i);
                    result.push(...parent);
                }
            }
        });
        return { result, deleteArrayById };
    }

    groupByLearningAssetID(body: Kf.ContentBody[]): Kf.ContentBody[][] {
        const result: Kf.GroupById = groupBy(body, i => String(i.LearningAssetID));

        const bucketInSort = (a, b) => {
            if (b.LearningAssetName.toString().toUpperCase() > a.LearningAssetName.toString().toUpperCase()) {
                return -1;
            }
            if (b.LearningAssetName.toString().toUpperCase() < a.LearningAssetName.toString().toUpperCase()) {
                return 1;
            }
            return 0;
        };

        const bucketOutSort = (a: Kf.ContentBody[], b: Kf.ContentBody[]) => {
            if (b[0].LearningAssetName.toString().toUpperCase() > a[0].LearningAssetName.toString().toUpperCase()) {
                return -1;
            }
            if (b[0].LearningAssetName.toString().toUpperCase() < a[0].LearningAssetName.toString().toUpperCase()) {
                return 1;
            }
            return 0;
        };

        const sortCallback = (a: Kf.ContentBody[], b: Kf.ContentBody[]) => {
            if (b.length === a.length) {
                return bucketOutSort(a, b);
            }
            return b.length - a.length;
        };
        const sort = Object.values(result).sort(sortCallback);

        return sort.map(o => o.sort(bucketInSort));
    }

    mapLearningContent = (learningContent: Kf.ContentBody[]) => {
        const mappedData = [];
        learningContent.map(obj => {
            const findSectionCode = utils.find(mappedData, `id`, obj.JobSectionID);

            if (!findSectionCode.found) {
                const section = {
                    id: obj.JobSectionID,
                    name: obj.JobSectionname,
                    code: obj.JobSectionCode,
                    categories: [this.createCategory(obj)],
                };
                return mappedData.push(section);
            }

            const category = utils.find(mappedData[findSectionCode.index].categories, `id`, obj.JobCategoryID);
            if (!category.found) {
                return mappedData[findSectionCode.index].categories.push(this.createCategory(obj));
            }

            const subCategories = utils.find(mappedData[findSectionCode.index].categories[category.index].subCategories, `spCode`, obj.JobSubcategoryCde);
            if (!subCategories.found) {
                return mappedData[findSectionCode.index].categories[category.index].subCategories.push(this.createSubCategory(obj));
            }
            return mappedData[findSectionCode.index].categories[category.index].subCategories[subCategories.index].learningContent.push(
                this.createLearningContent(obj),
            );
        });

        return { sections: mappedData };
    };

    protected createCategory(obj) {
        return {
            id: obj.JobCategoryID,
            name: obj.JobCategoryName,
            subCategories: [this.createSubCategory(obj)],
        };
    }

    protected createSubCategory(obj) {
        return {
            id: obj.JobSubcategoryID,
            spCode: obj.JobSubcategoryCde,
            globalCode: obj.GlobalSubCategoryCode,
            descriptions: [
                {
                    name: obj.JobSubCategoryName,
                },
            ],
            learningContent: [this.createLearningContent(obj)],
        };
    }

    protected createCategoryMod(obj) {
        return {
            id: obj.JobCategoryID,
            name: obj.JobCategoryName,
            // subCategories: [this.createLearningContentWithMod(obj)],
            subCategories: [this.createSubCategoryMod(obj)],
        };
    }

    protected createSubCategoryMod(obj) {
        return {
            id: obj.JobSubcategoryID,
            spCode: obj.JobSubcategoryCde,
            globalCode: obj.GlobalSubCategoryCode,
            descriptions: [
                {
                    name: obj.JobSubCategoryName,
                },
            ],
            learningContent: [this.createLearningContentWithMod(obj)],
        };
    }

    protected createLearningContent(obj) {
        return {
            id: Number(obj.LearningAssetID),
            name: obj.LearningAssetName,
            description: obj.LearningAssetDescription,
            rank: Number(obj.rank),
        };
    }

    protected createLearningContentWithMod(obj) {
        const getModality = (input, result = []) => {
            input.split('|').forEach(o => {
                const [type, durationInMillis, directURL, thumbImageURL] = o.split('~');
                const singletonObj = {} as any;

                if (type) {
                    singletonObj.type = type;
                }
                if (durationInMillis) {
                    singletonObj.durationInMillis = +durationInMillis;
                }
                if (directURL) {
                    singletonObj.directURL = directURL;
                }
                if (thumbImageURL) {
                    singletonObj.thumbImageURL = thumbImageURL;
                }

                result.push(singletonObj);
            });
            return result;
        };

        return {
            id: obj.LearningAssetID,
            name: obj.LearningAssetName,
            description: obj.LearningAssetDescription,
            tiCourseId: obj.CourseID,
            displayMessage: obj.MessageToDisplay,
            modality: getModality(obj.ModalityDurationDirectURLImage),
        };
    }

    addDelimiter(data: (string | number)[], delimiter: string) {
        // maybe should be replaced by: return data.join(delimiter);
        let output = '';

        for (let i = 0; i < data.length; i++) {
            output += data[i];
            if (i != data.length - 1) {
                output += delimiter;
            }
        }
        return output;
    }

    /* Mapping Learning content failed
     */
    @MapErrors({ errorCode: ec.MAPPING_LEARNING_CONTENT_ERR })
    @LogErrors()
    mapLearningContentPost(learningContent: Kf.ContentBody[]) {
        const mappedData = [];
        learningContent.forEach(obj => {
            const findSectionCode = utils.find(mappedData, `id`, obj.JobSectionID);
            if (!findSectionCode.found) {
                const section = {
                    id: obj.JobSectionID,
                    name: obj.JobSectionname,
                    code: obj.JobSectionCode,
                    categories: [this.createCategoryMod(obj)],
                };
                return mappedData.push(section);
            }

            const category = utils.find(mappedData[findSectionCode.index].categories, `id`, obj.JobCategoryID);
            if (!category.found) {
                return mappedData[findSectionCode.index].categories.push(this.createCategoryMod(obj));
            }

            const subCategories = utils.find(mappedData[findSectionCode.index].categories[category.index].subCategories, `spCode`, obj.JobSubcategoryCde);
            if (!subCategories.found) {
                return mappedData[findSectionCode.index].categories[category.index].subCategories.push(this.createSubCategoryMod(obj));
            }
            return mappedData[findSectionCode.index].categories[category.index].subCategories[subCategories.index].learningContent.push(
                this.createLearningContentWithMod(obj),
            );
        });

        return { sections: mappedData };
    }
}
