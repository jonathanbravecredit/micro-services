import { ICodeRef } from '../../../../_types/common-tu';
import { IMessage } from '../../../../_types/merge-report';
import { Homogenize } from '../../homogenize/homogenize-data';
export declare class Message extends Homogenize<Partial<IMessage>> implements IMessage {
    Code: ICodeRef;
    Type: ICodeRef;
    constructor(_data: Partial<IMessage>);
    init(): void;
}
