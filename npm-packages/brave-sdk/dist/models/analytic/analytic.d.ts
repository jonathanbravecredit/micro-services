import 'reflect-metadata';
export declare class Analytic {
    id: string;
    event: string;
    sub: string | null;
    session: string;
    source: string;
    value?: number;
    createdOn?: string;
    modifiedOn?: string;
}
export declare class AnalyticMaker implements Analytic {
    id: string;
    event: string;
    sub: string | null;
    session: string;
    source: string;
    value: number;
    createdOn: string | undefined;
    modifiedOn: string | undefined;
    constructor(id: string, event: string, sub: string | null, session: string, source: string, value?: number);
}
