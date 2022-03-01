import Ajv from 'ajv';
import * as schemaEnrolledUserReport from './schema_enrolled-user-report.json';
export const ajv = new Ajv();
ajv.addSchema(schemaEnrolledUserReport, 'enrolledUserReport');
