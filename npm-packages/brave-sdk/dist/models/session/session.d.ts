import 'reflect-metadata';
export declare const USERID_SESSIONDATE_INDEX = "userIdSessionDate-index";
export declare class Session {
    userId: string;
    sessionId: string;
    sessionDate: string;
    sessionExpirationDate: string;
    pageViews: number;
    clickEvents: number;
}
export declare class SessionMaker implements Session {
    userId: string;
    sessionId: string;
    sessionDate: string;
    sessionExpirationDate: string;
    pageViews: number;
    clickEvents: number;
    constructor(userId: string, sessionId: string, sessionDate: string, sessionExpirationDate: string);
}
