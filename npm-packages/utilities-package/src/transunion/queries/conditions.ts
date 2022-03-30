import { DataBreaches } from '../constants';
import { TransunionFilters } from '../filters';
import { IBorrowerAddress, ITradeLinePartition, IInquiryPartition } from '../interfaces/merge-report.interface';

const dataBreachCondition1 = ({
  address,
  tradelines,
}: {
  address: IBorrowerAddress;
  tradelines: ITradeLinePartition[];
}): DataBreaches => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() !== 'ca') return DataBreaches.None;
  const carLoan = TransunionFilters.filterTradelinesByIndustryCode(tradelines, 'BA');
  if (carLoan.length > 0) return DataBreaches.Condition1;
  return DataBreaches.None;
};

const dataBreachCondition2 = ({ address }: { address: IBorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'ca') return DataBreaches.Condition2;
  return DataBreaches.None;
};

const dataBreachCondition3 = ({ address }: { address: IBorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'co') return DataBreaches.Condition3;
  return DataBreaches.None;
};

const dataBreachCondition4 = ({ address }: { address: IBorrowerAddress }) => {
  const code = address?.CreditAddress?.stateCode?.toUpperCase();
  if (!code) return DataBreaches.None;
  return krogerStates[code] ? DataBreaches.Condition4 : DataBreaches.None;
};

const dataBreachCondition5 = ({ inquiries }: { inquiries: IInquiryPartition[] }) => {
  const results = inquiries.filter((i) => {
    const name = i?.Inquiry?.subscriberName || '';
    if (name.toLowerCase().indexOf('t-mobile') >= 0) return true;
    if (name.toLowerCase().indexOf('tmobile') >= 0) return true;
    if (name.toLowerCase().indexOf('t mobile') >= 0) return true;
    return false;
  });
  if (results.length > 0) return DataBreaches.Condition5;
  return DataBreaches.None;
};

const dataBreachCondition6 = ({ address }: { address: IBorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'wa') return DataBreaches.Condition6;
  return DataBreaches.None;
};

const dataBreachCondition7 = ({ address }: { address: IBorrowerAddress }) => {
  const code = address?.CreditAddress?.stateCode?.toUpperCase();
  if (!code) return DataBreaches.None;
  return experianStates[code] ? DataBreaches.Condition7 : DataBreaches.None;
};

export const DataBreachConditions: Record<string, any> = {
  [DataBreaches.Condition1]: dataBreachCondition1,
  [DataBreaches.Condition2]: dataBreachCondition2,
  [DataBreaches.Condition3]: dataBreachCondition3,
  [DataBreaches.Condition4]: dataBreachCondition4,
  [DataBreaches.Condition5]: dataBreachCondition5,
  [DataBreaches.Condition6]: dataBreachCondition6,
  [DataBreaches.Condition7]: dataBreachCondition7,
};

const krogerStates: Record<any, boolean> = {
  AL: true,
  AR: true,
  AZ: true,
  CA: true,
  CO: true,
  GA: true,
  NC: true,
  IA: true,
  ID: true,
  IL: true,
  IN: true,
  KS: true,
  KY: true,
  LA: true,
  MD: true,
  MI: true,
  MO: true,
  MT: true,
  NE: true,
  NM: true,
  NV: true,
  OH: true,
  OR: true,
  PA: true,
  SC: true,
  TN: true,
  TX: true,
  UT: true,
  VA: true,
  WA: true,
  WI: true,
  WV: true,
  WY: true,
};

const experianStates: Record<any, boolean> = {
  ND: true,
  SD: true,
  WI: true,
  OK: true,
  ME: true,
  VT: true,
  NH: true,
  NY: true,
  MA: true,
  NJ: true,
  DE: true,
  CT: true,
  RI: true,
  HI: true,
  AK: true,
  NC: true,
  FL: true,
};
