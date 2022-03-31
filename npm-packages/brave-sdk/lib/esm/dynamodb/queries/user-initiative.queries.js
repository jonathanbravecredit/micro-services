var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { UserInitiative } from '../models/user-initiative.model';
export class UserInitiativeQueries {
    constructor() { }
    static getInitiative(id, program) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store
                .get(id, program)
                .exec()
                .then((res) => res)
                .catch((err) => err);
        });
    }
    static createInitiative(initiative) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOn = new Date().toISOString();
            const userInitiative = Object.assign(Object.assign({}, initiative), { createdOn, modifiedOn: createdOn });
            return this.store.put(userInitiative).exec();
        });
    }
    static updateInitiative(initiative) {
        return __awaiter(this, void 0, void 0, function* () {
            const modifiedOn = new Date().toISOString();
            const userInitiative = Object.assign(Object.assign({}, initiative), { modifiedOn });
            return this.store.put(userInitiative).exec();
        });
    }
    static getFutureScoreInitiative() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getInitiative('bravecredit', '1');
        });
    }
    static getPrograms(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getInitiative('bravecredit', programId);
        });
    }
}
UserInitiativeQueries.store = new DynamoStore(UserInitiative);
