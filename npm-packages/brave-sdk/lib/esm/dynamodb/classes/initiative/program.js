import { InitiativeTask } from './initiative';
export class Program {
    constructor(id, program, initiative, programReasons, programTasks) {
        this.id = id;
        this.program = program;
        this.initiative = initiative;
        this.programReasons = programReasons;
        this.programTasks = programTasks;
        this.createdOn = null;
        this.modifiedOn = null;
    }
}
export class ProgramReasons {
    constructor(reason, description) {
        this.reason = reason;
        this.description = description;
    }
}
export class ProgramPrimaryTask extends InitiativeTask {
    constructor(parentId, taskId, taskOrder, taskLabel, taskCard, subTasks) {
        super(parentId, taskId, taskOrder, subTasks);
        this.parentId = parentId;
        this.taskId = taskId;
        this.taskOrder = taskOrder;
        this.taskLabel = taskLabel;
        this.taskCard = taskCard;
        this.subTasks = subTasks;
        this.taskStatus = 'not_started';
    }
}
export class ProgramSubTask extends ProgramPrimaryTask {
    constructor(parentId, taskId, taskOrder, taskLabel, taskCard, subTasks) {
        super(parentId, taskId, taskOrder, taskLabel, taskCard, subTasks);
        this.parentId = parentId;
        this.taskId = taskId;
        this.taskOrder = taskOrder;
        this.taskLabel = taskLabel;
        this.taskCard = taskCard;
        this.subTasks = subTasks;
        this.taskStatus = 'not_started';
    }
}
export class TaskCard {
    constructor(header, textOne) {
        this.header = header;
        this.textOne = textOne;
    }
}
export class ExtendedTaskCard extends TaskCard {
    constructor(header, textOne, textTwo, textButton, metric, successHeader, successText, questionHeader, link) {
        super(header, textOne);
        this.header = header;
        this.textOne = textOne;
        this.textTwo = textTwo;
        this.textButton = textButton;
        this.metric = metric;
        this.successHeader = successHeader;
        this.successText = successText;
        this.questionHeader = questionHeader;
        this.link = link;
    }
}
