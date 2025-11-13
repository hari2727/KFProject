/* eslint-disable max-classes-per-file */

export interface SectionBaseModel {
    code: string;
    includeSection: boolean;
    includeSubCategoryNames: boolean;
}

export interface SubCtgSectionModel extends SectionBaseModel {
    subCtgs: { id: number; name: string; description: string }[];
}
export interface TaskSectionModel extends SectionBaseModel {
    tasks: { id: number; name: string }[];
}
export interface ToolSectionModel extends SectionBaseModel {
    toolsCommodities: { code: number; title: string; tools: { id?: number; title?: string; isHotTool?: boolean; userEdited?: boolean }[] }[];
}
export interface TechSectionModel extends SectionBaseModel {
    technologyCommodities: { code: number; title: string; description: string }[];
}
export interface CertSectionModel extends SectionBaseModel {
    certs: Cert[];
}

export type SectionModel = Partial<SubCtgSectionModel & TaskSectionModel & ToolSectionModel & TechSectionModel & CertSectionModel>;

export interface Cert {
    method?: 'PUT' | 'POST' | 'DELETE';
    code: string;
    name: string;
    description: string;
    order: number;
}

export interface CertSection {
    code: 'CERTIFICATIONS';
    hideSection: boolean;
    hideNames: boolean;
    certs: Cert[];
}
