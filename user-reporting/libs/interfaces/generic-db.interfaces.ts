export interface ParallelScanParams {
  table: string;
  index?: string;
  key?: { [key: string]: any };
  keyExpression?: string;
  filter?: string;
  attributes?: { [key: string]: any };
  values?: { [key: string]: any };
}

export interface QueryParams {
  TableName: string;
  ScanIndexForward: string;
  IndexName?: { [key: string]: any };
  KeyConditionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeValues?: { [key: string]: any };
  ExpressionAttributeNames?: { [key: string]: any };
}
