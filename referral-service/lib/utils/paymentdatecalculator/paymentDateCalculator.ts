import * as moment from 'moment';
export class PaymentDateCalculator {
  constructor() {}

  calcPaymentDate(bonusHit: boolean, endDate: string) {
    const now = new Date().toISOString();
    const earlyDate = new Date(now.substring(0, 10));
    const campaignEnd = new Date(endDate);
    return bonusHit
      ? moment(now).add(7, 'days').add(12, 'hours').day(2).toISOString()
      : moment(campaignEnd)
          .add(1, 'month')
          .startOf('month')
          .add(6 - moment().day('Tuesday').day(), 'days')
          .startOf('week')
          .day(2)
          .add(12, 'hours')
          .toISOString();
  }
}
