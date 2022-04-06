import { Program, ProgramPrimaryTask, TaskCard, ExtendedTaskCard } from '../program/program';
export declare type InitiativeStatus = 'not_started' | 'in_progress' | 'complete';
export interface IProgramContext {
    subTasks: any[];
    taskLabel: string;
    taskCard: TaskCard | ExtendedTaskCard;
}
export declare class Initiative {
    id: string;
    program: string;
    initiative: string;
    initiativeStatus: InitiativeStatus;
    initiativeReason: string;
    initiativeTitle: string;
    initiativeTasks: InitiativeTask[];
    createdOn: string;
    modifiedOn: string;
    programTasks: ProgramPrimaryTask[];
    programContext: IProgramContext[];
    constructor(id: string, program: string, initiative: string, initiativeStatus: InitiativeStatus, initiativeReason: string, initiativeTitle: string, initiativeTasks: InitiativeTask[], createdOn: string, modifiedOn: string);
    addProgramTasks(program: Program): Initiative;
    filterProgramTasks(): Initiative;
    getOnlyContext(tasks: ProgramPrimaryTask[]): IProgramContext[];
    enrichWithContext(): void;
    mapFields(task: ProgramPrimaryTask): {
        taskLabel: string;
        taskCard: TaskCard | ExtendedTaskCard;
    };
}
export declare class InitiativeMaker {
    protected id: string;
    protected programId: string;
    protected initiative: string;
    protected initiativeReason: string;
    protected program: Program;
    output: Initiative | undefined;
    enriched: Initiative | undefined;
    constructor(id: string, programId: string, initiative: string, initiativeReason: string, program: Program);
    getReason(reason: string): {
        reason: string;
        description: string;
    };
    getProgramTasks(tasks: ProgramPrimaryTask[]): InitiativeTask[];
    filterProgramTasks(task: ProgramPrimaryTask): boolean;
    mapFields(task: ProgramPrimaryTask): InitiativeTask;
}
export declare class InitiativeTask {
    parentId: string;
    taskId: string;
    taskOrder: number;
    subTasks: InitiativeTask[];
    taskStatus: InitiativeStatus;
    constructor(parentId: string, taskId: string, taskOrder: number, subTasks: InitiativeTask[]);
}
