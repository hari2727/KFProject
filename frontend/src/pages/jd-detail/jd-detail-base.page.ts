import * as _ from 'lodash';

import { KfISpSection, KfISpSubCategory, KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import {
    findSecCodeEnumKeyByValue, SecCodeEnum, uniqSubCtgsFromSps
} from '@kf-products-core/kfhub_thcl_lib/domain';

import { CertSection, CertSectionModel, SubCtgSectionModel, TaskSectionModel, ToolSectionModel } from './jd-detail.model';

export class JdDetailBase {
    readonly subCtgSections = [
        SecCodeEnum.Resp,
        SecCodeEnum.BhvrSkills,
        SecCodeEnum.TchnSkills,
        SecCodeEnum.Education,
        SecCodeEnum.Experience
    ];

    readonly sections = new Map([
        [SecCodeEnum.Resp, 'pm.responsibilities'],
        [SecCodeEnum.Tasks, 'pm.tasks'],
        [SecCodeEnum.BhvrSkills, 'pm.behavioralCompetencies'],
        [SecCodeEnum.TchnSkills, 'pm.skills'],
        ['CERTIFICATIONS', 'pm.certificationTitle'],
        [SecCodeEnum.Tools, 'pm.tools'],
        [SecCodeEnum.Education, 'pm.education'],
        [SecCodeEnum.Experience, 'pm.experience'],
    ]);

    getSubCtgSectionsModel(job: KfISuccessProfile): SubCtgSectionModel[] {
        const subCtgsByCode = uniqSubCtgsFromSps([job], this.subCtgSections);
        return _.chain(job.sections)
            .filter(s => this.subCtgSections.includes(s.code as SecCodeEnum))
            .map(s => ({
                code: s.code,
                includeSection: !s['hideSection'],
                includeSubCategoryNames: !s['hideSubCategoryNames'],
                subCtgs: subCtgsByCode[findSecCodeEnumKeyByValue(s.code as SecCodeEnum)].map((subCtg: KfISpSubCategory) => ({
                    id: subCtg.id,
                    name: subCtg.descriptions[0].name,
                    description: s.code === SecCodeEnum.TchnSkills ? this.getTchnSectionSubCtgDesc(subCtg) : subCtg.descriptions[0].description,
                    // dependents: s.code === SecCodeEnum.TchnSkills ? _.chain(subCtg.dependents).map(d => d.name).join(', ').value() : undefined
                }))
            })).value();
    }

    getTasksSectionModel(sections: KfISpSection[]): TaskSectionModel {
        const tasksSection = _.chain(sections).find(['code', SecCodeEnum.Tasks]).value();
        if (tasksSection.tasks) {
            return {
                code: tasksSection.code,
                includeSection: !tasksSection['hideSection'],
                includeSubCategoryNames: !tasksSection['hideSubCategoryNames'],
                tasks: tasksSection.tasks.map(t => ({ id: t.id, name: t.name, }))
            };
        }
    }


    getToolsSectionModel(sections: KfISpSection[]): ToolSectionModel {
        const toolsSection = _.chain(sections).find(['code', SecCodeEnum.Tools]).value();
        if (toolsSection.toolsCommodities) {
            return {
                code: toolsSection.code,
                includeSection: !toolsSection['hideSection'],
                includeSubCategoryNames: !toolsSection['hideSubCategoryNames'],
                toolsCommodities: toolsSection.toolsCommodities.map(t => ({ code: +t.code, title: t.title, tools: t.tools }))
            };
        }
    }

    getCertsSectionModel(section: CertSection): CertSectionModel {
        if (section.certs) {
            return {
                code: section.code,
                includeSection: !section.hideSection,
                includeSubCategoryNames: !section.hideNames,
                certs: section.certs
            };
        }
    }

    private getTchnSectionSubCtgDesc(subCtg: KfISpSubCategory): string {
        const desc = subCtg.descriptions[0].description;

        const skillsStr = !_.isEmpty(subCtg.dependents) ? _.chain(subCtg.dependents).map(d => d.jobSkillComponentName).join(', ').value() : '';

        return desc ? skillsStr ? `${desc}\n\n${skillsStr}` : desc : skillsStr;
    }
}
