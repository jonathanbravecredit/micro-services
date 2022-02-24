import { AttributeValue } from 'aws-lambda';

export interface IEnrolledUserReport {
  id: string;
  createdAt: string;
  createdAtUTC: string | null;
  createdAtPST: string | null;
  sortKey: string;
  status: string;
  statusReason: string | null;
  statusReasonDescription: string | null;
  enrolled: boolean;
  enrolledOn: string | null;
  enrolledOnUTC: string | null;
  enrolledOnPST: string | null;
  fulfilled: boolean;
  fulfilledOn: string | null;
  fulfilledOnUTC: string | null;
  fulfilledOnPST: string | null;
  pinRequests: number | null;
  pinAttempts: number | null;
  pinCurrentAge: string | null;
  kbaAttempts: number | null;
  kbaCurrentAge: string | null;
  authAttempt: number | null;
}

export interface IEnrollUserBatchMsg {
  exclusiveStartKey?: { [key: string]: AttributeValue } | undefined;
  lastEvaluatedKey?: { [key: string]: AttributeValue } | undefined;
  items?: any;
  segment: number;
  totalSegments: number;
}
