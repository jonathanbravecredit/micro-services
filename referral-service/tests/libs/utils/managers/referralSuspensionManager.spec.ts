import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';
import { ReferralSuspensionManager } from 'libs/utils/managers/referralSuspensionManager';
import { Helper } from 'tests/helpers/test-helper';
import { mocked } from 'ts-jest/utils';
import {
  MOCK_ACTIVE_TO_SUSPENDED,
  MOCK_SUSPENDED_INSERT,
  MOCK_SUSPENDED_TO_SUSPENDED,
} from 'tests/__mocks__/referral.mocks';
import { updateReferral } from 'libs/queries/referrals/referral.queries';

jest.mock('libs/queries/referrals/referral.queries');

describe('ReferralSuspensionManager', () => {
  let manager = new ReferralSuspensionManager(MOCK_ACTIVE_TO_SUSPENDED);
  let h = new Helper<ReferralSuspensionManager>(manager);
  const mockedUpdate = mocked(updateReferral).mockReturnValue(Promise.resolve());
  describe('Inherited properties and methods', () => {
    it('should have property currImage', () => {
      expect(h.hasProperty(manager, 'currImage')).toEqual(true);
    });
    it('should have property priorImage', () => {
      expect(h.hasProperty(manager, 'priorImage')).toEqual(true);
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
    it('should have a getter called needsSuspending', () => {
      expect(manager.needsSuspending).not.toBeUndefined();
    });
    it('should have a method called init', () => {
      expect(h.hasMethod(manager, 'init')).toEqual(true);
    });
    it('should have a method called handleSuspensions', () => {
      expect(h.hasMethod(manager, 'handleSuspensions')).toEqual(true);
    });
    it('should have a method called updateReferral', () => {
      expect(h.hasMethod(manager, 'updateReferral')).toEqual(true);
    });
    it('should have a method called suspendReferral', () => {
      expect(h.hasMethod(manager, 'suspendReferral')).toEqual(true);
    });
  });

  describe('init', () => {
    it('should call super.init()', () => {
      const spy = jest.spyOn(DBStreamRunner.prototype, 'init');
      manager.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleSuspensions', () => {
    const spy = jest.spyOn(manager, 'suspendReferral');
    beforeEach(() => {
      spy.mockClear();
    });
    it('should call suspendReferral if needs suspending', async () => {
      await manager.handleSuspensions();
      expect(spy).toHaveBeenCalled();
    });
    it('should NOT call suspendReferral if does NOT need suspending', async () => {
      const mgr = new ReferralSuspensionManager(MOCK_SUSPENDED_TO_SUSPENDED);
      const spy = jest.spyOn(mgr, 'suspendReferral');
      await mgr.handleSuspensions();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('needsSuspending', () => {
    it('should return false if prior suspended is undefined or null', () => {
      const mgr = new ReferralSuspensionManager(MOCK_SUSPENDED_INSERT);
      expect(mgr.needsSuspending).toEqual(false);
    });
    it('should return true currently suspended but prior was not', () => {
      expect(manager.needsSuspending).toEqual(true);
    });
    it('should return false if currently suspended and prior suspended', () => {
      const mgr = new ReferralSuspensionManager(MOCK_SUSPENDED_TO_SUSPENDED);
      expect(mgr.needsSuspending).toEqual(false);
    });
  });

  describe('suspendReferral', () => {
    it('should call updateReferral with the right arg', async () => {
      const update = {
        ...manager.currImage,
        eligible: 0,
        suspended: true,
        campaignActive: 'NO_CAMPAIGN',
        campaignActiveReferred: 0,
        campaignActiveEarned: 0,
        campaignActivePaid: 0,
        campaignActiveAddOn: 0,
        campaignActiveBonus: 0,
        campaignPrior: 'NO_CAMPAIGN',
        campaignPriorReferred: 0,
        campaignPriorEarned: 0,
        campaignPriorPaid: 0,
        campaignPriorAddOn: 0,
        campaignPriorBonus: 0,
        nextPaymentDate: 'SUSPENDED',
      };
      const spy = jest.spyOn(manager, 'updateReferral');
      await manager.suspendReferral();
      expect(spy).toHaveBeenCalledWith(update);
    });
  });

  describe('updateReferral', () => {
    it('should call updateReferral query', async () => {
      await manager.updateReferral({} as any);
      expect(mockedUpdate).toHaveBeenCalledWith({});
    });
  });
});
