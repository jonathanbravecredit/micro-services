export class InitiativeProgram {
  constructor(
    protected id: string,
    protected reasons: InitiativeProgramReasons[],
    protected primaryTasks: InitiativePrimaryTask[],
  ) {}
}

export class InitiativeProgramReasons {
  constructor(protected reason: string, protected description: string) {}
}

export class InitiativePrimaryTask {
  constructor(
    protected parentId: string,
    protected taskId: string,
    protected taskStatus: string,
    protected taskOrder: number,
    protected taskCard: InitiativeTaskCard,
    protected taskLabel: string,
    protected subTasks: SubTask[],
  ) {}
}

export class SubTask extends InitiativePrimaryTask {
  constructor(
    protected parentId: string,
    protected taskId: string,
    protected taskStatus: string,
    protected taskOrder: number,
    protected taskCard: InitiativeExtendedTaskCard,
    protected taskLabel: string,
    protected subTasks: SubTask[],
  ) {
    super(parentId, taskId, taskStatus, taskOrder, taskCard, taskLabel, subTasks);
  }
}

export class InitiativeTaskCard {
  constructor(protected header: string, protected textOne: string) {}
}

export class InitiativeExtendedTaskCard extends InitiativeTaskCard {
  constructor(
    protected header: string,
    protected textOne: string,
    protected textTwo: string | null,
    protected textButton: string | null,
    protected metric: string,
    protected successHeader: string,
    protected successText: string,
    protected questionHeader: string,
    protected link: string,
  ) {
    super(header, textOne);
  }
}
