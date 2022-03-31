"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiativeTask = exports.InitiativeMaker = exports.Initiative = void 0;
class Initiative {
    constructor(id, program, initiative, initiativeStatus, initiativeReason, initiativeTitle, initiativeTasks, createdOn, modifiedOn) {
        this.id = id;
        this.program = program;
        this.initiative = initiative;
        this.initiativeStatus = initiativeStatus;
        this.initiativeReason = initiativeReason;
        this.initiativeTitle = initiativeTitle;
        this.initiativeTasks = initiativeTasks;
        this.createdOn = createdOn;
        this.modifiedOn = modifiedOn;
        this.programTasks = [];
        this.programContext = [];
    }
    addProgramTasks(program) {
        this.programTasks = program.programTasks;
        return this;
    }
    filterProgramTasks() {
        this.programTasks = this.programTasks.filter((t) => t.taskId === this.initiativeReason);
        return this;
    }
    getOnlyContext(tasks) {
        if (!tasks || !tasks.length)
            return [];
        return tasks.map((task) => {
            return Object.assign(Object.assign({}, this.mapFields(task)), { subTasks: this.getOnlyContext(task.subTasks) });
        });
    }
    enrichWithContext() {
        // get the context from the program tasks
        const tasks = this.programTasks;
        this.programContext = this.getOnlyContext(tasks);
        console.log('enrich tasks: ', JSON.stringify(tasks));
        console.log('enrich initiativeTasks: ', JSON.stringify(this.initiativeTasks));
        console.log('enrich this.programContext: ', JSON.stringify(this.programContext));
        for (let i = 0; i < this.initiativeTasks.length; i++) {
            this.initiativeTasks[i] = Object.assign(Object.assign({}, this.programContext[i]), this.initiativeTasks[i]);
            for (let j = 0; j < this.initiativeTasks[i].subTasks.length; j++) {
                this.initiativeTasks[i].subTasks[j] = Object.assign(Object.assign({}, this.programContext[i].subTasks[j]), this.initiativeTasks[i].subTasks[j]);
            }
        }
        console.log('enrich this.initiativeTasks: ', JSON.stringify(this.initiativeTasks));
    }
    mapFields(task) {
        const { taskLabel, taskCard } = task;
        return {
            taskLabel,
            taskCard,
        };
    }
}
exports.Initiative = Initiative;
class InitiativeMaker {
    constructor(id, programId, initiative, initiativeReason, program) {
        this.id = id;
        this.programId = programId;
        this.initiative = initiative;
        this.initiativeReason = initiativeReason;
        this.program = program;
        const tasks = this.program.programTasks.filter((task) => {
            return task.taskId === this.initiativeReason;
        });
        const now = new Date().toISOString();
        this.output = new Initiative(id, programId, initiative, 'not_started', this.getReason(initiativeReason).reason, this.getReason(initiativeReason).description, this.getProgramTasks(tasks), now, now);
    }
    // ensure there is a valid matching reason...what to do if there isn't?
    getReason(reason) {
        const match = this.program.programReasons.find((r) => {
            return r.reason === reason;
        });
        if (!match)
            throw 'No matching reason found';
        return match;
    }
    getProgramTasks(tasks) {
        if (!tasks || !tasks.length)
            return [];
        return tasks.map((task) => {
            return Object.assign(Object.assign({}, this.mapFields(task)), { subTasks: this.getProgramTasks(task.subTasks) });
        });
    }
    filterProgramTasks(task) {
        return task.parentId === this.initiative;
    }
    mapFields(task) {
        const { parentId, taskId, taskOrder, taskStatus, subTasks } = task;
        return {
            parentId,
            taskId,
            taskOrder,
            taskStatus,
            subTasks,
        };
    }
}
exports.InitiativeMaker = InitiativeMaker;
class InitiativeTask {
    constructor(parentId, taskId, taskOrder, subTasks) {
        this.parentId = parentId;
        this.taskId = taskId;
        this.taskOrder = taskOrder;
        this.subTasks = subTasks;
        this.taskStatus = 'not_started';
    }
}
exports.InitiativeTask = InitiativeTask;
