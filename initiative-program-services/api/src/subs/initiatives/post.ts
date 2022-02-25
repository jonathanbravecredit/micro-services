import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { IBatchPayload, IInitiativeProgramPayload } from 'libs/interfaces/batch.interfaces';
import { createInitiative, getPrograms } from 'libs/queries/user-initiative.queries';
import { InitiativeMaker } from 'libs/classes/Initiative';
import { Program } from 'libs/classes/Program';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  console.log('event: ', JSON.stringify(event));
  const requests = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IInitiativeProgramPayload>;
  }).filter((r) => r.command === 'POST');
  if (requests.length) {
    try {
      await Promise.all(
        requests.map(async (req) => {
          const message = req.message;
          const { userId, programId, reason } = message;
          console.log('message: ', JSON.stringify(message));
          // get the program
          const program = (await getPrograms(programId)) as Program; // the only one right now is program 0
          console.log('program: ', JSON.stringify(program));
          const { initiative: programInitiative } = program;

          console.log('programInitiative: ', JSON.stringify(programInitiative));
          // create the initiaite for client
          const initiative = new InitiativeMaker(userId, programId, programInitiative, reason, program);
          console.log('initiative: ', JSON.stringify(initiative));
          console.log('initiative.output: ', JSON.stringify(initiative.output));
          // save the initiative
          await createInitiative(initiative.output);
        }),
      );
    } catch (err) {
      console.log('Error: ', err);
    }
  }
  return;
};
