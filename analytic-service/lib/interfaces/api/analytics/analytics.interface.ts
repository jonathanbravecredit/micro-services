export interface IGetAnalytic {
  id: string;
  event?: string;
}

export interface IUpdateAnalytic {
  id: string;
  event: string;
  value: number;
}

export interface IDeleteReferral {
  id: string;
  event: string;
}

export interface ICreateReferral {
  id: string;
  event: string;
  sub?: string | null | undefined;
  session?: string | null | undefined;
  source?: string | null | undefined;
  value?: number | null | undefined;
  createdOn?: string | undefined;
  modifiedOn?: string | undefined;
}
