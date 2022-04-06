import { TransactionDataMaker } from 'libs/models/transactiondata';
import { Helper } from 'tests/helpers/test-helper';

describe('TransactionData Maker', () => {
  let model: TransactionDataMaker | undefined;
  let h: Helper<TransactionDataMaker>;
  beforeEach(() => {
    const ttl = new Date().valueOf() / 1000;
    model = new TransactionDataMaker('123', 'generic_trans', ttl);
    h = new Helper<TransactionDataMaker>(model);
  });

  describe('Properties', () => {
    it('should have a property called "id"', () => {
      expect(h.hasProperty(model!, 'id')).toEqual(true);
    });
    it('should have a property called "sortKey"', () => {
      expect(h.hasProperty(model!, 'sortKey')).toEqual(true);
    });
    it('should have a property called "timeToLive"', () => {
      expect(h.hasProperty(model!, 'timeToLive')).toEqual(true);
    });
  });
});
