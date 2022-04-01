import { CreditReport } from 'libs/models/CreditReport.model';
import { CreditReportDashboardMetrics } from 'libs/models/CreditReportDashboardMetrics';
import { Helper } from 'tests/helpers/test-helper';

describe('CreditReportMetrics', () => {
  const metrics = new CreditReportDashboardMetrics({} as CreditReport);
  const h = new Helper<CreditReportDashboardMetrics>(metrics);
  describe('Required inherited properties and methods', () => {
    it('should have a property called tradelineRecords', () => {
      expect(h.hasProperty(metrics, 'tradelineRecords')).toEqual(true);
    });
    it('should have a method called init', () => {
      expect(h.hasMethod(metrics, 'init')).toEqual(true);
    });
    it('should have a method called aggregate', () => {
      expect(h.hasMethod(metrics, 'aggregate')).toEqual(true);
    });
    it('should have a method called filterNegativeAccounts', () => {
      expect(h.hasMethod(metrics, 'filterNegativeAccounts')).toEqual(true);
    });
  });
  describe('Property and methods', () => {
    it('should have a property called report', () => {
      expect(h.hasProperty(metrics, 'report')).toEqual(true);
    });
  });
});
