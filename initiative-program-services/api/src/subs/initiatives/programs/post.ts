import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {};
