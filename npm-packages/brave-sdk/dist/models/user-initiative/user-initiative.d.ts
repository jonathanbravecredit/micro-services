import 'reflect-metadata';
import { InitiativeStatus, InitiativeTask } from './initiative/initiative';
import { ProgramReasons, ProgramPrimaryTask } from './program/program';
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
