export interface IGetCreditScore {
  id: string;
  scoreId: number;
}

export interface IUpdateCreditScore {
  id: string;
  scoreId: number;
  score: number;
}

export interface IDeleteCreditScore {
  id: string;
  scoreId: number;
}

export interface ICreateCreditScore {
  id: string;
  score: number;
  createdOn?: string;
  modifiedOn?: string;
}
