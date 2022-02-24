export enum AccountTypes {
  LineOfCredit = 'Line of credit',
  Installment = 'Installment account',
  Mortgage = 'Primary or secondary mortgage',
  Open = 'Open account',
  Revolving = 'Revolving account',
  Unknown = 'Unknown',
  Collection = 'Collection account',
}

export const ACCOUNT_TYPES: Record<string, any> = {
  c: AccountTypes.LineOfCredit,
  r: AccountTypes.Revolving,
  o: AccountTypes.Open,
  u: AccountTypes.Unknown,
  y: AccountTypes.Collection,
  i: AccountTypes.Installment,
  m: AccountTypes.Mortgage,
};
