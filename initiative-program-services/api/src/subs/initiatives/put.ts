import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  // need the reason, user Id, program id
  // get the program from the db
  //   get the programInitiative from the program id and db
  // generate a new initiative
  return;
};
