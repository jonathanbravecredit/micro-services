import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { ProgramPrimaryTask, ProgramReasons } from 'libs/classes/Program';
import { InitiativeStatus, InitiativeTask } from 'libs/classes/Initiative';

// add credit report data model
@Model({ tableName: 'InitiativePrograms' })
export class UserInitiative {
  @PartitionKey()
  id: string;

  @SortKey()
  program: string;

  initiative!: string;

  // these are speific to user initiatives
  initiativeReason?: string | undefined;

  initiativeStatus?: InitiativeStatus | undefined;

  initiativeTitle?: string | undefined;

  initiativeTasks?: InitiativeTask[] | undefined;

  // these are for the program record only
  programReasons?: ProgramReasons[] | undefined;

  programTasks?: ProgramPrimaryTask[] | undefined;

  createdOn: string | null;

  modifiedOn: string | null;
}
