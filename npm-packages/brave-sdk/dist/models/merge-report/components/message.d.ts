import { ICodeRef } from '../../../types';
import { IMessage } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export declare class Message extends Homogenize<Partial<IMessage>> implements IMessage {
    Code: ICodeRef;
    Type: ICodeRef;
    constructor(_data: Partial<IMessage>);
    init(): void;
}
