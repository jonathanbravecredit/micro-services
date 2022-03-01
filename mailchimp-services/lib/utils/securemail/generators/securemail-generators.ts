import { previouslyVerifiedItems } from 'lib/utils/securemail/templates/pv-item';

export class SecureMailGenerators {
  constructor() {}

  static generatePVItemTemplate(content: string): string {
    return previouslyVerifiedItems.replace('####', content);
  }
}
