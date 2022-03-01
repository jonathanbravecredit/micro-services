import { TransunionInput } from 'libs/interfaces/transunion.interfaces';
// !!!These are only a partial of AppData Schema!!!
export interface IAppDataInput {
  id: string;
  user?: IUser | null;
  agencies?: IAgencies | null;
  status?: string;
}

export interface IUser {
  id: string;
  userAttributes?: IUserAttributes | null;
}

export interface IAgencies {
  transunion?: TransunionInput | null;
}

export interface IUserAttributes {
  name?: IName | null;
  address?: IAddress | null;
  phone?: IPhone | null;
  dob?: IDob | null;
  ssn?: ISsn | null;
}

export interface IName {
  first: string;
  middle?: string | null;
  last: string;
}

export interface IAddress {
  addressOne: string;
  addressTwo?: string | null;
  city: string;
  state: string;
  zip: string;
}

export interface IPhone {
  primary: string;
}

export interface IDob {
  year: string;
  month: string;
  day: string;
}

export interface ISsn {
  lastfour: string;
  full?: string | null;
}
