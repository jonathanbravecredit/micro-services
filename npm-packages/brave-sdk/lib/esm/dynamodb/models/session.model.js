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
import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
export const USERID_SESSIONDATE_INDEX = 'userIdSessionDate-index';
let Session = class Session {
};
__decorate([
    GSIPartitionKey(USERID_SESSIONDATE_INDEX),
    PartitionKey(),
    __metadata("design:type", String)
], Session.prototype, "userId", void 0);
__decorate([
    SortKey(),
    __metadata("design:type", String)
], Session.prototype, "sessionId", void 0);
__decorate([
    GSISortKey(USERID_SESSIONDATE_INDEX),
    __metadata("design:type", String)
], Session.prototype, "sessionDate", void 0);
Session = __decorate([
    Model({ tableName: 'Sessions' })
], Session);
export { Session };
export class SessionMaker {
    constructor(userId, sessionId, sessionDate, sessionExpirationDate) {
        this.pageViews = 0;
        this.clickEvents = 0;
        this.userId = userId;
        this.sessionId = sessionId;
        this.sessionDate = sessionDate;
        this.sessionExpirationDate = sessionExpirationDate;
    }
}
