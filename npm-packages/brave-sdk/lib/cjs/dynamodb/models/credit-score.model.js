"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScoreMaker = exports.CreditScore = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
let CreditScore = class CreditScore {
};
__decorate([
    (0, dynamo_easy_1.PartitionKey)(),
    __metadata("design:type", String)
], CreditScore.prototype, "id", void 0);
__decorate([
    (0, dynamo_easy_1.SortKey)(),
    __metadata("design:type", Number)
], CreditScore.prototype, "scoreId", void 0);
CreditScore = __decorate([
    (0, dynamo_easy_1.Model)({ tableName: 'CreditScores' })
], CreditScore);
exports.CreditScore = CreditScore;
class CreditScoreMaker {
    constructor(id, scoreId, bureauId, score) {
        this.id = id;
        this.scoreId = scoreId;
        this.bureauId = bureauId;
        this.score = score;
        this.createdOn = new Date().toISOString();
        this.modifiedOn = new Date().toISOString();
    }
}
exports.CreditScoreMaker = CreditScoreMaker;
