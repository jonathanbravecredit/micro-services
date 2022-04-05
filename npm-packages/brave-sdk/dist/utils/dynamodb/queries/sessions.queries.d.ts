import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Session } from '../../../models/session/session';
export declare class SessionQueries {
    static store: DynamoStore<Session>;
    constructor();
    static createSession(Sessions: Session): Promise<void>;
    static listUserSessions(userId: string, limit?: number): Promise<Session[]>;
    static getSession(sub: string, sessionId: string): Promise<Session | null>;
    static getLatestSession(userId: any, sort?: string, limit?: number): Promise<Session[]>;
    static incrementSessionPageViews(session: Partial<Session>, increment?: number): Promise<void>;
    static incrementSessionClickEvents(session: Partial<Session>, increment?: number): Promise<void>;
}
