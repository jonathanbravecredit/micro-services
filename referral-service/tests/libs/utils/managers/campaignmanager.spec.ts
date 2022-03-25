import {
  getActiveCampaignReferrals,
  getEligibileReferrals,
  updateReferralCampaign,
} from 'libs/queries/referrals/referral.queries';
import { CampaignManager } from 'libs/utils/managers/campaignManager';
import { Helper } from 'tests/helpers/test-helper';
import { mocked } from 'ts-jest/utils';
import {
  MOCK_MODIFY_ACTIVE_TO_ACTIVE,
  MOCK_CAMPAIGN_NO_CAMPAIGN,
  MOCK_MODIFY_ACTIVE_TO_INACTIVE,
  MOCK_MODIFY_INACTIVE_TO_ACTIVE,
} from 'tests/__mocks__/campaign.mocks';

jest.mock('libs/queries/referrals/referral.queries');

describe('CampaignManager', () => {
  let manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
  let h = new Helper<CampaignManager>(manager);
  const mockedListActive = mocked(getActiveCampaignReferrals);
  const mockedListEligible = mocked(getEligibileReferrals);
  const mockedUpdate = mocked(updateReferralCampaign);
  beforeEach(() => {
    mockedListActive.mockClear();
    mockedListEligible.mockClear();
    mockedUpdate.mockClear();
    manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
  });
  describe('Inherited properties and methods', () => {
    it('should have property currImage', () => {
      expect(h.hasProperty(manager, 'currImage')).toEqual(true);
    });
    it('should have property priorImage', () => {
      expect(h.hasProperty(manager, 'priorImage')).toEqual(true);
    });
    it('should have property event', () => {
      expect(h.hasProperty(manager, 'event')).toEqual(true);
    });
    it('should have init method', () => {
      expect(h.hasMethod(manager, 'init')).toEqual(true);
    });
    it('should have parseImages method', () => {
      expect(h.hasMethod(manager, 'parseImages')).toEqual(true);
    });
    it('should have parseEvent method', () => {
      expect(h.hasMethod(manager, 'parseEvent')).toEqual(true);
    });
    it('should have unmarshal method', () => {
      expect(h.hasMethod(manager, 'unmarshall')).toEqual(true);
    });
  });

  describe('Properties and methods', () => {
    it('should have a property called record', () => {
      expect(h.hasProperty(manager, 'record')).toEqual(true);
    });
    it('should have a property called nocampaign', () => {
      expect(h.hasProperty(manager, 'nocampaign')).toEqual(true);
    });
    it('should have a method called process', () => {
      expect(h.hasMethod(manager, 'process')).toEqual(true);
    });
    it('should have a method called isDisabled', () => {
      expect(h.hasMethod(manager, 'isDisabled')).toEqual(true);
    });
    it('should have a method called isEnabled', () => {
      expect(h.hasMethod(manager, 'isEnabled')).toEqual(true);
    });
    it('should have a method called listReferralsByCampaign', () => {
      expect(h.hasMethod(manager, 'listReferralsByCampaign')).toEqual(true);
    });
    it('should have a method called listReferralsByEligible', () => {
      expect(h.hasMethod(manager, 'listReferralsByEligible')).toEqual(true);
    });
    it('should have a method called updateReferral', () => {
      expect(h.hasMethod(manager, 'updateReferral')).toEqual(true);
    });
    it('should have a method called resetReferral', () => {
      expect(h.hasMethod(manager, 'resetReferral')).toEqual(true);
    });
    it('should have a method called disableCampaign', () => {
      expect(h.hasMethod(manager, 'disableCampaign')).toEqual(true);
    });
    it('should have a method called enableCampaign', () => {
      expect(h.hasMethod(manager, 'enableCampaign')).toEqual(true);
    });
  });

  describe('process', () => {
    it('should return undefined if event !== "MODIFY"', async () => {
      manager.event = 'INSERT';
      const res = await manager.process();
      expect(res).toBeUndefined();
    });
    it('should call isDisabled if event === "MODIFY"', async () => {
      manager.event = 'MODIFY';
      const spy = jest.spyOn(manager, 'isDisabled');
      await manager.process();
      expect(spy).toHaveBeenCalled();
    });
    it('should call disableCampaign isDisabled returns true AND event === "MODIFY"', async () => {
      manager.event = 'MODIFY';
      jest.spyOn(manager, 'isDisabled').mockReturnValue(true);
      const spy = jest.spyOn(manager, 'disableCampaign');
      await manager.process();
      expect(spy).toHaveBeenCalled();
    });
    it('should call isEnabled if isDisabled returns false AND event === "MODIFY"', async () => {
      manager.event = 'MODIFY';
      jest.spyOn(manager, 'isDisabled').mockReturnValue(false);
      const spy = jest.spyOn(manager, 'isEnabled');
      await manager.process();
      expect(spy).toHaveBeenCalled();
    });
    it('should call enableCampaign if isDisabled returns false AND isEnabled returns true AND event === "MODIFY"', async () => {
      manager.event = 'MODIFY';
      jest.spyOn(manager, 'isDisabled').mockReturnValue(false);
      jest.spyOn(manager, 'isEnabled').mockReturnValue(true);
      const spy = jest.spyOn(manager, 'enableCampaign');
      await manager.process();
      expect(spy).toHaveBeenCalled();
    });
    it('should NOT call disableCampaign NOR enableCampaign if neither isDisabled or isEnabled returns true', async () => {
      manager.event = 'MODIFY';
      jest.spyOn(manager, 'isDisabled').mockReturnValue(false);
      jest.spyOn(manager, 'isEnabled').mockReturnValue(false);
      const spyOne = jest.spyOn(manager, 'disableCampaign');
      const spyTwo = jest.spyOn(manager, 'enableCampaign');
      await manager.process();
      expect(spyOne).not.toHaveBeenCalled();
      expect(spyTwo).not.toHaveBeenCalled();
    });
  });

  describe('isDisabled', () => {
    it('should return true if campaign goes from active to inactive', () => {
      manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_INACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isDisabled();
      expect(res).toEqual(true);
    });
    it('should return false if campaign goes from inactive to active', () => {
      manager = new CampaignManager(MOCK_MODIFY_INACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isDisabled();
      expect(res).toEqual(false);
    });
    it('should return false if campaign goes from active to active', () => {
      manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isDisabled();
      expect(res).toEqual(false);
    });
  });

  describe('isEnabled', () => {
    it('should return false if campaign goes from active to inactive', () => {
      manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_INACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isEnabled();
      expect(res).toEqual(false);
    });
    it('should return true if campaign goes from inactive to active', () => {
      manager = new CampaignManager(MOCK_MODIFY_INACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isEnabled();
      expect(res).toEqual(true);
    });
    it('should return false if campaign does not change', () => {
      manager = new CampaignManager(MOCK_MODIFY_ACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN);
      const res = manager.isEnabled();
      expect(res).toEqual(false);
    });
  });

  describe('disableCampaign', () => {
    it('should call listReferralsByCampaign', async () => {
      const spy = jest.spyOn(manager, 'listReferralsByCampaign');
      await manager.disableCampaign();
      expect(spy).toHaveBeenCalled();
    });
    it('should return undefined when no active referrals with expiring campaign', async () => {
      jest.spyOn(manager, 'listReferralsByCampaign').mockReturnValue(Promise.resolve([]));
      const res = await manager.disableCampaign();
      expect(res).toBeUndefined();
    });
    it('should run resetReferral 3 times if 3 actives referrals with expiring campaign', async () => {
      jest.spyOn(manager, 'listReferralsByCampaign').mockReturnValue(Promise.resolve([0, 1, 2] as any[]));
      const spy = jest.spyOn(manager, 'resetReferral');
      await manager.disableCampaign();
      expect(spy).toHaveBeenNthCalledWith(1, 0);
      expect(spy).toHaveBeenNthCalledWith(2, 1);
      expect(spy).toHaveBeenNthCalledWith(3, 2);
    });
    it('should run updateReferral 3 times with the results of resetReferral', async () => {
      jest.spyOn(manager, 'listReferralsByCampaign').mockReturnValue(Promise.resolve([0, 1, 2] as any[]));
      jest
        .spyOn(manager, 'resetReferral')
        .mockReturnValueOnce('a' as any)
        .mockReturnValueOnce('b' as any)
        .mockReturnValueOnce('c' as any);
      const spy = jest.spyOn(manager, 'updateReferral');
      await manager.disableCampaign();
      expect(spy).toHaveBeenNthCalledWith(1, 'a');
      expect(spy).toHaveBeenNthCalledWith(2, 'b');
      expect(spy).toHaveBeenNthCalledWith(3, 'c');
    });
  });

  describe('enableCampaign', () => {
    it('should call listReferralsByEligible', async () => {
      const spy = jest.spyOn(manager, 'listReferralsByEligible');
      await manager.enableCampaign();
      expect(spy).toHaveBeenCalled();
    });
    it('should return undefined when no eligible referrals', async () => {
      jest.spyOn(manager, 'listReferralsByEligible').mockReturnValue(Promise.resolve([]));
      const res = await manager.enableCampaign();
      expect(res).toBeUndefined();
    });
    it('should run updateReferral 3 times if 3 elgible referrals', async () => {
      jest.spyOn(manager, 'listReferralsByEligible').mockReturnValue(Promise.resolve([0, 1, 2] as any[]));
      const spy = jest.spyOn(manager, 'updateReferral');
      await manager.enableCampaign();
      expect(spy).toHaveBeenNthCalledWith(1, 0);
      expect(spy).toHaveBeenNthCalledWith(2, 1);
      expect(spy).toHaveBeenNthCalledWith(3, 2);
    });
  });

  describe('listReferralsByCampaign', () => {
    it('should return undefined if priorImage is falsey', async () => {
      manager.priorImage = null;
      const res = await manager.listReferralsByCampaign();
      expect(res).toBeUndefined();
    });
    it('should call getActiveCampaignReferrals', async () => {
      await manager.listReferralsByCampaign();
      expect(mockedListActive).toHaveBeenCalled();
    });
    it('should return results of getActiveCampaignReferrals', async () => {
      mockedListActive.mockReturnValue(Promise.resolve(['abc' as any]));
      const res = await manager.listReferralsByCampaign();
      expect(res).toEqual(['abc']);
    });
  });

  describe('listReferralsByEligible', () => {
    it('should call getEligibileReferrals', async () => {
      await manager.listReferralsByEligible();
      expect(mockedListEligible).toHaveBeenCalled();
    });
    it('should return result of getEligibileReferrals', async () => {
      mockedListEligible.mockReturnValue(Promise.resolve(['abc' as any]));
      const res = await manager.listReferralsByEligible();
      expect(res).toEqual(['abc']);
    });
  });

  describe('updateReferral', () => {
    it('should run updateReferralCampaign', async () => {
      await manager.updateReferral({ id: 'abc', campaign: 'mar2022' } as any);
      expect(mockedUpdate).toHaveBeenCalled();
    });
  });
});
