import { IErrorResponse, INil } from './common-tu';
export interface IVerifyAuthenticationResponseSuccess {
    Envelope: {
        Body: {
            VerifyAuthenticationQuestionsResponse: {
                VerifyAuthenticationQuestionsResult: IVerifyAuthenticationQuestionsResult;
            };
        };
    };
}
export interface IVerifyAuthenticationQuestionsResult {
    AccountName: string;
    ErrorResponse: IErrorResponse | INil;
    RequestKey: string;
    ResponseType: string;
    ClientKey: string;
    AuthenticationDetails: string;
    AuthenticationStatus: string;
}
