import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { InitiativeStatus, InitiativeTask } from 'libs/classes/Initiative';
import { InitiativePatchBody } from 'libs/interfaces/initiative.interfaces';
import { getInitiative, updateInitiative } from 'libs/queries/user-initiative.queries';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  console.log('event: ', JSON.stringify(event));
  const requests = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<InitiativePatchBody>;
  });
  if (requests.length) {
    try {
      await Promise.all(
        requests.map(async (req) => {
          const message = req.message;
          const { id, parentId, taskId, taskStatus } = message;
          // get the initiative
          const initiative = await getInitiative(id, '0'); // the only one right now is program 0
          // update the subtask status
          let updated = {
            ...initiative,
            initiativeTasks: mapTaskStatus(initiative.initiativeTasks, parentId, taskId, taskStatus),
          };
          // check if all subtasks are complete
          const completed = areAllSubtasksComplete(updated.initiativeTasks);
          // if completed, update the overal status
          updated = completed ? { ...updated, initiativeStatus: 'complete' } : updated;
          // save the results
          await updateInitiative(updated);
        }),
      );
    } catch (err) {
      console.log('Error: ', err);
    }
  }
  return;
};

const areAllSubtasksComplete = (tasks: InitiativeTask[]): boolean => {
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
};

const mapTaskStatus = (
  tasks: InitiativeTask[],
  parentId: string,
  taskId: string,
  taskStatus: InitiativeStatus,
): InitiativeTask[] => {
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
};
