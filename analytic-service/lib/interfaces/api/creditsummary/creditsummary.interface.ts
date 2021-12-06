export interface ICreditSummary {
  userId: string;
  bureauId: string;
  priorScore: number | null;
  currentScore: number | null;
  delta: number | null;
  createdOn: string | null;
  modifiedOn: string | null;
}
