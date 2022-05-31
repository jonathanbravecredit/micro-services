import { AttributeValue } from 'aws-lambda';

export interface IBatchPayload<T> {
  service: string;
  command: string;
  message: T;
}

export interface IAttributeValue {
  [key: string]: AttributeValue;
}
export interface IDynamoOutputs<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
}
export interface IBatchMsg<T> extends IDynamoOutputs<T> {
  segment: number;
  totalSegments: number;
}

export interface IBatchCognitoMsg<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
  segment: number;
  totalSegments: number;
}
