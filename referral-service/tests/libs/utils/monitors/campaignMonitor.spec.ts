import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { CampaignDataManager } from 'libs/utils/managers/campaignDataManager';
import { CampaignMonitor } from 'libs/utils/monitors/campaignMonitor';
import { Helper } from 'tests/helpers/test-helper';
import { MOCK_CAMPAIGN_ACTIVE } from 'tests/__mocks__/campaign.mocks';
import { mocked } from 'ts-jest/utils';

jest.mock('libs/utils/managers/campaignDataManager');
jest.mock('libs/queries/campaigns/campaigns.queries');
describe('CampaignMonitor', () => {
  let monitor = new CampaignMonitor([] as any);
  let h = new Helper<CampaignMonitor>(monitor);
  const mockedCampMgr = mocked(CampaignDataManager);
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
    it('should have a method called checkCampaignStatus', () => {
      expect(h.hasMethod(monitor, 'checkCampaignStatus')).toEqual(true);
    });
    it('should have a method called getCampaign', () => {
      expect(h.hasMethod(monitor, 'getCampaign')).toEqual(true);
    });
  });

  describe('init', () => {
    it('should should call getNoCampaign', async () => {
      const spy = jest.spyOn(monitor, 'getNoCampaign');
      await monitor.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('process', () => {
    it('should not call any checkCampaignStatus if no records', async () => {
      const spySts = jest.spyOn(monitor, 'checkCampaignStatus');
      await monitor.monitor();
      expect(spySts).not.toHaveBeenCalled();
    });
    it('should call checkSuspensions and checkAggregations 3 times', async () => {
      const mon = new CampaignMonitor([0, 1, 2] as any);
      const spySts = jest.spyOn(mon, 'checkCampaignStatus');
      await mon.monitor();
      expect(spySts).toHaveBeenCalledTimes(3);
    });
  });

  describe('checkCampaignStatus', () => {
    beforeEach(() => {
      mockedCampMgr.mockReset();
    });
    it('should not create an instance of CampaignDataManager if campaign is falsey ', async () => {
      monitor.campaign = null;
      await monitor.checkCampaignStatus({} as any);
      const mock = mockedCampMgr.mock.instances[0];
      expect(mock).toBeUndefined();
    });
    it('should create a CampaignDataManager instance', async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkCampaignStatus({} as any);
      const mock = mockedCampMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it('should call the process method on CampaignDataManager instance', async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkCampaignStatus({} as any);
      const mock = mockedCampMgr.mock.instances[0].process;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('getNoCampaign', () => {
    it('should call getCampaign', async () => {
      await monitor.getNoCampaign();
      expect(mockedGet).toHaveBeenCalled();
    });
  });
});
