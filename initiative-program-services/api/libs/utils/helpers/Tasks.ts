import { InitiativeTask, InitiativeStatus } from 'libs/classes/Initiative';

export class TasksUtil {
  static findTaskByTaskId(tasks: InitiativeTask[], subtaskId: string): InitiativeTask | undefined {
    let task: InitiativeTask;
    tasks.forEach((pt) => {
      pt.subTasks.forEach((st) => {
        if (st.taskId === subtaskId) {
          task = st;
        }
      });
    });
    return task;
  }

  static getInitiativeStatus(tasks: InitiativeTask[]): InitiativeStatus {
    let tracker = {
      tasks: 0,
      complete: 0,
      not_started: 0,
      in_progress: 0,
    };
    tasks.forEach((pt) => {
      pt.subTasks.forEach((st) => {
        tracker[st.taskStatus] += 1;
        tracker.tasks += 1;
      });
    });
    const t1 = tracker.tasks === tracker.complete;
    const t2 = tracker.tasks === tracker.not_started;
    if (t1) return 'complete';
    if (t2) return 'not_started';
    return 'in_progress';
  }

  static areAllSubtasksComplete(tasks: InitiativeTask[]): boolean {
    let completed = true;
    tasks.forEach((pt) => {
      pt.subTasks.forEach((st) => {
        if (st.taskStatus !== 'complete') {
          if (!completed) return; // do nothing
          completed = false;
        }
      });
    });
    return completed;
  }

  static mapTaskStatus(
    tasks: InitiativeTask[],
    parentId: string,
    taskId: string,
    taskStatus: InitiativeStatus,
  ): InitiativeTask[] {
    return tasks.map((t) => {
      return {
        ...t,
        subTasks: t.subTasks.map((st) => {
          if (!(st.parentId === parentId && st.taskId === taskId)) return st;
          return {
            ...st,
            taskStatus,
          };
        }),
      };
    });
  }
}
