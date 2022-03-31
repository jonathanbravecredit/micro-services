interface InstanceInterface<T> {
    new (_data: any): T;
}
export declare class Homogenize<T> {
    constructor(_data: T);
    homogenize(_data: T): void;
    homogenizeArray<I, C>(arr: I | I[], instance: InstanceInterface<C>): C[];
}
export {};
