export class SendReferralInviteEmailRunner {
  list: string[];
  constructor(event: unknown) {
    const { list } = event as unknown as { list: string[] };
    this.list = list;
  }

  run(): void {}
}
