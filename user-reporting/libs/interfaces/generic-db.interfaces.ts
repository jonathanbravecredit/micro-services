export interface ParallelScanParams {
  table: string;
  index?: string;
  condition?: string;
  filter?: string;
  attributes?: { [key: string]: any };
  values?: { [key: string]: any };
}
