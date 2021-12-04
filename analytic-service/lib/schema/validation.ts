import Ajv from 'ajv';
export const ajv = new Ajv();
import * as analyticCreate from './analytic_create.json';
ajv.addSchema(analyticCreate, 'analyticCreate');
