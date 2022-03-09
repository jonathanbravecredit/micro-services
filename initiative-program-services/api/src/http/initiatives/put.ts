import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { getInitiative, updateInitiative } from 'libs/queries/user-initiative.queries';
import { IInitiativePutRequest } from 'libs/interfaces/initiative.interfaces';
import { TasksUtil } from 'libs/utils/helpers/Tasks';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event));
  const userId = event?.requestContext?.authorizer?.claims?.sub;
  if (!userId) return response(400, 'no id found');
  const { parentId, taskId, taskStatus } = JSON.parse(event.body) as IInitiativePutRequest;
  if (!parentId || !taskId || !taskStatus)
    return response(400, `no parentId: ${parentId}; or taskId:${taskId}; or taskStatus: ${taskStatus} provided`);
  try {
    const initiative = await getInitiative(userId, '1'); // the only one right now is program 0
    // update the subtask initiatives and status
    const updatedTasks = TasksUtil.mapTaskStatus(initiative.initiativeTasks, parentId, taskId, taskStatus);
    const updatedStatus = TasksUtil.getInitiativeStatus(updatedTasks);
    // save the results
    const res = await updateInitiative({
      ...initiative,
      initiativeTasks: updatedTasks,
      initiativeStatus: updatedStatus,
    });
    // layer in the context
    return response(200, res);
  } catch (err) {
    return response(500, err);
  }
};
