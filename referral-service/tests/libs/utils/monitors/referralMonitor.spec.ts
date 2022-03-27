import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { ReferralAggregationManager } from 'libs/utils/managers/referralAggregationManager';
import { ReferralSuspensionManager } from 'libs/utils/managers/referralSuspensionManager';
import { ReferralMonitor } from 'libs/utils/monitors/referralMonitor';
import { Helper } from 'tests/helpers/test-helper';
import { MOCK_CAMPAIGN_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN } from 'tests/__mocks__/campaign.mocks';
import { mocked } from 'ts-jest/utils';

jest.mock('libs/utils/managers/referralSuspensionManager');
jest.mock('libs/utils/managers/referralAggregationManager');
jest.mock('libs/queries/campaigns/campaigns.queries');
describe('ReferralMonitor', () => {
  let monitor = new ReferralMonitor([] as any);
  let h = new Helper<ReferralMonitor>(monitor);
  const mockedSusMgr = mocked(ReferralSuspensionManager);
  const mockedAggMgr = mocked(ReferralAggregationManager);
  const mockedGet = mocked(getCampaign);
  describe('Properties and methods', () => {
    it('should have a property called records', () => {
      expect(h.hasProperty(monitor, 'records')).toEqual(true);
    });
    it('should have a method called init', () => {
      expect(h.hasMethod(monitor, 'init')).toEqual(true);
    });
    it('should have a method called monitor', () => {
      expect(h.hasMethod(monitor, 'monitor')).toEqual(true);
    });
    it('should have a method called checkSuspensions', () => {
      expect(h.hasMethod(monitor, 'checkSuspensions')).toEqual(true);
    });
    it('should have a method called checkAggregations', () => {
      expect(h.hasMethod(monitor, 'checkAggregations')).toEqual(true);
    });
    it('should have a method called getCampaign', () => {
      expect(h.hasMethod(monitor, 'getCampaign')).toEqual(true);
    });
  });

  describe('init', () => {
    it('should should call getCampaign', async () => {
      const spy = jest.spyOn(monitor, 'getCampaign');
      await monitor.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('process', () => {
    it('should not call any checkSuspensions nor checkAggregations if no records', async () => {
      const spySus = jest.spyOn(monitor, 'checkSuspensions');
      const spyAgg = jest.spyOn(monitor, 'checkAggregations');
      await monitor.monitor();
      expect(spySus).not.toHaveBeenCalled();
      expect(spyAgg).not.toHaveBeenCalled();
    });
    it('should call checkSuspensions and checkAggregations 3 times', async () => {
      const mon = new ReferralMonitor([0, 1, 2] as any);
      const spySus = jest.spyOn(mon, 'checkSuspensions');
      const spyAgg = jest.spyOn(mon, 'checkAggregations');
      await mon.monitor();
      expect(spySus).toHaveBeenCalledTimes(3);
      expect(spyAgg).toHaveBeenCalledTimes(3);
    });
  });

  describe('checkSuspensions', () => {
    beforeEach(() => {
      mockedSusMgr.mockReset();
    });
    it('should create a ReferralSuspensionManager instance', async () => {
      await monitor.checkSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it('should call the handleSuspensions method on ReferralSuspensionManager instance', async () => {
      await monitor.checkSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0].handleSuspensions;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('checkAggregations', () => {
    beforeEach(() => {
      mockedAggMgr.mockReset();
    });
    it('should not create an instance of ReferralAggregationManager if campaign is falsey ', async () => {
      monitor.campaign = null;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).toBeUndefined();
    });
    it('should create a ReferralAggregationManager instance', async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it('should call the quantifyReferral method on ReferralAggregationManager instance', async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0].quantifyReferral;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('getCampaign', () => {
    it('should call getCampaign', async () => {
      await monitor.getCampaign();
      expect(mockedGet).toHaveBeenCalled();
    });
  });
});
