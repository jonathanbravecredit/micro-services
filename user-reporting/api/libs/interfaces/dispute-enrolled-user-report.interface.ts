export interface IDisputeEnrolledUserReport {
  id: string;
  createdAt: string;
  createdAtUTC: string | null;
  createdAtPST: string | null;
  status: string;
  statusReason: string | null;
  statusReasonDescription: string | null;
  enrolled: boolean;
  enrolledOn: string | null;
  enrolledOnUTC: string | null;
  enrolledOnPST: string | null;
}
