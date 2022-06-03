// import { UserInitiative } from 'libs/models/UserInitiative.model';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { Helper } from 'tests/helpers/test-helper';
import * as _ from 'lodash';
// import { InitiativeTask } from 'libs/classes/Initiative';
import { UserInitiative } from '@bravecredit/brave-sdk/dist/models/user-initiative/user-initiative';
import { InitiativeTask } from '@bravecredit/brave-sdk/dist/models/user-initiative/initiative/initiative';

describe('InitiativeCheck', () => {
  const mockEvent = 'INSERT';
  const mockCurrent = {} as UserInitiative;
  const mockPrior = {} as UserInitiative;
  const instance = new InitiativeCheck(mockEvent, mockCurrent, mockPrior);
  const h = new Helper<InitiativeCheck>(instance);
  it('should exist', () => {
    expect(instance).toBeTruthy();
  });

  describe('inherited methods and properties', () => {
    it('should have id property', () => {
      const t = h.hasProperty(instance, 'id');
      expect(t).toEqual(true);
    });
    it('should have setId method', () => {
      const t = h.hasMethod(instance, 'setId');
      expect(t).toEqual(true);
    });
    it('should have generateTag method', () => {
      const t = h.hasMethod(instance, 'generateTag');
      expect(t).toEqual(true);
    });
    it('should have generateResults method', () => {
      const t = h.hasMethod(instance, 'generateResults');
      expect(t).toEqual(true);
    });
    it('should have check method', () => {
      const t = h.hasMethod(instance, 'check');
      expect(t).toEqual(true);
    });
  });

  describe('methods and props', () => {
    it('should contain event property', () => {
      expect(instance.event).toBeTruthy();
    });
    it('should contain current property', () => {
      expect(instance.current).toBeTruthy();
    });
    it('should contain prior property', () => {
      expect(instance.prior).toBeTruthy();
    });
    it('should contain checkOne method', () => {
      const t = h.hasMethod(instance, 'checkOne');
      expect(t).toEqual(true);
    });
    it('should contain checkTwo method', () => {
      const t = h.hasMethod(instance, 'checkTwo');
      expect(t).toEqual(true);
    });
    it('should contain checkThree method', () => {
      const t = h.hasMethod(instance, 'checkThree');
      expect(t).toEqual(true);
    });
  });

  describe('CheckOne method', () => {
    it('should return false results when event is NOT "INSERT"', () => {
      const mock = instance.generateResults(false);
      instance.event = 'MODIFY';
      const spy = jest.spyOn(instance, 'generateResults');
      const check = instance.checkTwo();
      expect(check).toEqual(mock);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should return false results when goal is NOT set', () => {
      const mock = instance.generateResults(false);
      instance.event = 'INSERT';
      const spy = jest.spyOn(instance, 'generateResults');
      const check = instance.checkOne();
      expect(check).toEqual(mock);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should call generateTag 1 time if goal set', () => {
      const mock = instance.generateResults(false);
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const spy = jest.spyOn(instance, 'generateTag');
      instance.checkOne();
      expect(spy).toHaveBeenCalledWith(`goal_abc`, 'active');
      spy.mockClear();
    });
    it('should call generateResults 1 time if goal set', () => {
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const mockTags = [instance.generateTag(`goal_abc`, 'active')];
      const spy = jest.spyOn(instance, 'generateResults');
      instance.checkOne();
      expect(spy).toHaveBeenCalledWith(true, mockTags);
      spy.mockClear();
    });
    it('should return true results when goal is set', () => {
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const mockTags = [instance.generateTag(`goal_abc`, 'active')];
      const mockResult = instance.generateResults(true, mockTags);
      const res = instance.checkOne();
      expect(res).toEqual(mockResult);
    });
  });

  describe('CheckTwo method', () => {
    let genSpy = jest.spyOn(instance, 'generateResults');
    let tagSpy = jest.spyOn(instance, 'generateTag');

    beforeEach(() => {
      genSpy.mockClear();
      tagSpy.mockClear();
    });
    it('should return false results when event is NOT "MODIFY"', () => {
      const mock = instance.generateResults(false);
      instance.event = 'INSERT';
      const check = instance.checkTwo();
      expect(check).toEqual(mock);
      expect(genSpy).toHaveBeenCalled();
    });
    it('should return false results when no task exist', () => {
      const mock = instance.generateResults(false);
      instance.event = 'MODIFY';
      instance.current = { initiativeTasks: [] as InitiativeTask[] } as UserInitiative;
      const check = instance.checkTwo();
      expect(check).toEqual(mock);
      expect(genSpy).toHaveBeenCalled();
    });
    it('should call generateTag 4 times if tasks exist', () => {
      instance.event = 'MODIFY';
      const { mockCurrent } = createMockTasks();
      instance.current = mockCurrent;
      instance.checkTwo();
      expect(tagSpy).toHaveBeenCalledTimes(4);
    });
    it('should call generateResults 1 time if tasks exist', () => {
      instance.event = 'MODIFY';
      const { mockCurrent, mockTasks } = createMockTasks();
      instance.current = mockCurrent;
      const mockTags = mockTasks.map((c) => instance.generateTag(`task_${c.taskId}_${c.taskStatus}`, 'active'));
      instance.checkTwo();
      expect(genSpy).toHaveBeenCalledWith(true, mockTags);
    });
    it('should return true results when goal is set', () => {
      instance.event = 'MODIFY';
      const { mockCurrent, mockTasks } = createMockTasks();
      instance.current = mockCurrent;
      const mockTags = mockTasks.map((c) => instance.generateTag(`task_${c.taskId}_${c.taskStatus}`, 'active'));
      const mockResult = instance.generateResults(true, mockTags);
      const res = instance.checkTwo();
      expect(res).toEqual(mockResult);
    });
  });

  describe('CheckThree method', () => {
    let genSpy = jest.spyOn(instance, 'generateResults');
    let tagSpy = jest.spyOn(instance, 'generateTag');

    beforeEach(() => {
      genSpy.mockClear();
      tagSpy.mockClear();
    });
    it('should call generateResults if status not set', () => {
      instance.checkThree();
      expect(genSpy).toHaveBeenCalledWith(false);
    });
    it('should call generateTag 3 times if status populated:not_started', () => {
      instance.current.initiativeStatus = 'not_started';
      instance.checkThree();
      expect(tagSpy).toHaveBeenCalledTimes(3);
      expect(tagSpy).nthCalledWith(1, `goal_not_started`, 'active');
      expect(tagSpy).nthCalledWith(2, `goal_in_progress`, 'inactive');
      expect(tagSpy).nthCalledWith(3, `goal_complete`, 'inactive');
    });
    it('should call generateTag 3 times if status populated:in_progress', () => {
      instance.current.initiativeStatus = 'in_progress';
      instance.checkThree();
      expect(tagSpy).toHaveBeenCalledTimes(3);
      expect(tagSpy).nthCalledWith(1, `goal_not_started`, 'inactive');
      expect(tagSpy).nthCalledWith(2, `goal_in_progress`, 'active');
      expect(tagSpy).nthCalledWith(3, `goal_complete`, 'inactive');
    });
    it('should call generateTag 3 times if status populated:complete', () => {
      instance.current.initiativeStatus = 'complete';
      instance.checkThree();
      expect(tagSpy).toHaveBeenCalledTimes(3);
      expect(tagSpy).nthCalledWith(1, `goal_not_started`, 'inactive');
      expect(tagSpy).nthCalledWith(2, `goal_in_progress`, 'inactive');
      expect(tagSpy).nthCalledWith(3, `goal_complete`, 'active');
    });
    it('should call generateResults with false if status something else', () => {
      instance.current.initiativeStatus = 'wrong' as 'in_progress';
      instance.checkThree();
      expect(genSpy).toHaveBeenCalledWith(false);
    });
    it('should return results of generateResults if not_started', () => {
      instance.current.initiativeStatus = 'not_started';
      const mockTags = createMockTags('not_started');
      const mockRes = instance.generateResults(true, mockTags);
      const res = instance.checkThree();
      expect(genSpy).toHaveBeenCalledWith(true, mockTags);
      expect(res).toEqual(mockRes);
    });
    it('should return results of generateResults if in_progress', () => {
      instance.current.initiativeStatus = 'in_progress';
      const mockTags = createMockTags('in_progress');
      const mockRes = instance.generateResults(true, mockTags);
      const res = instance.checkThree();
      expect(genSpy).toHaveBeenCalledWith(true, mockTags);
      expect(res).toEqual(mockRes);
    });
    it('should return results of generateResults if complete', () => {
      instance.current.initiativeStatus = 'complete';
      const mockTags = createMockTags('complete');
      const mockRes = instance.generateResults(true, mockTags);
      const res = instance.checkThree();
      expect(genSpy).toHaveBeenCalledWith(true, mockTags);
      expect(res).toEqual(mockRes);
    });
  });
});

// helpers
const createMockTags = (status: 'not_started' | 'in_progress' | 'complete') => {
  const mockEvent = 'INSERT';
  const mockCurrent = {} as UserInitiative;
  const mockPrior = {} as UserInitiative;
  const instance = new InitiativeCheck(mockEvent, mockCurrent, mockPrior);
  if (status == 'not_started') {
    return [
      instance.generateTag(`goal_${status}`, 'active'),
      instance.generateTag(`goal_in_progress`, 'inactive'),
      instance.generateTag(`goal_complete`, 'inactive'),
    ];
  } else if (status === 'in_progress') {
    return [
      instance.generateTag(`goal_not_started`, 'inactive'),
      instance.generateTag(`goal_${status}`, 'active'),
      instance.generateTag(`goal_complete`, 'inactive'),
    ];
  } else if (status === 'complete') {
    return [
      instance.generateTag(`goal_not_started`, 'inactive'),
      instance.generateTag(`goal_in_progress`, 'inactive'),
      instance.generateTag(`goal_${status}`, 'active'),
    ];
  } else {
    return [];
  }
};
const createMockTasks = () => {
  const tasks = [0, 1, 2].map((t) => ({ taskId: `${t}`, taskStatus: 'not_started' }));
  const mockCurrent = {
    initiativeTasks: [{ taskId: '9', taskStatus: 'not_started', subTasks: tasks }] as InitiativeTask[],
  } as UserInitiative;
  const mockTasks: InitiativeTask[] = [];
  mockCurrent.initiativeTasks?.forEach((t) => {
    mockTasks.push(t);
    t.subTasks.forEach((t) => {
      mockTasks.push(t);
    });
  });
  return {
    mockCurrent,
    mockTasks,
  };
};
