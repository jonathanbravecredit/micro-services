import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'CreditScores' })
export class CreditScore {
  @PartitionKey()
  id!: string;
  @SortKey()
  scoreId!: number;
  score!: number;
  createdOn?: string;
  modifiedOn?: string;
}

export class CreditScoreMaker implements CreditScore {
  id: string;
  scoreId: number;
  score: number;
  createdOn?: string | undefined;
  modifiedOn?: string | undefined;

  constructor(id: string, scoreId: number, score: number) {
    this.id = id;
    this.scoreId = scoreId;
    this.score = score;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
