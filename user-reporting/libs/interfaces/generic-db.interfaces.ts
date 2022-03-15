export interface ParallelScanParams {
  table: string;
  index?: string;
  key?: { [key: string]: any };
  filter?: string;
  attributes?: { [key: string]: any };
  values?: { [key: string]: any };
}
