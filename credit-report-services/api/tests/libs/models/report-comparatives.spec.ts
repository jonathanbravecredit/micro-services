import { CreditReport, MetricIds } from '@bravecredit/brave-sdk';
import { ReportComparatives } from 'libs/models/report-comparatives/report-comparatives';
import { Helper } from 'tests/helpers/test-helper';
import { CREDIT_REPORT_CURRENT, CREDIT_REPORT_PRIOR_CHANGE } from 'tests/__mocks__/credit-report.mocks';

const mockMetrics = [MetricIds.NegativeAccounts, MetricIds.CreditMix, MetricIds.CreditUtilization];
describe('ReportComparative Class', () => {
  let instance: ReportComparatives;
  let h: any;
  beforeEach(() => {
    instance = new ReportComparatives(
      CREDIT_REPORT_PRIOR_CHANGE as CreditReport,
      CREDIT_REPORT_CURRENT as CreditReport,
    );
    h = new Helper<ReportComparatives>(instance);
  });

  it('should run one test', () => {
    expect(true).toBeTruthy();
  });
  it('should have a method called "compare"', () => {
    expect(h.hasMethod(instance, 'compare')).toEqual(true);
  });

  it('should have a property called "comparatives"', () => {
    expect(h.hasProperty(instance, 'comparatives')).toEqual(true);
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
