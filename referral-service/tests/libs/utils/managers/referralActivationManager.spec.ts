import { ReferralActivationManager } from 'libs/utils/managers/referralActivationManager';
import { Helper } from 'tests/helpers/test-helper';

describe('ReferralActivationManager', () => {
  const manager = new ReferralActivationManager({} as any);
  const h = new Helper<ReferralActivationManager>(manager);
  describe('Property and methods', () => {
    it('should have a property called campaign', () => {
      expect(h.hasProperty(manager, 'campaign')).toEqual(true);
    });
    it('should have a property called campaignDefault', () => {
      expect(h.hasProperty(manager, 'campaignDefault')).toEqual(true);
    });
    it('should have a property called referral', () => {
      expect(h.hasProperty(manager, 'referral')).toEqual(true);
    });
  });
});
