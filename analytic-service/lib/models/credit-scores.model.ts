import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'CreditScores' })
export class CreditScore {
  @PartitionKey()
  id!: string;
  @SortKey()
  scoreId!: number;
  bureauId!: string;
  score!: number;
  createdOn?: string;
  modifiedOn?: string;
  source?: string;
}

export class CreditScoreMaker implements CreditScore {
  id: string;
  scoreId: number;
  score: number;
  bureauId: string;
  createdOn?: string | undefined;
  modifiedOn?: string | undefined;
  source?: string | undefined;

  constructor(id: string, scoreId: number, bureauId: string, score: number, source: string) {
    this.id = id;
    this.scoreId = scoreId;
    this.bureauId = bureauId;
    this.score = score;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
    this.source = source;
  }
}
