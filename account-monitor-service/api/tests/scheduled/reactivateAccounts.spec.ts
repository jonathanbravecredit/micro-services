import * as reactivateAccounts from '../../src/scheduled/reactivateAccounts';
class QueryMock {
  getReactivationAccount() {
    return null;
  }
}

describe('Reactivate Accounts Handler', () => {
  let queryMock: any;
  beforeEach(() => {
    queryMock = new QueryMock();
  });
  it('Should call "getReactivationAccount"', () => {
    const spy = jest.spyOn(queryMock, 'getReactivationAccount');
    spy.mockReturnValue(null);
    reactivateAccounts.main(null, null, null);
    expect(spy).toHaveBeenCalled();
  });
});
