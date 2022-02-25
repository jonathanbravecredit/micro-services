import { merge } from 'lodash';
import { Program, ProgramPrimaryTask, ProgramReasons, TaskCard, ExtendedTaskCard } from 'libs/classes/Program';

export type InitiativeStatus = 'not_started' | 'in_progress' | 'complete';

export interface IProgramContext {
  subTasks: any[];
  taskLabel: string;
  taskCard: TaskCard | ExtendedTaskCard;
}

export class Initiative {
  public programTasks: ProgramPrimaryTask[];
  public programContext: IProgramContext[];
  constructor(
    public id: string,
    public program: string,
    public initiative: string,
    public initiativeStatus: InitiativeStatus,
    public initiativeReason: string,
    public initiativeTitle: string,
    public initiativeTasks: InitiativeTask[],
    public createdOn: string,
    public modifiedOn: string,
  ) {}

  addProgramTasks(program: Program): Initiative {
    this.programTasks = program.programTasks;
    return this;
  }

  filterProgramTasks(): Initiative {
    this.programTasks = this.programTasks.filter((t) => t.taskId === this.initiativeReason);
    return this;
  }

  getOnlyContext(tasks: ProgramPrimaryTask[]): IProgramContext[] {
    if (!tasks || !tasks.length) return;
    return tasks.map((task) => {
      return {
        ...this.mapFields(task),
        subTasks: this.getOnlyContext(task.subTasks),
      };
    });
  }

  enrichWithContext() {
    const tasks = this.programTasks;
    console.log('enrich tasks: ', JSON.stringify(tasks));
    this.programContext = this.getOnlyContext(tasks);
    console.log('enrich initiativeTasks: ', JSON.stringify(this.initiativeTasks));
    console.log('enrich this.programContext: ', JSON.stringify(this.programContext));
    for (let i = 0; i < this.initiativeTasks.length; i++) {
      this.initiativeTasks[i] = {
        ...this.programContext[i],
        ...this.initiativeTasks[i],
      };
      for (let j = 0; j < this.initiativeTasks[i].subTasks.length; j++) {
        this.initiativeTasks[i].subTasks[j] = {
          ...this.programContext[i].subTasks[j],
          ...this.initiativeTasks[i].subTasks[j],
        };
      }
    }
    console.log('enrich this.initiativeTasks: ', JSON.stringify(this.initiativeTasks));
  }

  mapFields(task: ProgramPrimaryTask): { taskLabel: string; taskCard: TaskCard | ExtendedTaskCard } {
    const { taskLabel, taskCard } = task;
    return {
      taskLabel,
      taskCard,
    };
  }
}

export class InitiativeMaker {
  public output: Initiative | undefined;
  public enriched: Initiative | undefined;
  constructor(
    protected id: string,
    protected programId: string,
    protected initiative: string,
    protected initiativeReason: string,
    protected program: Program,
  ) {
    const tasks = this.program.programTasks.filter((task) => {
      return task.parentId === this.initiative;
    });
    const now = new Date().toISOString();
    this.output = new Initiative(
      id,
      programId,
      initiative,
      'not_started',
      this.getReason(initiativeReason).reason,
      this.getReason(initiativeReason).description,
      this.getProgramTasks(tasks),
      now,
      now,
    );
  }

  // ensure there is a valid matching reason...what to do if there isn't?
  getReason(reason: string): { reason: string; description: string } {
    const match = this.program.programReasons.find((r: ProgramReasons) => {
      return (r.reason = reason);
    });
    if (!match) throw 'No matching reason found';
    return match;
  }

  getProgramTasks(tasks: ProgramPrimaryTask[]): InitiativeTask[] {
    if (!tasks || !tasks.length) return;
    return tasks.map((task) => {
      return {
        ...this.mapFields(task),
        subTasks: this.getProgramTasks(task.subTasks),
      };
    });
  }

  filterProgramTasks(task: ProgramPrimaryTask): boolean {
    return task.parentId === this.initiative;
  }

  mapFields(task: ProgramPrimaryTask): InitiativeTask {
    const { parentId, taskId, taskOrder, taskStatus, subTasks } = task;
    return {
      parentId,
      taskId,
      taskOrder,
      taskStatus,
      subTasks,
    };
  }
}

export class InitiativeTask {
  public taskStatus: InitiativeStatus = 'not_started';
  constructor(
    public parentId: string,
    public taskId: string,
    public taskOrder: number,
    public subTasks: InitiativeTask[],
  ) {}
}
