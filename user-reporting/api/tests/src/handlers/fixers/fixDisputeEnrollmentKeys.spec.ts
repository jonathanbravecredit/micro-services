import { FIX_DISPUTE_MOCK } from '../../../../libs/mocks/fixDisputeEnrollmentKeyMock';
import { FixDisputeEnrollmentKeyRunner } from '../../../../libs/runners/fixDisputeEnrollmentKeyRunner';
import { FixDisputeEnrollmentKeyEvent } from '../../../../src/handlers/fixers/fixDisputeEnrollmentKeys';
import { updateDisputeKeys } from '../../../../libs/db/appdata';

jest.mock('../../../../libs/db/appdata', () => ({
  updateDisputeKeys: jest.fn(() => {}),
}));

describe('Fix Dispute Enrollment Keys', () => {
  let runner: FixDisputeEnrollmentKeyRunner;
  let event: FixDisputeEnrollmentKeyEvent;
  beforeAll(() => {
    event = { list: FIX_DISPUTE_MOCK };
    runner = new FixDisputeEnrollmentKeyRunner(event);
  });

  describe('Class properties', () => {
    it('should set the property "list" on construction', () => {
      expect(runner.list).toHaveLength(1);
    });

    it('should have a method called "run"', () => {
      expect(runner.run).toBeInstanceOf(Function);
    });

    it('should have a method called "update"', () => {
      expect(runner.update).toBeInstanceOf(Function);
    });
  });
});
