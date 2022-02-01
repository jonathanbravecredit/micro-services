export interface IScores {
  id: string | number;
  event: string;
  sub: string;
  session: string;
  source: string;
  value: number;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}
