import { InitiativeStatus } from 'libs/classes/Initiative';

export interface InitiativePatchBody {
  userId: string;
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}

export interface IInitiativePostRequest {
  reason: string;
  programId: string;
}

export interface IInitiativePutRequest {
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}
