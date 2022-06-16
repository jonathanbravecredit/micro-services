import {
  ReferralQueries,
  CampaignQueries,
  SessionQueries,
} from "@bravecredit/brave-sdk";
import { ReferralActivationManager } from "libs/utils/managers/referralActivationManager";
import { Helper } from "tests/helpers/test-helper";
import { mocked } from "ts-jest/utils";

jest.mock("libs/queries/campaigns/campaigns.queries");
jest.mock("libs/queries/referrals/referral.queries");
jest.mock("libs/queries/sessions/sessions.queries");

describe("ReferralActivationManager", () => {
  const manager = new ReferralActivationManager(
    { Sns: { Message: null } } as any,
    "" as any
  );
  const h = new Helper<ReferralActivationManager>(manager);
  const mockedGetCamp = mocked(CampaignQueries.getCampaign);
  const mockedGetRef = mocked(ReferralQueries.getReferral);
  const mockedCreateRef = mocked(ReferralQueries.createReferral);
  const mockedUpdateEnroll = mocked(ReferralQueries.updateEnrollment);
  const mockedUpdateRefCamp = mocked(ReferralQueries.updateReferralCampaign);
  const mockedUpdateRefElig = mocked(ReferralQueries.updateReferralEligibility);
  const mockedListSessions = mocked(SessionQueries.listUserSessions);

  describe("Property and methods", () => {
    it("should have a property called campaign", () => {
      expect(h.hasProperty(manager, "campaign")).toEqual(true);
    });
    it("should have a property called campaignNone", () => {
      expect(h.hasProperty(manager, "campaignNone")).toEqual(true);
    });
    it("should have a property called referral", () => {
      expect(h.hasProperty(manager, "referral")).toEqual(true);
    });
    it("should have a property called sessions", () => {
      expect(h.hasProperty(manager, "sessions")).toEqual(true);
    });
    it("should have a property called sessionMessage", () => {
      expect(h.hasProperty(manager, "sessionMessage")).toEqual(true);
    });
    it("should have a property called applicationMessage", () => {
      expect(h.hasProperty(manager, "applicationMessage")).toEqual(true);
    });
    it("should have a method called init", () => {
      expect(h.hasMethod(manager, "init")).toEqual(true);
    });
    it("should have a property called initSessionData", () => {
      expect(h.hasMethod(manager, "initSessionData")).toEqual(true);
    });
    it("should have a property called initApplicationData", () => {
      expect(h.hasMethod(manager, "initApplicationData")).toEqual(true);
    });
    it("should have a property called check", () => {
      expect(h.hasMethod(manager, "check")).toEqual(true);
    });
    it("should have a property called checkSessionData", () => {
      expect(h.hasMethod(manager, "checkSessionData")).toEqual(true);
    });
    it("should have a property called checkApplicationData", () => {
      expect(h.hasMethod(manager, "checkApplicationData")).toEqual(true);
    });
    it("should have a method called getReferral", () => {
      expect(h.hasMethod(manager, "getReferral")).toEqual(true);
    });
    it("should have a method called createReferral", () => {
      expect(h.hasMethod(manager, "createReferral")).toEqual(true);
    });
    it("should have a method called getCampaign", () => {
      expect(h.hasMethod(manager, "getCampaign")).toEqual(true);
    });
    it("should have a method called updateReferralCampaign", () => {
      expect(h.hasMethod(manager, "updateReferralCampaign")).toEqual(true);
    });
    it("should have a method called updateReferralEligibility", () => {
      expect(h.hasMethod(manager, "updateReferralEligibility")).toEqual(true);
    });
    it("should have a method called updateEnrollment", () => {
      expect(h.hasMethod(manager, "updateEnrollment")).toEqual(true);
    });
    it("should have a method called listSessions", () => {
      expect(h.hasMethod(manager, "listSessions")).toEqual(true);
    });
    it("should have a method called eligibleCheckOne", () => {
      expect(h.hasMethod(manager, "eligibleCheckOne")).toEqual(true);
    });
    it("should have a method called eligibleCheckTwo", () => {
      expect(h.hasMethod(manager, "eligibleCheckTwo")).toEqual(true);
    });
    it("should have a method called eligibleCheckThree", () => {
      expect(h.hasMethod(manager, "eligibleCheckThree")).toEqual(true);
    });
    it("should have a method called activateOnSessionData", () => {
      expect(h.hasMethod(manager, "activateOnSessionData")).toEqual(true);
    });
    it("should have a method called activateOnApplicationData", () => {
      expect(h.hasMethod(manager, "activateOnApplicationData")).toEqual(true);
    });
  });

  describe("init", () => {
    it('should call initSessionData if subject = "sessiondataupdate"', async () => {
      const mgr = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "sessiondataupdate"
      );
      const spy = jest.spyOn(mgr, "initSessionData");
      await mgr.init();
      expect(spy).toHaveBeenCalled();
    });
    it('should NOT call initApplicationData if subject = "sessiondataupdate"', async () => {
      const mgr = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "sessiondataupdate"
      );
      const spy = jest.spyOn(mgr, "initApplicationData");
      await mgr.init();
      expect(spy).not.toHaveBeenCalled();
    });
    it('should call initApplicationData if subject = "transunionenrollment"', async () => {
      const mgr = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "transunionenrollment"
      );
      const spy = jest.spyOn(mgr, "initApplicationData");
      await mgr.init();
      expect(spy).toHaveBeenCalled();
    });
    it('should NOT call initSessionData if subject = "transunionenrollment"', async () => {
      const mgr = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "transunionenrollment"
      );
      const spy = jest.spyOn(mgr, "initSessionData");
      await mgr.init();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("initSessionData", () => {
    it("should NOT call getReferral, listSessions, getCampaign if Message, message, or userId is falsey", async () => {
      const spy = jest.spyOn(console, "error");
      const mgr1 = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "sessiondataupdate"
      );
      const mgr2 = new ReferralActivationManager(
        { Sns: { Message: '{ "message": null }' } } as any,
        "sessiondataupdate"
      );
      const mgr3 = new ReferralActivationManager(
        { Sns: { Message: '{ "message": { "userId": null } }' } } as any,
        "sessiondataupdate"
      );
      await mgr1.init();
      await mgr2.init();
      await mgr3.init();
      expect(spy).toHaveBeenCalledTimes(3);
      spy.mockClear();
    });
    it("should call getReferral, listSessions, getCampaign if Message, message, and userId are truthy", async () => {
      const mock = {
        Sns: { Message: '{ "message": { "userId": "abc" } }' },
      } as any;
      const mgr = new ReferralActivationManager(mock, "sessiondataupdate");
      const spy1 = jest.spyOn(mgr, "getReferral");
      const spy2 = jest.spyOn(mgr, "listSessions");
      const spy3 = jest.spyOn(mgr, "getCampaign");
      await mgr.init();
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(2);
      spy1.mockClear();
      spy2.mockClear();
      spy3.mockClear();
    });
  });

  describe("initApplicationData", () => {
    it("should NOT call getReferrl if Message, message, or id is falsey", async () => {
      const spy = jest.spyOn(console, "error");
      const mgr1 = new ReferralActivationManager(
        { Sns: { Message: null } } as any,
        "transunionenrollment"
      );
      const mgr2 = new ReferralActivationManager(
        { Sns: { Message: '{ "message": null }' } } as any,
        "transunionenrollment"
      );
      const mgr3 = new ReferralActivationManager(
        { Sns: { Message: '{ "message": { "id": null } }' } } as any,
        "transunionenrollment"
      );
      await mgr1.init();
      await mgr2.init();
      await mgr3.init();
      expect(spy).toHaveBeenCalledTimes(3);
      spy.mockClear();
    });
    it("should call getReferral if Message, message, and userId are truthy", async () => {
      const mock = {
        Sns: { Message: '{ "message": { "id": "abc" } }' },
      } as any;
      const mgr = new ReferralActivationManager(mock, "transunionenrollment");
      const spy1 = jest.spyOn(mgr, "getReferral");
      await mgr.init();
      expect(spy1).toHaveBeenCalledTimes(1);
      spy1.mockClear();
    });
  });

  describe("check method", () => {
    describe("sessiondataupdate path", () => {
      let mock: any;
      let mgr: any;
      beforeEach(() => {
        mock = {
          Sns: { Message: '{ "message": { "userId": "abc" } }' },
        } as any;
        mgr = new ReferralActivationManager(mock, "sessiondataupdate");
      });
      it("should call checkSessionData if id set", async () => {
        const spy = jest
          .spyOn(mgr, "checkSessionData")
          .mockReturnValueOnce(false);
        await mgr.init();
        await mgr.check();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
      });
      it("should call activateOnSessionData if id set and checkSessionData is true", async () => {
        jest.spyOn(mgr, "checkSessionData").mockReturnValueOnce(true);
        const spy = jest.spyOn(mgr, "activateOnSessionData");
        await mgr.init();
        await mgr.check();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
      });
      it("should NOT call checkApplicationData", async () => {
        jest.spyOn(mgr, "listSessions").mockReturnValueOnce([]);
        const spy = jest.spyOn(mgr, "checkApplicationData");
        await mgr.init();
        await mgr.check();
        expect(spy).not.toHaveBeenCalled();
        spy.mockReset();
      });
    });
  });

  describe("check method", () => {
    describe("transunionenrollment path", () => {
      let mock: any;
      let mgr: any;
      beforeEach(() => {
        mock = { Sns: { Message: '{ "message": { "id": "abc" } }' } } as any;
        mgr = new ReferralActivationManager(mock, "transunionenrollment");
      });
      it("should call checkApplicationData if id set", async () => {
        const spy = jest
          .spyOn(mgr, "checkApplicationData")
          .mockReturnValueOnce(false);
        await mgr.init();
        await mgr.check();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
      });
      it("should call activateOnApplicationData if id set and checkApplicationData is true", async () => {
        jest.spyOn(mgr, "checkApplicationData").mockReturnValueOnce(true);
        const spy = jest.spyOn(mgr, "activateOnApplicationData");
        await mgr.init();
        await mgr.check();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
      });
      it("should NOT call checkSessionData", async () => {
        const spy = jest.spyOn(mgr, "checkSessionData");
        await mgr.init();
        await mgr.check();
        expect(spy).not.toHaveBeenCalled();
        spy.mockReset();
      });
    });
  });

  describe("getReferral", () => {
    it("should call getReferral", async () => {
      await manager.getReferral("" as any);
      expect(mockedGetRef).toHaveBeenCalled();
    });
  });
  describe("createReferral", () => {
    it("should call createReferral", async () => {
      await manager.createReferral("" as any);
      expect(mockedCreateRef).toHaveBeenCalled();
    });
  });
  describe("getCampaign", () => {
    it("should call getCampaign", async () => {
      const arg = {} as any;
      await manager.getCampaign(arg, arg);
      expect(mockedGetCamp).toHaveBeenCalled();
    });
  });
  describe("updateReferralCampaign", () => {
    it("should call updateReferralCampaign", async () => {
      const arg = {} as any;
      await manager.updateReferralCampaign(arg, arg);
      expect(mockedUpdateRefCamp).toHaveBeenCalled();
    });
  });
  describe("updateReferralEligibility", () => {
    it("should call updateReferralEligibility", async () => {
      const arg = {} as any;
      await manager.updateReferralEligibility(arg);
      expect(mockedUpdateRefElig).toHaveBeenCalled();
    });
  });
  describe("updateEnrollment", () => {
    it("should call updateEnrollment", async () => {
      const arg = {} as any;
      await manager.updateEnrollment(arg);
      expect(mockedUpdateEnroll).toHaveBeenCalled();
    });
  });
  describe("listSessions", () => {
    it("should call listUserSessions", async () => {
      const arg = {} as any;
      await manager.listSessions(arg, 0);
      expect(mockedListSessions).toHaveBeenCalled();
    });
  });
});
