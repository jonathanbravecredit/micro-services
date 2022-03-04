import 'reflect-metadata';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { getInitiative, updateInitiative } from 'libs/queries/user-initiative.queries';
import { ICreditReportMetrics } from 'libs/interfaces/credit-report-metrics.interface';
import { TasksUtil } from 'libs/utils/helpers/Tasks';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {
  // I am currently only concerned if they have a self loan...filter for these
  const loans = event.Records.map((r) => {
    return (JSON.parse(r.Sns.Message) as IBatchPayload<{ id: string; metrics: ICreditReportMetrics }>).message;
  }).filter((r) => r.metrics.haveSelfLoan);
  console.log('loans', JSON.stringify(loans));

  // find the program that has a self loan component to it, and then add it
  // get the program the person is enrolled in.
  // iterate through the primary task and subtasks and find 'open_self_loan'
  //   - if present mark this as complete and then update
  //   - to mark complete you'll need the:
  //    1. initiative tasks
  //    2. parentId
  //    3/ taskId
  //    4/ taskStatus
  try {
    await Promise.all(
      loans.map(async (l) => {
        const { id } = l;
        console.log('id', id);
        const initiative = await getInitiative(id, '1');
        const { initiativeTasks: primary } = initiative;
        const selfTask = TasksUtil.findTaskByTaskId(primary, 'open_self_loan');
        if (!selfTask) {
          console.log('no self loan found');
          return;
        }
        const { parentId, taskId } = selfTask;
        const taskStatus = 'complete';
        console.log('parentId', parentId);
        console.log('taskId', taskId);
        console.log('taskStatus', taskStatus);
        // update the subtask initiatives and status
        const updatedTasks = TasksUtil.mapTaskStatus(initiative.initiativeTasks, parentId, taskId, taskStatus);
        const updatedStatus = TasksUtil.getInitiativeStatus(updatedTasks);
        // save the results
        await updateInitiative({
          ...initiative,
          initiativeTasks: updatedTasks,
          initiativeStatus: updatedStatus,
        });
      }),
    );
  } catch (err) {
    console.log('error in metrics: ', err);
  }
};
