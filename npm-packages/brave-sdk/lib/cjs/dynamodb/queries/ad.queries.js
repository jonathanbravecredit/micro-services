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
exports.AdsQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const ad_model_1 = require("../models/ad.model");
class AdsQueries {
    static listAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().whereAttribute('active').equals(true).execFetchAll();
        });
    }
}
exports.AdsQueries = AdsQueries;
AdsQueries.store = new dynamo_easy_1.DynamoStore(ad_model_1.Ad);
