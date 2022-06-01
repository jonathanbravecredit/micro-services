import Ajv from 'ajv';
import * as schemaMailchimpRequest from './schema_mailchimp_request.json';
export const ajv = new Ajv();
ajv.addSchema(schemaMailchimpRequest, 'mailChimpRequest');
