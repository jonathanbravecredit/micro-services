/**
 * A utility function to find the first (non-undefined) matching key in a nested object
 *   use carefully. Does not iterate over arrays
 * @param {object} o the object you want to search
 * @param {string} k the key you want to search for
 */
export declare const find: <T>(o: any, k: string) => T | undefined;
/**
 * A utility function to find all (non-undefined) matching key in a nested object
 *   use carefully. Does not iterate over arrays
 * @param {object} o the object you want to search
 * @param {string} k the key you want to search for
 */
export declare const findAll: <T>(o: any, k: string) => T[];
/**
 * A utility function to remove unwanted fields by key
 * Will delete all keys of the name you specify
 * @param o
 * @param k
 * @returns
 */
export declare const remove: (o: any, k: string) => void;
/**
 * A utility function to update deep nested objects
 * Will update all keys of the name you specify
 * @param {object} o the object you want to transform
 * @param {string} k the key you want to update (updates all of same name)
 * @param {any} v the value you want to update it to
 */
export declare const update: (o: any, k: string, v: any) => any;
