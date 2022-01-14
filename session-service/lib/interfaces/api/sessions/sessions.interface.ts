export interface ISessionData {
  sessionId: string;
  expirationDate: string;
}

export interface ISessionDB {
  userId: string;
  sessionId: string;
  sessionDate: string;
  sessionExpirationDate: string;
  pageViews: number;
}
