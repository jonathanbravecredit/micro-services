import { ISource, ISourceSummary } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class SourceSummary extends Homogenize<Partial<ISourceSummary>> implements ISourceSummary {
    Source: ISource;
    constructor(_data: Partial<ISourceSummary>);
    init(): void;
}
