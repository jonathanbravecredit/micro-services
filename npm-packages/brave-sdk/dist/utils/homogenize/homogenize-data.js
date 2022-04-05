"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Homogenize = void 0;
class Homogenize {
    constructor(_data) {
        this.homogenize(_data);
    }
    homogenize(_data) {
        Object.assign(this, _data);
    }
    homogenizeArray(arr, instance) {
        if (!arr) {
            return [];
        }
        else if (!(arr instanceof Array)) {
            return [new instance(arr)];
        }
        else if (arr instanceof Array) {
            return arr.map((a) => {
                return new instance(a);
            });
        }
        else {
            return [];
        }
    }
}
exports.Homogenize = Homogenize;
