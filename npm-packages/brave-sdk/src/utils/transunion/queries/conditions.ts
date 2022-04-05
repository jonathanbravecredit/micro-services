import { TransunionFilters } from '../filters';
import { DataBreaches, EXPERIAN_STATES, KROGER_STATES } from '../../../constants/transunion';
import { BorrowerAddress, TradeLinePartition } from '../../../models/merge-report';
import { InquiryPartition } from '../../../models/merge-report/components/inquiry-partition';

const dataBreachCondition1 = ({
  address,
  tradelines,
}: {
  address: BorrowerAddress;
  tradelines: TradeLinePartition[];
}): DataBreaches => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() !== 'ca') return DataBreaches.None;
  const carLoan = TransunionFilters.filterTradelinesByIndustryCode(tradelines, 'BA');
  if (carLoan.length > 0) return DataBreaches.Condition1;
  return DataBreaches.None;
};

const dataBreachCondition2 = ({ address }: { address: BorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'ca') return DataBreaches.Condition2;
  return DataBreaches.None;
};

const dataBreachCondition3 = ({ address }: { address: BorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'co') return DataBreaches.Condition3;
  return DataBreaches.None;
};

const dataBreachCondition4 = ({ address }: { address: BorrowerAddress }) => {
  const code = address?.CreditAddress?.stateCode?.toUpperCase();
  if (!code) return DataBreaches.None;
  return KROGER_STATES[code] ? DataBreaches.Condition4 : DataBreaches.None;
};

const dataBreachCondition5 = ({ inquiries }: { inquiries: InquiryPartition[] }) => {
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

const dataBreachCondition6 = ({ address }: { address: BorrowerAddress }) => {
  if (address?.CreditAddress?.stateCode?.toLowerCase() === 'wa') return DataBreaches.Condition6;
  return DataBreaches.None;
};

const dataBreachCondition7 = ({ address }: { address: BorrowerAddress }) => {
  const code = address?.CreditAddress?.stateCode?.toUpperCase();
  if (!code) return DataBreaches.None;
  return EXPERIAN_STATES[code] ? DataBreaches.Condition7 : DataBreaches.None;
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
