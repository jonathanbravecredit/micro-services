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
exports.AnalyticMaker = exports.Analytic = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
let Analytic = class Analytic {
};
__decorate([
    (0, dynamo_easy_1.PartitionKey)(),
    __metadata("design:type", String)
], Analytic.prototype, "id", void 0);
__decorate([
    (0, dynamo_easy_1.SortKey)(),
    __metadata("design:type", String)
], Analytic.prototype, "event", void 0);
Analytic = __decorate([
    (0, dynamo_easy_1.Model)({ tableName: 'Analytics' })
], Analytic);
exports.Analytic = Analytic;
class AnalyticMaker {
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
exports.AnalyticMaker = AnalyticMaker;
