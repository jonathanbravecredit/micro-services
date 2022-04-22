import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

export class PaymentDateCalculator {
  constructor() {}

  /**
   * Logic:
   * 1. if they hit the max referrals amount then next payOn day (ex: tuesday (gladly))
   * 2. if NOT in the max then first payOn of next month
   *   - move to start of month (avoids 30/31 and 28 misses)
   *   - add one month to date
   *   - add 6 - payOn to date
   *      - 6 - payOn will move it to sunday (0) or later if curr day is after payOn dat and push the week over
   *      - or, wll keep in the same week if on Sun, Mon, or Tues, etc if before payOn which is correct
   *   - set the date to payOn (ex: Tuesday = 2)
   * @param maxHit
   * @param endDate
   * @returns
   */
  calcPaymentDate(maxHit: boolean, endDate: string, payOn: number = 2): string {
    const now = dayjs(new Date()).tz();
    const campaignEnd = dayjs(endDate).tz();
    return maxHit
      ? now.hour(0).minute(0).second(0).millisecond(0).add(7, 'days').day(2).toISOString()
      : campaignEnd
          .startOf('month')
          .add(1, 'month')
          .add(6 - payOn, 'days')
          .day(payOn)
          .toISOString();
  }
}
