import DynamoDBUtil from 'libs/utils/dynamodb/dynamodbutil';
import { Helper } from 'tests/helpers/test-helper';
describe('DynamoDBUtil', () => {
  let db = new DynamoDBUtil();
  let h = new Helper(DynamoDBUtil);
  it('should have the handleQueryError method', () => {
    const test = h.hasMethod(db, 'handleQueryError');
    expect(test).toEqual(true);
  });
  it('should have the handleCommonErrors method', () => {
    const test = h.hasMethod(db, 'handleCommonErrors');
    expect(test).toEqual(true);
  });
  describe('handleQueryError', () => {
    it('should call handleCommonErrors when code provided', () => {
      const spy = jest.spyOn(db, 'handleCommonErrors');
      db.handleQueryError({ code: 'InternalServerError', message: 'blah blah' });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should NOT call handleCommonErrors when code missing', () => {
      const spy = jest.spyOn(db, 'handleCommonErrors');
      db.handleQueryError({} as { code: string; message: string });
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
    });
  });
});
