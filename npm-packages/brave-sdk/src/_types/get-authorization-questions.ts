import { IErrorResponse, INil } from './common-tu';
import { NameInput, DobInput, AddressInput, PhoneInput, SsnInput } from './graphql-api';

export interface IGetAuthenticationQuestionsMsg {
  name: NameInput;
  dob: DobInput;
  address: AddressInput;
  phone: PhoneInput;
  ssn: SsnInput;
}

export interface IGetAuthenticationQuestionsResponseSuccess {
  Envelope: {
    Body: {
      GetAuthenticationQuestionsResponse: {
        GetAuthenticationQuestionsResult: IGetAuthenticationQuestionsResult;
      };
    };
  };
}

export interface IGetAuthenticationQuestionsResult {
  AccountName: string;
  ErrorResponse: IErrorResponse | INil;
  RequestKey: string;
  ResponseType: string;
  ClientKey: string;
  Questions: string;
  ServiceBundleFulfillmentKey: string;
}
