import React from 'react';
import {useOnRequestSuccess} from '../hooks';
import {asyncReducers} from '../redux-kit';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {act, renderHook} from '@testing-library/react-hooks';

describe('Testing success status handling', () => {
  const store = createStore(combineReducers(asyncReducers));
  const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>;

  it('should have success state', () => {
    expect(store.getState()).toHaveProperty('success', {});
  });

  describe('useOnRequestSuccess', () => {
    const data = {};
    const requestAction = {type: 'ANY_ACTION_REQUEST'};
    const successAction = {type: 'ANY_ACTION_SUCCESS', payload: data};
    const failureAction = {type: 'ANY_ACTION_FAILURE'};

    it('should return success as null if request action dispatched', () => {
      const onSuccessCallback = jest.fn();
      const {result} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback),
        {
          wrapper: Wrapper,
        },
      );

      expect(result.current.success).toBe(null);
      act(() => {
        store.dispatch(requestAction);
      });

      expect(result.current.success).toBe(null);
      expect(onSuccessCallback).not.toHaveBeenCalled();
    });

    it('should change success to true if success action dispatched and trigger callback', () => {
      const onSuccessCallback = jest.fn();

      const {result} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, false),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch(successAction);
      });

      expect(result.current.success).toBe(true);
      expect(result.current.data).toBe(successAction.payload);
      expect(onSuccessCallback).toHaveBeenCalledWith(data, null);
    });

    it('should change status to false if failure action dispatched', () => {
      const onSuccessCallback = jest.fn();

      const {result} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch(failureAction);
      });
      expect(result.current.success).toBe(false);
      expect(onSuccessCallback).not.toHaveBeenCalled();
    });

    it('should support storing success additionaly by entityId', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';
      const onSuccessCallback = jest.fn();

      const {result} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, false),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId2}});
      });

      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      expect(result.current.success).toBe(true);
      expect(result.current.data).toBe(successAction.payload);
      expect(onSuccessCallback).toHaveBeenCalledWith(data, productId);

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId2}});
      });

      expect(result.current.success).toBe(true);
      expect(result.current.data).toBe(successAction.payload);
      expect(onSuccessCallback).toHaveBeenCalledWith(data, productId2);

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });
      expect(result.current.getSuccessStateByEntityId(productId)).toEqual({
        success: true,
        entityId: 'product-1',
        data,
      });
      expect(result.current.success).toBe(false);
    });

    it('should clear success state by calling clearSuccessStatus', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';
      const onSuccessCallback = jest.fn();

      const {result} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, false),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });

      expect(store.getState().success).toEqual({
        ANY_ACTION: {
          default: {
            data: null,
            entityId: 'product-2',
            success: false,
          },
          'product-1': {
            data: {},
            entityId: 'product-1',
            success: true,
          },
          'product-2': {
            data: null,
            entityId: 'product-2',
            success: false,
          },
        },
      });

      act(() => {
        result.current.clearSuccessStatus();
      });

      expect(store.getState().success).toEqual({});
    });

    it('it should not add anything to state if no hooks mounted', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';
      const onSuccessCallback = jest.fn();

      const {unmount} = renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, false),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });

      expect(store.getState().success).toEqual({
        ANY_ACTION: {
          default: {
            data: null,
            entityId: 'product-2',
            success: false,
          },
          'product-1': {
            data: {},
            entityId: 'product-1',
            success: true,
          },
          'product-2': {
            data: null,
            entityId: 'product-2',
            success: false,
          },
        },
      });

      act(() => {
        unmount();
      });

      expect(store.getState().success).toEqual({});

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      expect(store.getState().success).toEqual({});
    });

    it('should clear success by default if callback is present', () => {
      const productId = 'product-1';

      const onSuccessCallback = jest.fn();

      renderHook(() => useOnRequestSuccess(requestAction, onSuccessCallback), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(store.getState().success).toEqual({
        ANY_ACTION: {
          default: {
            data: null,
            entityId: 'product-1',
            success: null,
          },
          'product-1': {
            data: null,
            entityId: 'product-1',
            success: null,
          },
        },
      });

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      expect(onSuccessCallback).toHaveBeenCalledWith(data, productId);
      expect(store.getState().success).toEqual({ANY_ACTION: {}});
    });
  });
});
