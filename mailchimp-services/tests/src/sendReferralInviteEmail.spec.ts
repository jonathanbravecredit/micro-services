import { SendReferralInviteEmailRunner } from 'libs/utils/runners/sendReferralInviteEmail';

describe('sendReferralInvite Email', () => {
  let runner: SendReferralInviteEmailRunner;
  let event: { list: string[] };

  beforeAll(() => {
    event = { list: ['abc'] };
    runner = new SendReferralInviteEmailRunner(event);
  });

  it('should parse a list of strings from the event', () => {
    expect(runner.list).toHaveLength(1);
  });
});
