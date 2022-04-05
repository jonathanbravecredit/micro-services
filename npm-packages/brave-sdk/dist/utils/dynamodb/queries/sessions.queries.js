"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const session_1 = require("../../../models/session/session");
class SessionQueries {
    constructor() { }
    static createSession(Sessions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(Sessions).ifNotExists().exec();
        });
    }
    static listUserSessions(userId, limit = 50) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(userId).limit(20).execFetchAll();
        });
    }
    static getSession(sub, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store
                .get(sub, sessionId)
                .exec()
                .then((res) => res)
                .catch((err) => err);
        });
    }
    static getLatestSession(userId, sort = 'desc', limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sort === 'desc') {
                return this.store
                    .query()
                    .index(session_1.USERID_SESSIONDATE_INDEX)
                    .wherePartitionKey(userId)
                    .descending()
                    .limit(limit)
                    .execFetchAll();
            }
            else {
                return this.store
                    .query()
                    .index(session_1.USERID_SESSIONDATE_INDEX)
                    .wherePartitionKey(userId)
                    .ascending()
                    .limit(limit)
                    .execFetchAll();
            }
        });
    }
    static incrementSessionPageViews(session, increment = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, sessionId } = session;
            if (!userId || !sessionId)
                return;
            return this.store.update(userId, sessionId).updateAttribute('pageViews').incrementBy(increment).exec();
        });
    }
    static incrementSessionClickEvents(session, increment = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, sessionId } = session;
            if (!userId || !sessionId)
                return;
            return this.store.update(userId, sessionId).updateAttribute('clickEvents').incrementBy(increment).exec();
        });
    }
}
exports.SessionQueries = SessionQueries;
SessionQueries.store = new dynamo_easy_1.DynamoStore(session_1.Session);
