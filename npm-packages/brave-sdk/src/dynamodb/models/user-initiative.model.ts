import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { ProgramPrimaryTask, ProgramReasons } from '../classes/initiative/program';
import { InitiativeStatus, InitiativeTask } from '../classes/initiative/initiative';

@Model({ tableName: 'InitiativePrograms' })
export class UserInitiative {
  @PartitionKey()
  id!: string;

  @SortKey()
  program!: string;

  initiative!: string;

  // these are speific to user initiatives
  initiativeReason?: string | undefined;

  initiativeStatus?: InitiativeStatus | undefined;

  initiativeTitle?: string | undefined;

  initiativeTasks?: InitiativeTask[] | undefined;

  // these are for the program record only
  programReasons?: ProgramReasons[] | undefined;

  programTasks?: ProgramPrimaryTask[] | undefined;

  createdOn: string | null = null;

  modifiedOn: string | null = null;
}
