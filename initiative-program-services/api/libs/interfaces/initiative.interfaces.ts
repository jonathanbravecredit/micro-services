import { InitiativeStatus } from 'libs/classes/Initiative';

export interface InitiativePatchBody {
  userId: string;
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}
