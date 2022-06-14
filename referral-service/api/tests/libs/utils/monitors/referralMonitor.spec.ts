import { SNSEventRecord } from "aws-lambda";
import { CampaignQueries } from "@bravecredit/brave-sdk";
import { ReferralActivationManager } from "libs/utils/managers/referralActivationManager";
import { ReferralAggregationManager } from "libs/utils/managers/referralAggregationManager";
import { ReferralSuspensionManager } from "libs/utils/managers/referralSuspensionManager";
import { ReferralMonitor } from "libs/utils/monitors/referralMonitor";
import { Helper } from "tests/helpers/test-helper";
import { MOCK_CAMPAIGN_ACTIVE } from "tests/__mocks__/campaign.mocks";
import { mocked } from "ts-jest/utils";

jest.mock("libs/utils/managers/referralSuspensionManager");
jest.mock("libs/utils/managers/referralAggregationManager");
jest.mock("libs/utils/managers/referralActivationManager");
jest.mock("libs/queries/campaigns/campaigns.queries");
describe("ReferralMonitor", () => {
  let monitor = new ReferralMonitor([] as any);
  let h = new Helper<ReferralMonitor>(monitor);
  const mockedSusMgr = mocked(ReferralSuspensionManager);
  const mockedAggMgr = mocked(ReferralAggregationManager);
  const mockedActMgr = mocked(ReferralActivationManager);
  const mockedGet = mocked(CampaignQueries.getCampaign);
  beforeAll(async () => {
    await monitor.init();
  });
  describe("Properties and methods", () => {
    it("should have a property called campaign", () => {
      expect(h.hasProperty(monitor, "campaign")).toEqual(true);
    });
    it("should have a property called snsRecords", () => {
      expect(h.hasProperty(monitor, "snsRecords")).toEqual(true);
    });
    it("should have a property called dynamoRecords", () => {
      expect(h.hasProperty(monitor, "dynamoRecords")).toEqual(true);
    });
    it("should have a method called init", () => {
      expect(h.hasMethod(monitor, "init")).toEqual(true);
    });
    it("should have a method called segmentRecords", () => {
      expect(h.hasMethod(monitor, "segmentRecords")).toEqual(true);
    });
    it("should have a method called monitor", () => {
      expect(h.hasMethod(monitor, "monitor")).toEqual(true);
    });
    it("should have a method called monitorDynamo", () => {
      expect(h.hasMethod(monitor, "monitorDynamo")).toEqual(true);
    });
    it("should have a method called monitorSns", () => {
      expect(h.hasMethod(monitor, "monitorSns")).toEqual(true);
    });
    it("should have a method called checkSuspensions", () => {
      expect(h.hasMethod(monitor, "checkSuspensions")).toEqual(true);
    });
    it("should have a method called checkAggregations", () => {
      expect(h.hasMethod(monitor, "checkAggregations")).toEqual(true);
    });
    it("should have a method called checkActivations", () => {
      expect(h.hasMethod(monitor, "checkActivations")).toEqual(true);
    });
    it("should have a method called getCampaign", () => {
      expect(h.hasMethod(monitor, "getCampaign")).toEqual(true);
    });
  });

  describe("init", () => {
    it("should should call getCampaign", async () => {
      const spy = jest.spyOn(monitor, "getCampaign");
      await monitor.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("monitor", () => {
    it("should call monitorDynamo and monitorSns", async () => {
      const spyDb = jest
        .spyOn(monitor, "monitorDynamo")
        .mockReturnValueOnce(Promise.resolve());
      const spySns = jest
        .spyOn(monitor, "monitorSns")
        .mockReturnValueOnce(Promise.resolve());
      await monitor.monitor();
      expect(spyDb).toHaveBeenCalled();
      expect(spySns).toHaveBeenCalled();
    });
  });

  describe("monitorDynamo", () => {
    it("should NOT call checkSuspensions nor checkAggregations if no records", async () => {
      const spySus = jest.spyOn(monitor, "checkSuspensions");
      const spyAgg = jest.spyOn(monitor, "checkAggregations");
      await monitor.monitorDynamo();
      expect(spySus).not.toHaveBeenCalled();
      expect(spyAgg).not.toHaveBeenCalled();
    });
    it("should call checkSuspensions and checkAggregations 3 times", async () => {
      const mock = { eventSource: "aws:dynamodb" };
      const mon = new ReferralMonitor([mock, mock, mock] as any);
      await mon.init();
      const spySus = jest.spyOn(mon, "checkSuspensions");
      const spyAgg = jest.spyOn(mon, "checkAggregations");
      await mon.monitorDynamo();
      expect(spySus).toHaveBeenCalledTimes(3);
      expect(spyAgg).toHaveBeenCalledTimes(3);
    });
  });

  describe("monitorSns", () => {
    it("should NOT call checkActivations if no records", async () => {
      const spy = jest
        .spyOn(monitor, "checkActivations")
        .mockReturnValueOnce(Promise.resolve());
      await monitor.monitorSns();
      expect(spy).not.toHaveBeenCalled();
    });
    it("should call checkActivations", async () => {
      const mock = {
        EventSource: "aws:sns",
        Sns: {
          Subject: "sessiondataupdate",
          Message: '{ "service": "referralservice" }',
        },
      } as Partial<SNSEventRecord>;
      const mon = new ReferralMonitor([mock, mock, mock] as any);
      await mon.init();
      const spy = jest.spyOn(mon, "checkActivations");
      await mon.monitorSns();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe("checkSuspensions", () => {
    afterEach(() => {
      mockedSusMgr.mockReset();
    });
    it("should create a ReferralSuspensionManager instance", async () => {
      await monitor.checkSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it("should call the handleSuspensions method on ReferralSuspensionManager instance", async () => {
      await monitor.checkSuspensions({} as any);
      const mock = mockedSusMgr.mock.instances[0].handleSuspensions;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe("checkAggregations", () => {
    afterEach(() => {
      mockedAggMgr.mockReset();
    });
    it("should not create an instance of ReferralAggregationManager if campaign is falsey ", async () => {
      monitor.campaign = null;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).toBeUndefined();
    });
    it("should create a ReferralAggregationManager instance", async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0];
      expect(mock).not.toBeUndefined();
    });
    it("should call the quantifyReferral method on ReferralAggregationManager instance", async () => {
      monitor.campaign = MOCK_CAMPAIGN_ACTIVE;
      await monitor.checkAggregations({} as any);
      const mock = mockedAggMgr.mock.instances[0].quantifyReferral;
      expect(mock).toHaveBeenCalled();
    });
  });

  describe("checkActivations", () => {
    afterEach(() => {
      mockedActMgr.mockReset();
    });
    it("should create a ReferralActivationManager instance", async () => {
      const res = await monitor.checkActivations({
        Sns: { Subject: "sessiondataupdate" },
      } as any);
      const mock = mockedActMgr.mock.instances.length > 0;
      expect(mock).toEqual(true);
    });
    it('should NOT create a ReferralActivationManager instance if subject != "transunionenrollment" AND != "sessiondataupdate"', async () => {
      await monitor.checkActivations({ Sns: { Subject: "blahblah" } } as any);
      const mock = mockedActMgr.mock.instances[0];
      expect(mock).toBeUndefined();
    });
    it('should call the init and check methods on ReferralActivationManager instance if subject = "sessiondataupdate"', async () => {
      await monitor.checkActivations({
        Sns: { Subject: "sessiondataupdate" },
      } as any);
      const mock1 = mockedActMgr.mock.instances[0].init;
      const mock2 = mockedActMgr.mock.instances[0].check;
      expect(mock1).toHaveBeenCalled();
      expect(mock2).toHaveBeenCalled();
    });
    it('should call the init and check methods on ReferralActivationManager instance if subject = "transunionenrollment"', async () => {
      await monitor.checkActivations({
        Sns: { Subject: "transunionenrollment" },
      } as any);
      const mock1 = mockedActMgr.mock.instances[0].init;
      const mock2 = mockedActMgr.mock.instances[0].check;
      expect(mock1).toHaveBeenCalled();
      expect(mock2).toHaveBeenCalled();
    });
  });

  describe("getCampaign", () => {
    it("should call getCampaign", async () => {
      await monitor.getCampaign();
      expect(mockedGet).toHaveBeenCalled();
    });
  });
});
