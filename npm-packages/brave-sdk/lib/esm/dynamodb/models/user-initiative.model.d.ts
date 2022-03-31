import 'reflect-metadata';
import { ProgramPrimaryTask, ProgramReasons } from '../../initiatives/program/program';
import { InitiativeStatus, InitiativeTask } from '../../initiatives/initiative/initiative';
export declare class UserInitiative {
    id: string;
    program: string;
    initiative: string;
    initiativeReason?: string | undefined;
    initiativeStatus?: InitiativeStatus | undefined;
    initiativeTitle?: string | undefined;
    initiativeTasks?: InitiativeTask[] | undefined;
    programReasons?: ProgramReasons[] | undefined;
    programTasks?: ProgramPrimaryTask[] | undefined;
    createdOn: string | null;
    modifiedOn: string | null;
}
