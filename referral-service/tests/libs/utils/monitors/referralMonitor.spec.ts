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
    it('should have a method called process', () => {
      expect(h.hasMethod(monitor, 'process')).toEqual(true);
    });
    it('should have a method called processSuspensions', () => {
      expect(h.hasMethod(monitor, 'processSuspensions')).toEqual(true);
    });
    it('should have a method called processAggregations', () => {
      expect(h.hasMethod(monitor, 'processAggregations')).toEqual(true);
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
    it('should not call any processSuspensions nor processAggregations if no records', async () => {
      const spySus = jest.spyOn(monitor, 'processSuspensions');
      const spyAgg = jest.spyOn(monitor, 'processAggregations');
      await monitor.process();
      expect(spySus).not.toHaveBeenCalled();
      expect(spyAgg).not.toHaveBeenCalled();
    });
    it('should call processSuspensions and processAggregations 3 times', async () => {
      const mon = new ReferralMonitor([0, 1, 2] as any);
      const spySus = jest.spyOn(mon, 'processSuspensions');
      const spyAgg = jest.spyOn(mon, 'processAggregations');
      await mon.process();
      expect(spySus).toHaveBeenCalledTimes(3);
      expect(spyAgg).toHaveBeenCalledTimes(3);
    });
  });

  describe('processSuspensions', () => {
    beforeEach(() => {
      mockedSusMgr.mockReset();
    });
    it('should create a ReferralSuspensionManager instance', async () => {
      await monitor.processSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it('should call the handleSuspensions method on ReferralSuspensionManager instance', async () => {
      await monitor.processSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0].handleSuspensions;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('processAggregations', () => {
    beforeEach(() => {
      mockedAggMgr.mockReset();
    });
    it('should not create an instance of ReferralAggregationManager if campaign is falsey ', async () => {
      monitor.campaign = null;
      await monitor.processAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).toBeUndefined();
    });
    it('should create a ReferralAggregationManager instance', async () => {
      // jest.spyOn(monitor, 'getCampaign').mockReturnValueOnce(Promise.resolve(MOCK_CAMPAIGN_ACTIVE));
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.processAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it('should call the quantifyReferral method on ReferralAggregationManager instance', async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.processAggregations({} as any);
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
