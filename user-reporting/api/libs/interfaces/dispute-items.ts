export interface DisputeItem {
  result: DisputeResult;
}

export interface DisputeResult {
  isFinished: boolean;
  data: DisputeData;
}

export interface DisputeData {
  hasCustomInput: boolean;
  customInput: string;
  reasonsId: string[];
  reasons: DisputeReason[];
}

export interface DisputeReason {
  id: string;
  claimCode: string;
  text: string;
}
