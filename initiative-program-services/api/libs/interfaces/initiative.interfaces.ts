import { InitiativeStatus } from 'libs/classes/Initiative';

export interface InitiativePatchBody {
  id: string;
  parentId: string;
  taskId: string;
  taskStatus: InitiativeStatus;
}
