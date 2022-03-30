import { CreditReportMetrics } from 'libs/models/CreditReportMetrics/CreditReportMetrics';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';
import { Helper } from 'tests/helpers/test-helper';

describe('CreditReportMetrics', () => {
  const metrics = new CreditReportMetrics({} as MergeReport);
  const h = new Helper<CreditReportMetrics>(metrics);
  describe('Property and methods', () => {
    it('should have a property called report', () => {
      expect(h.hasProperty(metrics, 'report')).toEqual(true);
    });
    it('should have a property called negativeAccounts', () => {
      expect(h.hasProperty(metrics, 'negativeAccounts')).toEqual(true);
    });
    it('should have a method called calcNegativeAccounts', () => {
      expect(h.hasMethod(metrics, 'calcNegativeAccounts')).toEqual(true);
    });
  });
});
