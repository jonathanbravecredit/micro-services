var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'reflect-metadata';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
let Analytic = class Analytic {
};
__decorate([
    PartitionKey(),
    __metadata("design:type", String)
], Analytic.prototype, "id", void 0);
__decorate([
    SortKey(),
    __metadata("design:type", String)
], Analytic.prototype, "event", void 0);
Analytic = __decorate([
    Model({ tableName: 'Analytics' })
], Analytic);
export { Analytic };
export class AnalyticMaker {
    constructor(id, event, sub, session, source, value = 1) {
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
