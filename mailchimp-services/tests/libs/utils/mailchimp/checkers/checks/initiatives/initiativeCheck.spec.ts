import { UserInitiative } from 'libs/models/UserInitiative.model';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { Helper } from 'tests/helpers/test-helper';
import * as _ from 'lodash';
import { InitiativeTask } from 'libs/classes/Initiative';

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
    });
    it('should call generateResults 1 time if goal set', () => {
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const mockTags = [instance.generateTag(`goal_abc`, 'active')];
      const spy = jest.spyOn(instance, 'generateResults');
      instance.checkOne();
      expect(spy).toHaveBeenCalledWith(true, mockTags);
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
    it('should return false results when event is NOT "MODIFY"', () => {
      const mock = instance.generateResults(false);
      instance.event = 'INSERT';
      const spy = jest.spyOn(instance, 'generateResults');
      const check = instance.checkTwo();
      expect(check).toEqual(mock);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should return false results when no task', () => {
      const mock = instance.generateResults(false);
      instance.event = 'MODIFY';
      instance.current = { initiativeTasks: [] as InitiativeTask[] } as UserInitiative;
      const spy = jest.spyOn(instance, 'generateResults');
      const check = instance.checkTwo();
      expect(check).toEqual(mock);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    xit('should call generateTag 1 time if goal set', () => {
      const mock = instance.generateResults(false);
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const spy = jest.spyOn(instance, 'generateTag');
      instance.checkOne();
      expect(spy).toHaveBeenCalledWith(`goal_abc`, 'active');
    });
    xit('should call generateResults 1 time if goal set', () => {
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const mockTags = [instance.generateTag(`goal_abc`, 'active')];
      const spy = jest.spyOn(instance, 'generateResults');
      instance.checkOne();
      expect(spy).toHaveBeenCalledWith(true, mockTags);
    });
    xit('should return true results when goal is set', () => {
      instance.event = 'INSERT';
      instance.current = { initiativeReason: 'abc' } as UserInitiative;
      const mockTags = [instance.generateTag(`goal_abc`, 'active')];
      const mockResult = instance.generateResults(true, mockTags);
      const res = instance.checkOne();
      expect(res).toEqual(mockResult);
    });
  });
});
