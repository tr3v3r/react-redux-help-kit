import React from 'react';

import {useRequestError, useOnRequestError} from '../hooks';
import {asyncReducers} from '../redux-kit';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {act, renderHook} from '@testing-library/react-hooks';

describe('Testing error status handling', () => {
  const store = createStore(combineReducers(asyncReducers));
  const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>;

  it('should have error state', () => {
    expect(store.getState()).toHaveProperty('error', {});
  });

  describe('useRequestError', () => {
    const requestAction = {type: 'ANY_ACTION_REQUEST'};
    const successAction = {type: 'ANY_ACTION_SUCCESS'};
    const failureAction = {type: 'ANY_ACTION_FAILURE', payload: 'error'};

    it('should return eror null if request action dispatched', () => {
      const {result} = renderHook(() => useRequestError(requestAction), {
        wrapper: Wrapper,
      });

      expect(result.current.error).toBe(null);
      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.error).toBe(null);
    });

    it('should return error if failure action dispatched', () => {
      const {result} = renderHook(() => useRequestError(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.error).toBe(null);

      act(() => {
        store.dispatch(failureAction);
      });
      expect(result.current.error).toBe(failureAction.payload);
    });

    it('should allow to subscribe on if failure action dispatch', () => {
      const callback = jest.fn();
      const {unmount} = renderHook(
        () => useOnRequestError(requestAction, callback),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch(requestAction);
      });
      expect(callback).toHaveBeenCalledTimes(0);

      act(() => {
        store.dispatch(failureAction);
      });

      expect(callback).toHaveBeenCalledWith(failureAction.payload, null);
      expect(callback).toHaveBeenCalledTimes(1);

      const productId = 'productId';
      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId}});
      });

      expect(callback).toHaveBeenCalledWith(failureAction.payload, productId);
      expect(callback).toHaveBeenCalledTimes(2);

      act(() => {
        unmount();
      });

      act(() => {
        store.dispatch(failureAction);
      });
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should do nothinh if success action dispatched', () => {
      const {result} = renderHook(() => useRequestError(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.error).toBe(null);

      act(() => {
        store.dispatch(failureAction);
      });
      expect(result.current.error).toBe(failureAction.payload);

      act(() => {
        store.dispatch(successAction);
      });
      expect(result.current.error).toBe(failureAction.payload);
    });

    it('should support storing error additionaly by entityId', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';

      const {result} = renderHook(() => useRequestError(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(result.current.error).toBe(null);
      expect(result.current.getErrorStateByEntityId(productId)).toEqual({
        error: null,
        entityId: productId,
      });
      expect(result.current.getErrorStateByEntityId(productId2)).toEqual({
        error: null,
        entityId: null,
      });

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });

      expect(result.current.error).toBe('error');
      expect(result.current.getErrorStateByEntityId(productId)).toEqual({
        error: null,
        entityId: productId,
      });
      expect(result.current.getErrorStateByEntityId(productId2)).toEqual({
        error: 'error',
        entityId: productId2,
      });
    });

    it('should clear loading state by calling clearLoadingStatus', () => {
      const productId = 'product-1';

      const {result} = renderHook(() => useRequestError(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(store.getState().error).toEqual({
        ANY_ACTION: {
          default: {
            entityId: 'product-1',
            error: null,
          },
          'product-1': {
            entityId: 'product-1',
            error: null,
          },
        },
      });

      act(() => {
        result.current.clearError('product-1');
      });

      expect(store.getState().error).toEqual({
        ANY_ACTION: {},
      });

      act(() => {
        result.current.clearError();
      });

      expect(store.getState().error).toEqual({});
    });
  });
});
