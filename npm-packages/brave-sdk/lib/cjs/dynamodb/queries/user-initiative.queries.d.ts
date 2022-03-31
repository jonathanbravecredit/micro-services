import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { UserInitiative } from '../models/user-initiative.model';
export declare class UserInitiativeQueries {
    static store: DynamoStore<UserInitiative>;
    constructor();
    static getInitiative(id: string, program: string): Promise<UserInitiative>;
    static createInitiative(initiative: UserInitiative): Promise<void>;
    static updateInitiative(initiative: UserInitiative): Promise<void>;
    static getFutureScoreInitiative(): Promise<UserInitiative>;
    static getPrograms(programId: string): Promise<UserInitiative>;
}
