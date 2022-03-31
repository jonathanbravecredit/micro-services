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
let CreditScore = class CreditScore {
};
__decorate([
    PartitionKey(),
    __metadata("design:type", String)
], CreditScore.prototype, "id", void 0);
__decorate([
    SortKey(),
    __metadata("design:type", Number)
], CreditScore.prototype, "scoreId", void 0);
CreditScore = __decorate([
    Model({ tableName: 'CreditScores' })
], CreditScore);
export { CreditScore };
export class CreditScoreMaker {
    constructor(id, scoreId, bureauId, score) {
        this.id = id;
        this.scoreId = scoreId;
        this.bureauId = bureauId;
        this.score = score;
        this.createdOn = new Date().toISOString();
        this.modifiedOn = new Date().toISOString();
    }
}
