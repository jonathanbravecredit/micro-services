import { CreditReport, MetricIds } from '@bravecredit/brave-sdk';
import { ReportComparisons } from 'libs/models/report-comparisons/report-comparisons';
import { Helper } from 'tests/helpers/test-helper';
import { CREDIT_REPORT_CURRENT, CREDIT_REPORT_PRIOR_CHANGE } from 'tests/__mocks__/credit-report.mocks';

const mockMetrics = [MetricIds.NegativeAccounts, MetricIds.CreditMix, MetricIds.CreditUtilization];
describe('ReportComparison Class', () => {
  let instance: ReportComparisons;
  let h: any;
  beforeEach(() => {
    instance = new ReportComparisons(CREDIT_REPORT_PRIOR_CHANGE as CreditReport, CREDIT_REPORT_CURRENT as CreditReport);
    h = new Helper<ReportComparisons>(instance);
  });

  it('should run one test', () => {
    expect(true).toBeTruthy();
  });
  it('should have a method called "compare"', () => {
    expect(h.hasMethod(instance, 'compare')).toEqual(true);
  });

  it('should have a property called "comparisons"', () => {
    expect(h.hasProperty(instance, 'comparisons')).toEqual(true);
  });
  it('should have a property called "priorMetrics"', () => {
    expect(h.hasProperty(instance, 'priorMetrics')).toEqual(true);
  });
  it('should have a property called "currMetrics"', () => {
    expect(h.hasProperty(instance, 'currMetrics')).toEqual(true);
  });
  it('should have a property called "metrics"', () => {
    expect(h.hasProperty(instance, 'metrics')).toEqual(true);
  });

  describe('run method', () => {
    it('should call check', () => {
      const spy = jest.spyOn(instance, 'check');
      instance.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call compare x times', () => {
      const spy = jest.spyOn(instance, 'compare');
      instance.run();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
