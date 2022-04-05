import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Analytic } from '../../../models/analytic/analytic';
export declare class AnalyticQueries {
    static store: DynamoStore<Analytic>;
    constructor();
    static getAnalytic(analyticId: string): Promise<Analytic | null>;
    static listAnalytics(): Promise<Analytic[]>;
    static createAnalytic(Analytics: Analytic): Promise<void>;
    static deleteAnalytic(analyticId: string): Promise<Analytic>;
}
