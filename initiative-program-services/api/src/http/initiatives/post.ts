import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { createInitiative, getPrograms } from 'libs/queries/user-initiative.queries';
import { InitiativeMaker } from 'libs/classes/Initiative';
import { Program } from 'libs/classes/Program';
import { IInitiativePostRequest } from 'libs/interfaces/initiative.interfaces';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event?.requestContext?.authorizer?.claims?.sub;
  if (!userId) return response(200, 'no id found');
  const { reason, programId } = JSON.parse(event.body) as IInitiativePostRequest;
  if (!reason || !programId) return response(200, `no reason: ${reason}; or programId:${programId} provided`);
  try {
    const program = (await getPrograms(programId)) as Program; // the only one right now is program 0
    console.log('program: ', JSON.stringify(program));
    const { initiative: programInitiative } = program;

    console.log('programInitiative: ', JSON.stringify(programInitiative));
    // create the initiaite for client
    const initiative = new InitiativeMaker(userId, programId, programInitiative, reason, program);
    console.log('initiative: ', JSON.stringify(initiative));
    console.log('initiative.output: ', JSON.stringify(initiative.output));
    // save the initiative
    const res = await createInitiative(initiative.output);
    return response(200, res);
  } catch (err) {
    console.log('error: ', JSON.stringify(err));
    return response(400, err);
  }
};
