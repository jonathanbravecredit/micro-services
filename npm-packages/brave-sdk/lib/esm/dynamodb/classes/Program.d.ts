import { InitiativeTask, InitiativeStatus } from './Initiative';
export declare class Program {
    id: string;
    program: string;
    initiative: string;
    programReasons: ProgramReasons[];
    programTasks: ProgramPrimaryTask[];
    createdOn: string | null;
    modifiedOn: string | null;
    constructor(id: string, program: string, initiative: string, programReasons: ProgramReasons[], programTasks: ProgramPrimaryTask[]);
}
export declare class ProgramReasons {
    reason: string;
    description: string;
    constructor(reason: string, description: string);
}
export declare class ProgramPrimaryTask extends InitiativeTask {
    parentId: string;
    taskId: string;
    taskOrder: number;
    taskLabel: string;
    taskCard: TaskCard;
    subTasks: ProgramSubTask[];
    taskStatus: InitiativeStatus;
    constructor(parentId: string, taskId: string, taskOrder: number, taskLabel: string, taskCard: TaskCard, subTasks: ProgramSubTask[]);
}
export declare class ProgramSubTask extends ProgramPrimaryTask {
    parentId: string;
    taskId: string;
    taskOrder: number;
    taskLabel: string;
    taskCard: ExtendedTaskCard;
    subTasks: ProgramSubTask[];
    taskStatus: InitiativeStatus;
    constructor(parentId: string, taskId: string, taskOrder: number, taskLabel: string, taskCard: ExtendedTaskCard, subTasks: ProgramSubTask[]);
}
export declare class TaskCard {
    header: string;
    textOne: string;
    constructor(header: string, textOne: string);
}
export declare class ExtendedTaskCard extends TaskCard {
    header: string;
    textOne: string;
    textTwo: string | null;
    textButton: string | null;
    metric: string;
    successHeader: string;
    successText: string;
    questionHeader: string;
    link: string | null;
    constructor(header: string, textOne: string, textTwo: string | null, textButton: string | null, metric: string, successHeader: string, successText: string, questionHeader: string, link: string | null);
}
