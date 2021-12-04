import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Analytics' })
export class Analytics {
  @PartitionKey()
  id!: string;
  @SortKey()
  event!: string;
  sub!: string | null;
  session!: string;
  source!: string;
  value?: number;
  createdOn?: string;
  modifiedOn?: string;
}

export class AnalyticsMaker implements Analytics {
  id: string;
  event: string;
  sub: string | null;
  session: string;
  source: string;
  value: number;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(id: string, event: string, sub: string | null, session: string, source: string, value: number = 1) {
    this.id = id;
    this.event = event;
    this.sub = sub;
    this.session = session;
    this.source = source;
    this.value = value;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
