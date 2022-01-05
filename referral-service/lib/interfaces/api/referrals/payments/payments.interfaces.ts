export interface IPayments {
  paymentsPending: number;
  paymentsProcessed: number;
  paymentScheduledDate: string | moment.Moment;
  currency: string;
  earningsAmount: number;
}
