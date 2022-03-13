import { updateDisputeKeys } from '../db/appdata';
import { FixDisputeEnrollmentKey, FixDisputeEnrollmentKeyEvent } from 'src/handlers/fixers/fixDisputeEnrollmentKeys';

export class FixDisputeEnrollmentKeyRunner {
  list: FixDisputeEnrollmentKey[];
  constructor(event: FixDisputeEnrollmentKeyEvent) {
    const { list } = event;
    this.list = list;
  }

  async run(): Promise<void> {
    await Promise.all(
      this.list.map(async (item) => {
        return await this.update(item);
      }),
    );
  }

  async update(item: FixDisputeEnrollmentKey): Promise<void> {
    await updateDisputeKeys(item.id, item);
  }
}
