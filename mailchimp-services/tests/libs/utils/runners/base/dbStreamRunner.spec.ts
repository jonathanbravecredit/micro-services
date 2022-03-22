import { DynamoDBRecord } from 'aws-lambda';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { DBStreamRunner } from 'libs/utils/runners/base/dbStreamRunner';
import { Helper } from 'tests/helpers/test-helper';

interface MockInterface {
  pKey: string;
  sKey: number;
  value: string;
}

describe('DBStreamRunner class', () => {
  const mockRecord: DynamoDBRecord = {
    dynamodb: {
      OldImage: {
        pKey: {
          S: 'abc',
        },
        sKey: {
          N: '1',
        },
        value: {
          S: 'original value',
        },
      },
      NewImage: {
        pKey: {
          S: 'abc',
        },
        sKey: {
          N: '1',
        },
        value: {
          S: 'new value',
        },
      },
    },
  } as DynamoDBRecord;
  const runner = new DBStreamRunner<MockInterface>(mockRecord);
  const h = new Helper<DBStreamRunner<MockInterface>>(runner);
  it('should contain init method', () => {
    const test = h.hasMethod(runner, 'init');
    expect(test).toEqual(true);
  });
  it('should contain parseImages method', () => {
    const test = h.hasMethod(runner, 'parseImages');
    expect(test).toEqual(true);
  });
  it('should contain unmarshall method', () => {
    const test = h.hasMethod(runner, 'unmarshall');
    expect(test).toEqual(true);
  });
  it('should contain currImage property', () => {
    const test = h.hasProperty(runner, 'currImage');
    expect(test).toEqual(true);
  });
  it('should contain priorImage property', () => {
    const test = h.hasProperty(runner, 'priorImage');
    expect(test).toEqual(true);
  });

  describe('init method', () => {
    it('should call parseImages', () => {
      const spy = jest.spyOn(runner, 'parseImages');
      const param = runner.record;
      runner.init();
      expect(spy).toHaveBeenCalledWith(param);
      spy.mockClear();
    });
  });

  describe('parseImages method', () => {
    it('should call unmarshall 2 times', () => {
      const spy = jest.spyOn(runner, 'unmarshall');
      const { dynamodb: { OldImage: oi, NewImage: ni } = {} } = mockRecord;
      runner.parseImages(mockRecord);
      expect(spy).toBeCalledTimes(2);
    });
    it('should set the currImage and priorImage properties', () => {
      const { dynamodb: { OldImage: pi, NewImage: ci } = {} } = mockRecord;
      const currImage = runner.unmarshall(ci);
      const priorImage = runner.unmarshall(pi);
      runner.parseImages(mockRecord);

      expect(runner.currImage).toEqual(currImage);
      expect(runner.priorImage).toEqual(priorImage);
    });
  });

  describe('unmarshal method', () => {
    let currImage: AttributeMap | undefined;
    let priorImage: AttributeMap | undefined;

    beforeEach(() => {
      const { dynamodb: { OldImage: pi, NewImage: ci } = {} } = mockRecord;
      priorImage = pi;
      currImage = ci;
    });

    it('should return null if no image provided', () => {
      const param = undefined;
      const rec = runner.unmarshall(param);
      expect(rec).toBeNull();
    });
    it('should NOT return null if image provided', () => {
      const rec = runner.unmarshall(priorImage);
      expect(rec).not.toBeNull();
    });
    it('should ruturn unmarshalled object', () => {
      const rec = runner.unmarshall(priorImage);
      const nh = new Helper<MockInterface | null>(rec);
      const t1 = rec ? !nh.hasProperty(rec, 'S') : false;
      const t2 = rec ? !nh.hasProperty(rec, 'N') : false;
      expect(t1).toEqual(true);
      expect(t2).toEqual(true);
    });
  });
});
