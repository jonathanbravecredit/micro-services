import { Helper } from 'tests/helpers/test-helper';
import { MOCK_CAMPAIGN_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN } from 'tests/__mocks__/campaign.mocks';
import {
  MOCK_ENROLLED_MODIFY,
  MOCK_INSERT,
  MOCK_MODIFY,
  MOCK_NOTREFERRED_MODIFY,
  MOCK_UNENROLLED_MODIFY,
  MOCK_UNENROLLED_TO_ENROLLED_MODIFY,
  MOCK_UNMARSHALLED,
} from 'tests/__mocks__/referral.mocks';
import { mocked } from 'ts-jest/utils';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { Referral } from 'libs/models/referrals/referral.model';
import { getReferralByCode, updateReferral } from 'libs/queries/referrals/referral.queries';
import { PaymentDateCalculator } from 'libs/utils/paymentdatecalculator/paymentDateCalculator';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { ReferralAggregationManager } from 'libs/utils/managers/referralAggregationManager';

const mockCalcPay = jest.fn().mockReturnValue(new Date().toISOString());
jest.mock('libs/utils/paymentdatecalculator/paymentDateCalculator', () => {
  return {
    PaymentDateCalculator: jest.fn().mockImplementation(() => {
      return {
        calcPaymentDate: mockCalcPay,
      };
    }),
  };
});
jest.mock('libs/queries/referrals/referral.queries');

describe('ReferralAggregationManager Class', () => {
  const mockInsert = MOCK_INSERT;
  const mockModify = MOCK_MODIFY;
  const mockCampaign = MOCK_CAMPAIGN_ACTIVE;
  let aggregator = new ReferralAggregationManager(mockCampaign, mockModify);
  let h = new Helper<ReferralAggregationManager>(aggregator);
  const mockedUpdate = mocked(updateReferral);
  const mockedGetCode = mocked(getReferralByCode);
  const mockedPayCalc = mocked(new PaymentDateCalculator());
  mockedUpdate.mockImplementation((referral: Referral) => {
    return Promise.resolve();
  });
  mockedGetCode.mockImplementation((code: string | null) => {
    return Promise.resolve({ id: 'xyz' } as Referral);
  });

  describe('Inherited properties and methods', () => {
    it('should have property currImage', () => {
      expect(h.hasProperty(aggregator, 'currImage')).toEqual(true);
    });
    it('should have property priorImage', () => {
      expect(h.hasProperty(aggregator, 'priorImage')).toEqual(true);
    });
    it('should have property event', () => {
      expect(h.hasProperty(aggregator, 'event')).toEqual(true);
    });
    it('should have init method', () => {
      expect(h.hasMethod(aggregator, 'init')).toEqual(true);
    });
    it('should have parseImages method', () => {
      expect(h.hasMethod(aggregator, 'parseImages')).toEqual(true);
    });
    it('should have parseEvent method', () => {
      expect(h.hasMethod(aggregator, 'parseEvent')).toEqual(true);
    });
    it('should have unmarshal method', () => {
      expect(h.hasMethod(aggregator, 'unmarshall')).toEqual(true);
    });
  });

  describe('Properties and methods', () => {
    it('should have a property named campaign', () => {
      expect(h.hasProperty(aggregator, 'campaign')).toEqual(true);
    });
    it('should have a method called setEnrollment', () => {
      expect(h.hasMethod(aggregator, 'setEnrollment')).toEqual(true);
    });
    it('should have a method called setPaymentDate', () => {
      expect(h.hasMethod(aggregator, 'setEnrollment')).toEqual(true);
    });
    it('should have a method named getReferrer', () => {
      expect(h.hasMethod(aggregator, 'getReferrer')).toEqual(true);
    });
    it('should have a method named creditReferrer', () => {
      expect(h.hasMethod(aggregator, 'creditReferrer')).toEqual(true);
    });
    it('should have a method named creditReferree', () => {
      expect(h.hasMethod(aggregator, 'creditReferree')).toEqual(true);
    });
    it('should have a method named incrementBase', () => {
      expect(h.hasMethod(aggregator, 'incrementBase')).toEqual(true);
    });
    it('should have a method named incrementAddOn', () => {
      expect(h.hasMethod(aggregator, 'incrementAddOn')).toEqual(true);
    });
    it('should have a method named incrementBonus', () => {
      expect(h.hasMethod(aggregator, 'incrementBonus')).toEqual(true);
    });
    it('should have a method named incrementCount', () => {
      expect(h.hasMethod(aggregator, 'incrementCount')).toEqual(true);
    });
    it('should have a method named quantifyReferral', () => {
      expect(h.hasMethod(aggregator, 'quantifyReferral')).toEqual(true);
    });
  });

  describe('init', () => {
    it('should call setEnrollment', () => {
      const spy = jest.spyOn(aggregator, 'setEnrollment');
      aggregator.init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call setReferree', () => {
      const spy = jest.spyOn(aggregator, 'setReferree');
      aggregator.init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call setReferrer', () => {
      const spy = jest.spyOn(aggregator, 'setReferrer');
      aggregator.init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setReferree', () => {
    it('should set referree property to currImage', () => {
      aggregator.setReferree();
      expect(aggregator.referree).toEqual(aggregator.currImage);
    });
  });

  describe('setReferrer', () => {
    it('should set referrer property to result of getReferrer', async () => {
      await aggregator.setReferree();
      expect(aggregator.referree).toEqual(aggregator.currImage);
    });
  });

  describe('getReferrer', () => {
    it('should return null if currImage.referredByCode is null', async () => {
      const agg = new ReferralAggregationManager(MOCK_CAMPAIGN_ACTIVE, MOCK_NOTREFERRED_MODIFY);
      const res = await agg.getReferrer();
      expect(res).toBeNull();
    });
    it('should return the result of the getReferralByCode query', async () => {
      const res = await aggregator.getReferrer();
      expect(res).toEqual({ id: 'xyz' });
    });
  });

  describe('setEnrollment', () => {
    it('should set enrollment to "past_enrolled" when curr enrolled and prior enrolled', () => {
      expect(aggregator.enrollment).toEqual('past_enrolled');
    });
    it('should set enrollment to "new_enrolled" when curr enrolled and prior NOT enrolled', () => {
      let agg = new ReferralAggregationManager(mockCampaign, MOCK_INSERT);
      expect(agg.enrollment).toEqual('new_enrolled');
    });
    it('should set enrollment to "not_enrolled" when curr NOT enrolled and prior NOT enrolled', () => {
      let agg = new ReferralAggregationManager(mockCampaign, MOCK_UNENROLLED_MODIFY);
      expect(agg.enrollment).toEqual('not_enrolled');
    });
  });

  describe('quantifyReferral', () => {
    describe('new enrollments', () => {
      let aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_ACTIVE, MOCK_UNENROLLED_TO_ENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should call creditReferree if campaign is active and enrollment = "new_enrolled"', async () => {
        await aggTwo.quantifyReferral();
        expect(spyReferree).toHaveBeenCalledTimes(1);
      });
      it('should call creditReferrer if campaign is active and enrollment = "new_enrolled"', async () => {
        await aggTwo.quantifyReferral();
        expect(spyReferrer).toHaveBeenCalledTimes(1);
      });
      it('should not call creditReferee or creditReferrer if campaign is inactive', () => {
        aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_UNENROLLED_TO_ENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    describe('past enrolled', () => {
      let aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_ACTIVE, MOCK_ENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is active and enrollment = "past_enrolled"', async () => {
        await aggTwo.quantifyReferral();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is inactive', async () => {
        aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_ENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        await aggTwo.quantifyReferral();
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    describe('not enrolled', () => {
      let aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_ACTIVE, MOCK_UNENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is active and enrollment = "not_enrolled"', async () => {
        await aggTwo.quantifyReferral();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is inactive', async () => {
        aggTwo = new ReferralAggregationManager(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_UNENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        await aggTwo.quantifyReferral();
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    it('should NOT call creditReferrer nor creditReferree if campaign = NO_CAMPAIGN', async () => {
      let aggThree = new ReferralAggregationManager(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_MODIFY);
      const spyOne = jest.spyOn(aggThree, 'creditReferrer');
      const spyTwo = jest.spyOn(aggThree, 'creditReferree');
      await aggThree.quantifyReferral();
      expect(spyOne).not.toHaveBeenCalled();
      expect(spyTwo).not.toHaveBeenCalled();
    });
  });

  describe('creditReferrer', () => {
    let incCountSpy = jest
      .spyOn(aggregator, 'incrementCount')
      .mockReturnValueOnce({ campaignActiveReferred: 1, totalReferred: 1 });
    let incBaseSpy = jest
      .spyOn(aggregator, 'incrementBase')
      .mockReturnValueOnce({ campaignActiveEarned: 1, totalEarned: 1 });
    let incBonusSpy = jest
      .spyOn(aggregator, 'incrementBonus')
      .mockReturnValueOnce({ campaignActiveBonus: 1, totalBonus: 1 });
    let getPayDteSpy = jest
      .spyOn(aggregator, 'getPaymentDate')
      .mockReturnValueOnce({ nextPaymentDate: new Date().toISOString() });
    let updateRefSpy = jest.spyOn(aggregator, 'updateReferral').mockReturnValueOnce(Promise.resolve());
    beforeEach(() => {
      incBaseSpy.mockClear();
      incBonusSpy.mockClear();
      incCountSpy.mockClear();
      getPayDteSpy.mockClear();
      updateRefSpy.mockClear();
      aggregator.referrer = MOCK_UNMARSHALLED;
    });
    it('should return undefined if this.referrer is not set or null', async () => {
      aggregator.referrer = null as unknown as Referral;
      const res = await aggregator.creditReferrer();
      expect(res).toBeUndefined();
    });
    it('should return undefined if this.referrer is empty object', async () => {
      aggregator.referrer = {} as unknown as Referral;
      const res = await aggregator.creditReferrer();
      expect(res).toBeUndefined();
    });
    it('should call incrementCount if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(incCountSpy).toHaveBeenCalledTimes(1);
    });
    it('should call incrementBase if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(incBaseSpy).toHaveBeenCalledTimes(1);
    });
    it('should call incrementBonus if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(incBonusSpy).toHaveBeenCalledTimes(1);
    });
    it('should call getPaymentDate if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(getPayDteSpy).toHaveBeenCalledTimes(1);
    });
    it('should call updateReferral if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(updateRefSpy).toHaveBeenCalledTimes(1);
    });
    it('should call updateReferral with the updated base, bonus, count and new payment date', async () => {
      let updated = { ...aggregator.referrer } as Referral;
      // keep in this order
      updated = { ...updated, ...aggregator.incrementCount(updated) };
      updated = { ...updated, ...aggregator.incrementBase(updated) };
      updated = { ...updated, ...aggregator.incrementBonus(updated) };
      updated = { ...updated, ...aggregator.getPaymentDate(updated) };
      await aggregator.creditReferrer();
      expect(updateRefSpy).toHaveBeenCalledWith(updated);
    });
  });

  describe('creditReferree', () => {
    let incAddOnSpy = jest
      .spyOn(aggregator, 'incrementAddOn')
      .mockReturnValueOnce({ campaignActiveAddOn: 1, totalAddOn: 1 });
    let getPayDteSpy = jest
      .spyOn(aggregator, 'getPaymentDate')
      .mockReturnValueOnce({ nextPaymentDate: new Date().toISOString() });
    let updateRefSpy = jest.spyOn(aggregator, 'updateReferral').mockReturnValueOnce(Promise.resolve());
    beforeEach(() => {
      incAddOnSpy.mockClear();
      updateRefSpy.mockClear();
      getPayDteSpy.mockClear();
      aggregator.campaign.addOnFlagOne = 'enrollment';
      aggregator.init();
    });
    it('should return undefined if this.referree is not set or null', async () => {
      aggregator.referree = null as unknown as Referral;
      const res = await aggregator.creditReferrer();
      expect(res).toBeUndefined();
    });
    it('should return undefined if this.referrer is empty object', async () => {
      aggregator.referree = {} as Referral;
      const res = await aggregator.creditReferrer();
      expect(res).toBeUndefined();
    });
    it('should run incrementAddon if addOnFlagOne is set', async () => {
      await aggregator.creditReferree();
      expect(incAddOnSpy).toHaveBeenCalled();
    });
    it('should run getPaymentDate if addOnFlagOne is set', async () => {
      await aggregator.creditReferree();
      expect(getPayDteSpy).toHaveBeenCalled();
    });
    it('should run updateReferral if addOnFlagOne is set', async () => {
      await aggregator.creditReferree();
      expect(updateRefSpy).toHaveBeenCalled();
    });
    it('should call updateReferral with the addon and new payment date', async () => {
      let updated = { ...aggregator.referree } as Referral;
      updated = { ...updated, ...aggregator.incrementAddOn(updated) };
      updated = { ...updated, ...aggregator.getPaymentDate(updated) };
      await aggregator.creditReferree();
      expect(updateRefSpy).toHaveBeenCalledWith(updated);
    });
  });

  describe('updateReferral', () => {
    it('should call updateReferral query', async () => {
      const params = { id: 'blahblah' } as Referral;
      await aggregator.updateReferral(params);
      expect(mockedUpdate).toHaveBeenCalledWith(params);
    });
    it('should return undefined', async () => {
      const params = { id: 'blahblah' } as Referral;
      const res = await aggregator.updateReferral(params);
      expect(res).toBeUndefined();
    });
  });

  describe('getPaymentDate', () => {
    it('should call inBonusOrMax', () => {
      const spy = jest.spyOn(aggregator, 'inBonusOrMax');
      aggregator.getPaymentDate({} as Referral);
      expect(spy).toHaveBeenCalledWith({});
    });
    it('should call PaymentDateCalculate.calcPaymentDate', () => {
      const { endDate } = aggregator.campaign;
      aggregator.getPaymentDate({} as Referral);
      expect(mockedPayCalc.calcPaymentDate).toHaveBeenCalledWith(false, endDate);
    });
  });

  describe('inBonusOrMax', () => {
    it('should return false if referred falsey', () => {
      const res1 = aggregator.inBonusOrMax({ campaignActiveReferred: 0 } as unknown as Referral);
      const res2 = aggregator.inBonusOrMax({ campaignActiveReferred: -1 } as unknown as Referral);
      const res3 = aggregator.inBonusOrMax({ campaignActiveReferred: false } as unknown as Referral);
      const res4 = aggregator.inBonusOrMax({ campaignActiveReferred: undefined } as unknown as Referral);
      expect(res1).toEqual(false);
      expect(res2).toEqual(false);
      expect(res3).toEqual(false);
      expect(res4).toEqual(false);
    });
    it('should return true if campaignActiveReferred >= maxReferrals and maxReferrals > 0', () => {
      aggregator.campaign = { maxReferrals: 1 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(true);
    });
    it('should return false if campaignActiveReferred >= maxReferrals and maxReferrals = 0', () => {
      aggregator.campaign = { maxReferrals: 0 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(false);
    });
    it('should return false if campaignActiveReferred < maxReferrals and maxReferrals > 0', () => {
      aggregator.campaign = { maxReferrals: 5 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(false);
    });
    it('should return true if  campaignActiveReferred >= bonusThreshold and bonusThreshold > 0', () => {
      aggregator.campaign = { bonusThreshold: 1 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(true);
    });
    it('should return false if campaignActiveReferred >= bonusThreshold and bonusThreshold = 0', () => {
      aggregator.campaign = { bonusThreshold: 0 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(false);
    });
    it('should return false if campaignActiveReferred < bonusThreshold and bonusThreshold > 0', () => {
      aggregator.campaign = { bonusThreshold: 5 } as unknown as Campaign;
      const res = aggregator.inBonusOrMax({ campaignActiveReferred: 1 } as unknown as Referral);
      expect(res).toEqual(false);
    });
  });

  describe('incrementCount', () => {
    it('should return the same referred and totalReferred count if referred >= max referrals', () => {
      const referrer = { campaignActiveReferred: 1, totalReferred: 1 } as Referral;
      const campaign = { maxReferrals: 1 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementCount(aggregator.referrer);
      expect(resp).toEqual(referrer);
    });
    it('should return the same referred and totalReferred count if referred >= max referrals', () => {
      const referrer = { campaignActiveReferred: 2, totalReferred: 2 } as Referral;
      const campaign = { maxReferrals: 1 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementCount(aggregator.referrer);
      expect(resp).toEqual(referrer);
    });
    it('should return referred + 1 and totalReferred count + 1 if referred < max referrals', () => {
      const referrer = { campaignActiveReferred: 2, totalReferred: 2 } as Referral;
      const campaign = { maxReferrals: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementCount(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveReferred: 3, totalReferred: 3 });
    });
  });

  describe('incrementBase', () => {
    it('should return existing earned and totalEarned amount if referred >= max referrals', () => {
      const referrer = { campaignActiveReferred: 1, campaignActiveEarned: 5, totalEarned: 5 } as Referral;
      const campaign = { maxReferrals: 1, denomination: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBase(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveEarned: 5, totalEarned: 5 });
    });
    it('should return existing earned and totalEarned amount if referred >= max referrals', () => {
      const referrer = { campaignActiveReferred: 2, campaignActiveEarned: 10, totalEarned: 10 } as Referral;
      const campaign = { maxReferrals: 1, denomination: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBase(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveEarned: 10, totalEarned: 10 });
    });
    it('should return earned + 5 and totalEarned count + 5 if referred < max referrals', () => {
      const referrer = { campaignActiveReferred: 1, campaignActiveEarned: 5, totalEarned: 5 } as Referral;
      const campaign = { maxReferrals: 5, denomination: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBase(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveEarned: 10, totalEarned: 10 });
    });
  });

  describe('incrementBonus', () => {
    it('should return existing bonus if campaignActiveReferred < bonusThreshold', () => {
      const referrer = { campaignActiveReferred: 1, campaignActiveBonus: 0, totalBonus: 0 } as Referral;
      const campaign = { bonusThreshold: 2, bonusAmount: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBonus(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveBonus: 0, totalBonus: 0 });
    });
    it('should return existing bonsu and totalBonus amount if referred >= bonusThreshold', () => {
      const referrer = { campaignActiveReferred: 2, campaignActiveBonus: 5, totalBonus: 5 } as Referral;
      const campaign = { bonusThreshold: 1, bonusAmount: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBonus(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveBonus: 5, totalBonus: 5 });
    });
    it('should return bonus + 5 and totalBonus amount + 5 if referred = bonusThreshold and activeBonus = 0', () => {
      const referrer = { campaignActiveReferred: 1, campaignActiveBonus: 0, totalBonus: 0 } as Referral;
      const campaign = { bonusThreshold: 1, bonusAmount: 5 } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementBonus(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveBonus: 5, totalBonus: 5 });
    });
  });

  describe('incrementAddOn', () => {
    it('should return existing addOn if addOnFlagOne !== enrollment', () => {
      const referrer = { campaignActiveAddOn: 0, totalAddOn: 0 } as Referral;
      const campaign = { denomination: 5, addOnFlagOne: 'blahblah' } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementAddOn(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveAddOn: 0, totalAddOn: 0 });
    });
    it('should return existing addOn if campaignActiveAddOn already added', () => {
      const referrer = { campaignActiveAddOn: 5, totalAddOn: 5 } as Referral;
      const campaign = { denomination: 5, addOnFlagOne: 'enrollment' } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementAddOn(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveAddOn: 5, totalAddOn: 5 });
    });
    it('should return addOn + 5 and totalAddOn amount + 5 if campaignActiveAddOn = 0', () => {
      const referrer = { campaignActiveAddOn: 0, totalAddOn: 0 } as Referral;
      const campaign = { denomination: 5, addOnFlagOne: 'enrollment' } as Campaign;
      aggregator.referrer = referrer;
      aggregator.campaign = campaign;
      const resp = aggregator.incrementAddOn(aggregator.referrer);
      expect(resp).toEqual({ campaignActiveAddOn: 5, totalAddOn: 5 });
    });
  });
});
