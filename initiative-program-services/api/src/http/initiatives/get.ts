import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { getInitiative, getPrograms } from 'libs/queries/user-initiative.queries';
import { Initiative } from 'libs/classes/Initiative';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { Program } from 'libs/classes/Program';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  const programId = '1';
  console.log('sub: ', sub);
  console.log('programId: ', programId);
  if (!sub) return response(400, `no id`);
  try {
    const item = await getInitiative(sub, programId);
    console.log('item: ', JSON.stringify(item));
    const program = (await getPrograms(programId)) as Program;
    console.log('program: ', JSON.stringify(program));
    if (!item || !program) return response(400, `no initiative:${item} or program:${program}`);
    // need to layer in the initiative from client with the context from program
    const initiative = createNewInitiative(item);
    initiative.addProgramTasks(program).filterProgramTasks().enrichWithContext();
    console.log('initiative: ', JSON.stringify(initiative));
    // layer in the context
    return response(200, initiative);
  } catch (err) {
    return response(500, err);
  }
};

const createNewInitiative = (item: UserInitiative): Initiative => {
  const {
    id,
    program,
    initiative,
    initiativeStatus,
    initiativeReason,
    initiativeTitle,
    initiativeTasks,
    createdOn,
    modifiedOn,
  } = item;

  return new Initiative(
    id,
    program,
    initiative,
    initiativeStatus,
    initiativeReason,
    initiativeTitle,
    initiativeTasks,
    createdOn,
    modifiedOn,
  );
};
