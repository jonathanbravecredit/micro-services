import { SecureMailGenerators } from 'lib/utils/securemail/generators';

export const SecureMailTriggerGenerators: Record<string, (arg0?: any) => any> = {
  pvItems: SecureMailGenerators.generatePVItemTemplate,
};

export enum SecuremailTriggerEmails {
  PVItems = 'pvItems',
}
