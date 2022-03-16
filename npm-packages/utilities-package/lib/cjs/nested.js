"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.remove = exports.findAll = exports.find = void 0;
/**
 * A utility function to find the first (non-undefined) matching key in a nested object
 *   use carefully. Does not iterate over arrays
 * @param {object} o the object you want to search
 * @param {string} k the key you want to search for
 */
const find = (o, k) => {
    let value;
    const _returnNestedObject = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (key === k && value === undefined)
                value = obj[k];
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                _returnNestedObject(obj[key]);
            }
        });
    };
    _returnNestedObject(o);
    return value;
};
exports.find = find;
/**
 * A utility function to find all (non-undefined) matching key in a nested object
 *   use carefully. Does not iterate over arrays
 * @param {object} o the object you want to search
 * @param {string} k the key you want to search for
 */
const findAll = (o, k) => {
    let value = [];
    const _returnNestedObject = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (key === k)
                value.push(obj[k]);
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                _returnNestedObject(obj[key]);
            }
        });
    };
    _returnNestedObject(o);
    return value;
};
exports.findAll = findAll;
/**
 * A utility function to remove unwanted fields by key
 * Will delete all keys of the name you specify
 * @param o
 * @param k
 * @returns
 */
const remove = (o, k) => {
    const obj = Object.assign({}, o);
    _removeKeyNestedObject(obj, k);
    return obj;
};
exports.remove = remove;
const _removeKeyNestedObject = (o, k) => {
    if (!o)
        return;
    delete o[k];
    Object.keys(o).forEach((key) => {
        if (typeof o[key] === 'object') {
            _removeKeyNestedObject(o[key], k);
        }
    });
};
/**
 * A utility function to update deep nested objects
 * Will update all keys of the name you specify
 * @param {object} o the object you want to transform
 * @param {string} k the key you want to update (updates all of same name)
 * @param {any} v the value you want to update it to
 */
const update = (o, k, v) => {
    const obj = Object.assign({}, o);
    _updateNestedRecurse(obj, k, v);
    return obj;
};
exports.update = update;
const _updateNestedRecurse = (o, k, v) => {
    if (!o)
        return;
    Object.keys(o).forEach((key) => {
        if (key == k)
            o[k] = v;
        if (typeof o[key] === 'object') {
            _updateNestedRecurse(o[key], k, v);
        }
    });
};
