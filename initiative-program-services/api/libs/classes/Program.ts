import { InitiativeTask, InitiativeStatus } from 'libs/classes/Initiative';

export class Program {
  public createdOn: string | null = null;
  public modifiedOn: string | null = null;

  constructor(
    public id: string,
    public program: string,
    public initiative: string,
    public programReasons: ProgramReasons[],
    public programTasks: ProgramPrimaryTask[],
  ) {}
}

export class ProgramReasons {
  constructor(public reason: string, public description: string) {}
}

export class ProgramPrimaryTask extends InitiativeTask {
  public taskStatus: InitiativeStatus = 'not_started';
  constructor(
    public parentId: string,
    public taskId: string,
    public taskOrder: number,
    public taskLabel: string,
    public taskCard: TaskCard,
    public subTasks: ProgramSubTask[],
  ) {
    super(parentId, taskId, taskOrder, subTasks);
  }
}

export class ProgramSubTask extends ProgramPrimaryTask {
  public taskStatus: InitiativeStatus = 'not_started';
  constructor(
    public parentId: string,
    public taskId: string,
    public taskOrder: number,
    public taskLabel: string,
    public taskCard: ExtendedTaskCard,
    public subTasks: ProgramSubTask[],
  ) {
    super(parentId, taskId, taskOrder, taskLabel, taskCard, subTasks);
  }
}

export class TaskCard {
  constructor(public header: string, public textOne: string) {}
}

export class ExtendedTaskCard extends TaskCard {
  constructor(
    public header: string,
    public textOne: string,
    public textTwo: string | null,
    public textButton: string | null,
    public metric: string,
    public successHeader: string,
    public successText: string,
    public questionHeader: string,
    public link: string | null,
  ) {
    super(header, textOne);
  }
}
