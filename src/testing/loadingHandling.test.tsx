import React from 'react';

import {useRequestLoading} from '../hooks';
import {asyncReducers} from '../redux-kit';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {act, renderHook} from '@testing-library/react-hooks';

describe('Testing loading status handling', () => {
  const store = createStore(combineReducers(asyncReducers));
  const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>;

  it('should have loading state', () => {
    expect(store.getState()).toHaveProperty('loading', {});
  });

  describe('useRequestLoading', () => {
    const requestAction = {type: 'ANY_ACTION_REQUEST'};
    const successAction = {type: 'ANY_ACTION_SUCCESS'};
    const failureAction = {type: 'ANY_ACTION_FAILURE'};

    it('should return loading true if request action dispatched', () => {
      const {result} = renderHook(() => useRequestLoading(requestAction), {
        wrapper: Wrapper,
      });

      expect(result.current.loading).toBe(false);
      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.loading).toBe(true);
    });

    it('should change loading to false if success action dispatched', () => {
      const {result} = renderHook(() => useRequestLoading(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.loading).toBe(true);

      act(() => {
        store.dispatch(successAction);
      });
      expect(result.current.loading).toBe(false);
    });

    it('should change loading to false if failure action dispatched', () => {
      const {result} = renderHook(() => useRequestLoading(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.loading).toBe(true);

      act(() => {
        store.dispatch(failureAction);
      });
      expect(result.current.loading).toBe(false);
    });

    it('should support storing loading additionaly by entityId', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';

      const {result} = renderHook(() => useRequestLoading(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId)).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId2)).toBe(false);

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId2}});
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId)).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId2)).toBe(true);

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId)).toBe(true);
      expect(result.current.getLoadingStateByEntityId(productId2)).toBe(false);

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.getLoadingStateByEntityId(productId)).toBe(false);
      expect(result.current.getLoadingStateByEntityId(productId2)).toBe(false);
    });

    it('should clear loading state by calling clearLoadingStatus', () => {
      const {result} = renderHook(() => useRequestLoading(requestAction), {
        wrapper: Wrapper,
      });

      expect(store.getState().loading).toEqual({
        ANY_ACTION: {
          default: false,
          'product-1': false,
          'product-2': false,
        },
      });

      act(() => {
        result.current.clearLoadingStatus();
      });

      expect(store.getState().loading).toEqual({});
    });
  });
});
