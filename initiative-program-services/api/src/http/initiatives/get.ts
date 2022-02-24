import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { getInitiative, getPrograms } from 'libs/queries/user-initiative.queries';
import { Initiative } from 'libs/classes/Initiative';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { Program } from 'libs/classes/Program';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  const { programId } = JSON.parse(event.body) as { programId: string };
  const env = process.env.OUR_ENV;
  if (!sub && env !== 'dev') return response(200, 'no id provided');
  try {
    const item = await getInitiative(sub, programId);
    const program = (await getPrograms(programId)) as Program;
    if (!item || !program) return response(200, `No initiative: ${item}; or program: ${program} found`);
    // need to layer in the initiative from client with the context from program
    const enriched = createNewInitiative(item).addProgramTasks(program).filterProgramTasks().enrichWithContext();
    // layer in the context
    return response(200, enriched);
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
