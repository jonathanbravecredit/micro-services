import 'reflect-metadata';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { ISession } from 'libs/interfaces/api/sessions/session.interface';
import { ReferralActivationManager } from 'libs/utils/managers/referralActivationManager';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {};
