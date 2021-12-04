export interface IGetAnalytic {
  id: string;
  event?: string;
}

export interface IUpdateAnalytic {
  id: string;
  event: string;
  value: number;
}

export interface IDeleteAnalytic {
  id: string;
  event: string;
}

export interface ICreateAnalytic {
  id: string;
  event: string;
  sub: string | null;
  session: string;
  source: string;
  value?: number;
  createdOn?: string;
  modifiedOn?: string;
}
