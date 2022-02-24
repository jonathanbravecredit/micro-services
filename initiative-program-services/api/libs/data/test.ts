// export type InitiativeStatus = 'not_started' | 'in_progress' | 'complete';
// export class InitiativeProgram {
//   constructor(
//     protected id: string,
//     protected reasons: InitiativeProgramReasons[],
//     protected primaryTasks: InitiativePrimaryTask[],
//   ) {}
// }

// export class InitiativeProgramReasons {
//   constructor(protected reason: string, protected description: string) {}
// }

// export class InitiativePrimaryTask {
//   protected taskStatus: InitiativeStatus = 'not_started';
//   constructor(
//     protected parentId: string,
//     protected taskId: string,
//     protected taskOrder: number,
//     protected taskLabel: string,
//     protected taskCard: InitiativeTaskCard,
//     protected subTasks: InitiativeSubTask[],
//   ) {}
// }

// export class InitiativeSubTask extends InitiativePrimaryTask {
//   protected taskStatus: InitiativeStatus = 'not_started';
//   constructor(
//     protected parentId: string,
//     protected taskId: string,
//     protected taskOrder: number,
//     protected taskLabel: string,
//     protected taskCard: InitiativeExtendedTaskCard,
//     protected subTasks: InitiativeSubTask[],
//   ) {
//     super(parentId, taskId, taskOrder, taskLabel, taskCard, subTasks);
//   }
// }

// export class InitiativeTaskCard {
//   constructor(protected header: string, protected textOne: string) {}
// }

// export class InitiativeExtendedTaskCard extends InitiativeTaskCard {
//   constructor(
//     protected header: string,
//     protected textOne: string,
//     protected textTwo: string | null,
//     protected textButton: string | null,
//     protected metric: string,
//     protected successHeader: string,
//     protected successText: string,
//     protected questionHeader: string,
//     protected link: string | null,
//   ) {
//     super(header, textOne);
//   }
// }

// // need two reasons
// const reasons = [
//   new InitiativeProgramReasons('credit_card', 'Your plan to get a credit card'),
//   new InitiativeProgramReasons('buy_house', 'Your plan to buy a house'),
// ];

// // set up the primary task for credit_card -> with unique sub tasks
// // set up the primary task for buy house -> with unique sub tasks
// // need two subtasks

// const subtask0Card = new InitiativeExtendedTaskCard(
//   'Review your credit report',
//   "You could gain an average of 19 points on your score if there's an error on your report, or even up to 130*.",
//   "Look for accounts or personal information you don't recognize. Find an issue? Dispute it in our app to request it be removed which could help your score.",
//   'Review my report',
//   '+19',
//   'Greate job reviewing your credit report',
//   'Checking it on a monthly basis ensures the information on your reports remains yours',
//   'Do you have at least $9,450 saved?',
//   null,
// );
// const subtask1Card = new InitiativeExtendedTaskCard(
//   'Claim Your FutureScore to get your dream credit card',
//   'Opening this account can help you grow score 53 points or more! It can also automatically unlock a secured credit card, to reach an unsecured card quicker.',
//   'With on-time payments, you can grow your score and also build up a nice savings account!',
//   'Open my account',
//   '+53',
//   'Good work opening the account!',
//   'Make on-time payments on this and your other accounts to get the full benefit',
//   'Do you have at least $9,450 saved?',
//   null,
// );

// const subtask2Card = new InitiativeExtendedTaskCard('abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', null);

// const subtask3Card = new InitiativeExtendedTaskCard('123', '456', '789', '101', '112', '131', '415', '161', null);

// const subtask4Card = new InitiativeExtendedTaskCard(
//   'abc123',
//   'def456',
//   'ghi789',
//   'jkl101',
//   'mno112',
//   'pqr131',
//   'stu415',
//   'vwx161',
//   null,
// );

// const subtask5Card = new InitiativeExtendedTaskCard(
//   '123vwx',
//   '456stu',
//   '789pqr',
//   '101mno',
//   '112jkl',
//   '131ghi',
//   '415def',
//   '161abc',
//   null,
// );

// const ccSubTasks = [
//   new InitiativeSubTask('credit_card', 'review_report', 0, 'Review your report', subtask0Card, []),
//   new InitiativeSubTask('credit_card', 'claim_future_score', 1, 'Claim your FutureScore', subtask1Card, []),
// ];

// const houseSubTasks = [
//   new InitiativeSubTask('buy_house', 'subtask_0', 0, 'Subtask 0 label', subtask2Card, []),
//   new InitiativeSubTask('buy_house', 'subtask_1', 1, 'Subtask 1 label', subtask3Card, []),
//   new InitiativeSubTask('buy_house', 'subtask_2', 2, 'Subtask 2 label', subtask4Card, []),
//   new InitiativeSubTask('buy_house', 'subtask_3', 3, 'Subtask 3 label', subtask5Card, []),
// ];

// const primaryTask1Card = new InitiativeTaskCard(
//   "Let's help you get a credit card!",
//   "We've made it easy for you to reach your goal and claim your FutureScore. Follow these steps, and with healthy financial habits, you could get your credit card in not time!",
// );

// const primaryTask2Card = new InitiativeTaskCard(
//   "Let's help you buy a house!",
//   "We've made it easy for you to reach your goal and claim your FutureScore. Follow these steps, and with healthy financial habits, you could own a home in no time!",
// );

// const primaryTasks = [
//   new InitiativePrimaryTask('future_score', 'credit_card', 0, 'Obtained Credit Card', primaryTask1Card, ccSubTasks),
//   new InitiativePrimaryTask('future_score', 'buy_house', 1, 'Bought a House', primaryTask2Card, houseSubTasks),
// ];

// const program = new InitiativeProgram('0', reasons, primaryTasks);
// console.log(program);
// console.log(JSON.stringify(program));
