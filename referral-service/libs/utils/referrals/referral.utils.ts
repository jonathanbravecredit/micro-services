import { IGroupedYearMonthReferral } from 'libs/interfaces';
import { Referral } from 'libs/models/referrals/referral.model';
import dayjs from 'dayjs';

export const groupReferralsByYearMonth = (referrals: Referral[]): IGroupedYearMonthReferral[] => {
  const grouped: IGroupedYearMonthReferral[] = [];
  referrals.forEach((referral) => {
    if (!referral.createdOn) return;
    const createdOn = new Date(referral.createdOn);
    const yearMonth = +dayjs(createdOn).format('YYYYMM');
    let found = false;
    grouped.forEach((group) => {
      if (group.yearMonth === yearMonth) {
        if (found) return;
        group.referrals += 1;
        found = true;
        return;
      }
    });

    if (!found && yearMonth) {
      grouped.push({
        yearMonth,
        referrals: 1,
      });
    }
  });
  return grouped;
};

export const createBlankMonthlyReferral = (): IGroupedYearMonthReferral[] => {
  return [
    {
      yearMonth: 0,
      referrals: 0,
    },
  ];
};
