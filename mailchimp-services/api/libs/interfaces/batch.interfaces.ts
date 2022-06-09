import { AttributeValue } from 'aws-lambda';

export interface IAttributeValue {
  [key: string]: AttributeValue;
}
export interface IDynamoOutputs<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
}

export interface IBatchCognitoMsg<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
  segment: number;
  totalSegments: number;
}
