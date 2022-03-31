import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APIErrorLog } from '../models/api-error-log.model';
export declare class APIErrorLogQueries {
    static store: DynamoStore<APIErrorLog>;
    constructor();
    static getErrorLog(userId: string, errorId: string): Promise<APIErrorLog | null>;
    static listErrorLog(userId: string): Promise<APIErrorLog[]>;
    static createErrorLog(error: APIErrorLog): Promise<void>;
}
