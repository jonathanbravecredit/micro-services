export enum TransunionErrorAction {
  Error = 'error',
  Unavailable = 'unavailable',
  Retry = 'retry',
}

export interface ITransunionErrorCode {
  code: string;
  name: string;
  message: string;
  category: string;
  method: string;
  action: TransunionErrorAction;
}
