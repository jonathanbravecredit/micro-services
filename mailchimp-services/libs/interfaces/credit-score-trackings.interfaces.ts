export interface ICreditScoreTrackings {
  userId: string;
  bureauId: string;
  priorScore?: number;
  currentScore?: number;
  delta?: number;
  createdOn: string;
  modifiedOn: string;
}
