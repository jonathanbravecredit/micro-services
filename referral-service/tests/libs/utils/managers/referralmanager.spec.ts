import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';
import { ReferralManager } from 'libs/utils/managers/referralManager';
import { Helper } from 'tests/helpers/test-helper';
import {
  MOCK_ACTIVE_TO_SUSPENDED,
  MOCK_SUSPENDED_INSERT,
  MOCK_SUSPENDED_TO_SUSPENDED,
} from 'tests/__mocks__/referral.mocks';

describe('ReferralManager', () => {
  let manager = new ReferralManager(MOCK_ACTIVE_TO_SUSPENDED);
  let h = new Helper<ReferralManager>(manager);
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
    it('should have a getter called needsSuspending', () => {
      expect(manager.needsSuspending).not.toBeUndefined();
    });
    it('should have a method called init', () => {
      expect(h.hasMethod(manager, 'init')).toEqual(true);
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

  describe('needsSuspending', () => {
    it('should return false if prior suspended is undefined or null', () => {
      const mgr = new ReferralManager(MOCK_SUSPENDED_INSERT);
      expect(mgr.needsSuspending).toEqual(false);
    });
    it('should return true currently suspended but prior was not', () => {
      expect(manager.needsSuspending).toEqual(true);
    });
    it('should return false if currently suspended and prior suspended', () => {
      const mgr = new ReferralManager(MOCK_SUSPENDED_TO_SUSPENDED);
      expect(mgr.needsSuspending).toEqual(false);
    });
  });
});
