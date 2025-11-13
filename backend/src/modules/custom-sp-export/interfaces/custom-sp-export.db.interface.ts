export interface BehavioralCompetencyRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Behavioral Competency Name': string;
    'Behavioral Competency Description': string;
    'Behavioral Competency Level': number;
    'Behavioral Competency Level Description': string;
    'Behavioral Competency ID'?: number;
}

export interface DriverRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Driver Name': string;
    'Driver Description': string;
    'Driver Score': number;
    'Driver Level Description': string;
    'Driver ID'?: number;
}

export interface EducationRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Education': string;
    'Education Description': string;
    'Education Level': number;
    'Education Level Description': string;
    'Education ID'?: number;
}

export interface GeneralExperienceRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'General Experience': string;
    'General Experience Description': string;
    'General Experience Level': number;
    'General Experience Level Description': string;
    'General Experience ID'?: number;
}

export interface ManagerialExperienceRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Managerial Experience': string;
    'Managerial Experience Description': string;
    'Managerial Experience Level': number;
    'Managerial Experience Level Description': string;
    'Managerial Experience ID'?: number;
}

export interface ResponsibilityRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Responsibility Name': string;
    'Responsibility Description': string;
    'Responsibility Level': number;
    'Responsibility Level Description': string;
    'Responsibility ID'?: number;
}

export interface SkillRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Skill Name': string;
    'Skill Description': string;
    'Skill Level': number;
    'Skill Level Description': string;
    'Skill Components': string | null;
    'Skill ID'?: number;
}

export interface SpRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Job Description': string;
    'Job Function Name': string;
    'Job Sub Function Name': string;
    'Reference Level': string;
    'Custom Grade': string;
    'Level Name': string;
    'Sub Level Name': string;
    'Created On': Date;
    'Created By': string;
    'Modified On': Date;
    'Modified By': string;
}

export interface TaskRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Task Name': string;
    'Task Type': string;
    'Task Order': number;
    'Task ID'?: number;
}

export interface ToolRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Tool Name': string;
    'Tool Order': number;
    'Example': string;
    'Example Order': number;
    'Tool ID'?: number;
    'Example ID'?: number;
}

export interface TraitRaw {
    'Job Code': string;
    'JobID': number;
    'Job Name': string;
    'Trait Name': string;
    'Trait Description': string;
    'Trait Score': number;
    'Trait Level Description': string;
    'Trait ID'?: number;
}
