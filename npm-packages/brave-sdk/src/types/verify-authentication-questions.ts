import { IVerifyAuthenticationAnswer } from './verify-authentication-answers';

export interface IVerifyAuthenticationQuestionsMsg {
  answers: IVerifyAuthenticationAnswer[];
  key: string;
}
export interface IVerifyAuthenticationQuestions {
  request: {
    AccountCode: string;
    AccountName: string;
    AdditionalInputs?: {
      Data: {
        Name: string;
        Value: string;
      };
    };
    RequestKey: string;
    ClientKey: string;
    Answers: IVerifyAuthenticationAnswer[];
    ServiceBundleFulfillmentKey: string;
    TrustSessionId?: string;
  };
}
