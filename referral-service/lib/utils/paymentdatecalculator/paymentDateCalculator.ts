import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

export class PaymentDateCalculator {
  constructor() {}

  /**
   * Logic:
   * 1. if in the bonus then next payOn day (ex: tuesday (gladly))
   * 2. if NOT in the bonus then first payOn of next month
   *   - move to start of month (avoids 30/31 and 28 misses)
   *   - add one month to date
   *   - add 6 - payOn to date
   *      - 6 - payOn will move it to sunday (0) or later if curr day is after payOn dat and push the week over
   *      - or, wll keep in the same week if on Sun, Mon, or Tues, etc if before payOn which is correct
   *   - set the date to payOn (ex: Tuesday = 2)
   * @param bonusHit
   * @param endDate
   * @returns
   */
  calcPaymentDate(bonusHit: boolean, endDate: string, payOn: number = 2) {
    const now = dayjs(new Date()).tz();
    const campaignEnd = dayjs(endDate).tz();
    return bonusHit
      ? now.add(7, 'days').day(payOn).toISOString()
      : campaignEnd
          .startOf('month')
          .add(1, 'month')
          .add(6 - payOn, 'days')
          .day(payOn)
          .toISOString();
  }
}
