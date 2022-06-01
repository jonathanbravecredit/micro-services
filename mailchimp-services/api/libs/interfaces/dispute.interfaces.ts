export interface IDispute {
  id: string;
  disputeId: string;
  disputeStatus: string;
  disputeLetterCode: string;
  disputeLetterContent: string;
  openDisputes: IDisputeSummary;
  closedDisputes: IDisputeSummary;
  pvDisputedItems: IPVDisputedItems | null;
  agencyName: string;
  openedOn: string;
  closedOn: string;
  disputeItems: string;
  disputeInvestigationResults: string;
  disputeCreditBureau: string;
  notificationStatus: string;
  notificationMessage: string;
  notificationSentOn: string;
  createdOn: string | null;
  modifiedOn: string | null;
}

export interface IDisputeSummary {
  estimatedCompletionDate: string;
  lastUpdatedDate: string;
  openDate: string;
  requestedDate: string;
  totalClosedDisputedItems: string;
  totalDisputedItems: string;
  totalOpenDisputedItems: string;
  totalPVDisputedItemCount: string;
}

export interface IPVDisputedItems {
  pvTradelines: string;
  pvPublicRecords: string;
}
