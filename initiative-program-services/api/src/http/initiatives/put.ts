import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { getInitiative, updateInitiative } from 'libs/queries/user-initiative.queries';
import { InitiativeStatus, InitiativeTask } from 'libs/classes/Initiative';
import { IInitiativePutRequest } from 'libs/interfaces/initiative.interfaces';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event));
  const userId = event?.requestContext?.authorizer?.claims?.sub;
  if (!userId) return response(200, 'no id found');
  const { parentId, taskId, taskStatus } = JSON.parse(event.body) as IInitiativePutRequest;
  if (!parentId || !taskId || !taskStatus)
    return response(200, `no parentId: ${parentId}; or taskId:${taskId}; or taskStatus: ${taskStatus} provided`);
  try {
    const initiative = await getInitiative(userId, '1'); // the only one right now is program 0
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
    const res = await updateInitiative(updated);
    // layer in the context
    return response(200, res);
  } catch (err) {
    return response(400, err);
  }
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
