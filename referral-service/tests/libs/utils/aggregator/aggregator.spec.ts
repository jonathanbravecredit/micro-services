import { DynamoDBRecord } from 'aws-lambda';
import { Aggregator } from 'libs/utils/aggregator/aggregator';
import { Helper } from 'tests/helpers/test-helper';
import { MOCK_CAMPAIGN_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN } from 'tests/__mocks__/campaign.mocks';
import {
  MOCK_ENROLLED_MODIFY,
  MOCK_INSERT,
  MOCK_MODIFY,
  MOCK_NOTREFERRED_MODIFY,
  MOCK_UNENROLLED_MODIFY,
  MOCK_UNENROLLED_TO_ENROLLED_MODIFY,
} from 'tests/__mocks__/referral.mocks';
import { mocked } from 'ts-jest/utils';
import { Nested as _nest } from 'libs/utils/helpers/Nested';

describe('Aggregator Class', () => {
  const mockInsert = MOCK_INSERT;
  const mockModify = MOCK_MODIFY;
  const mockCampaign = MOCK_CAMPAIGN_ACTIVE;
  let aggregator = new Aggregator(mockCampaign, mockModify);
  let h = new Helper<Aggregator>(aggregator);

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
    it('should have a method named qualifyReferral', () => {
      expect(h.hasMethod(aggregator, 'qualifyReferral')).toEqual(true);
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
      const agg = new Aggregator(MOCK_CAMPAIGN_ACTIVE, MOCK_NOTREFERRED_MODIFY);
      const res = await agg.getReferrer();
      expect(res).toBeNull();
    });
  });

  describe('setEnrollment', () => {
    it('should set enrollment to "past_enrolled" when curr enrolled and prior enrolled', () => {
      expect(aggregator.enrollment).toEqual('past_enrolled');
    });
    it('should set enrollment to "new_enrolled" when curr enrolled and prior NOT enrolled', () => {
      let agg = new Aggregator(mockCampaign, MOCK_INSERT);
      expect(agg.enrollment).toEqual('new_enrolled');
    });
    it('should set enrollment to "not_enrolled" when curr NOT enrolled and prior NOT enrolled', () => {
      let agg = new Aggregator(mockCampaign, MOCK_UNENROLLED_MODIFY);
      expect(agg.enrollment).toEqual('not_enrolled');
    });
  });

  describe('qualifyReferral', () => {
    describe('new enrollments', () => {
      let aggTwo = new Aggregator(MOCK_CAMPAIGN_ACTIVE, MOCK_UNENROLLED_TO_ENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should call creditReferree if campaign is active and enrollment = "new_enrolled"', async () => {
        await aggTwo.qualifyReferral();
        expect(spyReferree).toHaveBeenCalledTimes(1);
      });
      it('should call creditReferrer if campaign is active and enrollment = "new_enrolled"', async () => {
        await aggTwo.qualifyReferral();
        expect(spyReferrer).toHaveBeenCalledTimes(1);
      });
      it('should not call creditReferee or creditReferrer if campaign is inactive', () => {
        aggTwo = new Aggregator(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_UNENROLLED_TO_ENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    describe('past enrolled', () => {
      let aggTwo = new Aggregator(MOCK_CAMPAIGN_ACTIVE, MOCK_ENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is active and enrollment = "past_enrolled"', async () => {
        await aggTwo.qualifyReferral();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is inactive', async () => {
        aggTwo = new Aggregator(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_ENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        await aggTwo.qualifyReferral();
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    describe('not enrolled', () => {
      let aggTwo = new Aggregator(MOCK_CAMPAIGN_ACTIVE, MOCK_UNENROLLED_MODIFY);
      let spyReferree = jest.spyOn(aggTwo, 'creditReferree');
      let spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
      beforeEach(() => {
        spyReferree.mockClear();
        spyReferrer.mockClear();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is active and enrollment = "not_enrolled"', async () => {
        await aggTwo.qualifyReferral();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
      it('should NOT call creditReferee or creditReferrer if campaign is inactive', async () => {
        aggTwo = new Aggregator(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_UNENROLLED_MODIFY);
        spyReferree = jest.spyOn(aggTwo, 'creditReferree');
        spyReferrer = jest.spyOn(aggTwo, 'creditReferrer');
        await aggTwo.qualifyReferral();
        expect(spyReferree).not.toHaveBeenCalled();
        expect(spyReferrer).not.toHaveBeenCalled();
      });
    });

    it('should NOT call creditReferrer nor creditReferree if campaign = NO_CAMPAIGN', async () => {
      let aggThree = new Aggregator(MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_MODIFY);
      const spyOne = jest.spyOn(aggThree, 'creditReferrer');
      const spyTwo = jest.spyOn(aggThree, 'creditReferree');
      await aggThree.qualifyReferral();
      expect(spyOne).not.toHaveBeenCalled();
      expect(spyTwo).not.toHaveBeenCalled();
    });
  });

  describe('creditReferrer', () => {
    let incBaseSpy = jest
      .spyOn(aggregator, 'incrementBase')
      .mockReturnValueOnce({ campaignActiveEarned: 1, totalEarned: 1 });
    let incBonusSpy = jest
      .spyOn(aggregator, 'incrementBonus')
      .mockReturnValueOnce({ campaignActiveBonus: 1, totalBonus: 1 });
    let incCountSpy = jest
      .spyOn(aggregator, 'incrementCount')
      .mockReturnValueOnce({ campaignActiveReferred: 1, totalReferred: 1 });
    let getPayDteSpy = jest.spyOn(aggregator, 'getPaymentDate').mockReturnValueOnce(new Date().toISOString());
    let updateRefSpy = jest.spyOn(aggregator, 'updateReferral').mockReturnValueOnce(Promise.resolve());
    beforeEach(() => {
      incBaseSpy.mockClear();
      incBonusSpy.mockClear();
      incCountSpy.mockClear();
      getPayDteSpy.mockClear();
      updateRefSpy.mockClear();
    });
    it('should return null if this.referrer is not set or null', async () => {
      const spy = jest.spyOn(aggregator, 'getReferrer').mockReturnValueOnce(Promise.resolve(null));
      aggregator.init();
      const res = await aggregator.creditReferrer();
      expect(res).toBeNull();
    });
    it('should call incrementBase if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(incBaseSpy).toHaveBeenCalledTimes(1);
    });
    it('should call incrementBonuse if this.referrer is set and not null', async () => {
      await aggregator.creditReferrer();
      expect(incBonusSpy).toHaveBeenCalledTimes(1);
    });
  });
});
