import { InitiativePrimaryTask } from 'libs/classes/Program';

export class Initiative {
  constructor(
    protected id: string,
    protected initiative: string,
    protected initiativeStatus: InitiativeStatus,
    protected initiativeTitle: string,
    protected primaryTask: InitiativePrimaryTask,
  ) {}
}

type InitiativeStatus = 'not_stated' | 'in_progress' | 'complete';
