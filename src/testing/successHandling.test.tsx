import React, {useCallback} from 'react';
import {
  useOnRequestError,
  useOnRequestSuccess,
  useRequestSuccess,
} from '../hooks';
import {asyncReducers} from '../redux-kit';
import {Provider, useSelector} from 'react-redux';
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
      const {result} = renderHook(() => useRequestSuccess(requestAction), {
        wrapper: Wrapper,
      });

      expect(result.current.success).toBe(null);
      act(() => {
        store.dispatch(requestAction);
      });

      expect(result.current.success).toBe(null);
    });

    it('should not trigger callback if request was triggered', () => {
      const onSuccessCallback = jest.fn();
      renderHook(() => useOnRequestSuccess(requestAction, onSuccessCallback), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });

      expect(onSuccessCallback).not.toHaveBeenCalled();
    });

    it('should change success to true if success action dispatched and trigger callback', () => {
      const {result} = renderHook(() => useRequestSuccess(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch(successAction);
      });

      expect(result.current.success).toBe(true);
      expect(result.current.data).toBe(successAction.payload);
    });

    it('should trigger callback if success action dispatched', () => {
      const onSuccessCallback = jest.fn();

      renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, false),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch(requestAction);
      });

      act(() => {
        store.dispatch(successAction);
      });

      expect(onSuccessCallback).toHaveBeenCalledWith(data, null);
    });

    it('should change status to false if failure action dispatched', () => {
      const {result} = renderHook(() => useRequestSuccess(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });
      expect(result.current.success).toBe(null);

      act(() => {
        store.dispatch(failureAction);
      });
      expect(result.current.success).toBe(false);
    });

    it('should not trigger callback if failure action dispatched', () => {
      const onSuccessCallback = jest.fn();

      renderHook(() => useOnRequestSuccess(requestAction, onSuccessCallback), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });

      act(() => {
        store.dispatch(failureAction);
      });
      expect(onSuccessCallback).not.toHaveBeenCalled();
    });

    it('should support storing success additionaly by entityId', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';
      const onSuccessCallback = jest.fn();

      const {result} = renderHook(() => useRequestSuccess(requestAction), {
        wrapper: Wrapper,
      });

      renderHook(
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

      expect(result.current).toEqual({
        success: false,
        entityId: productId2,
        data: null,
        clearSuccessStatus: expect.any(Function),
      });
      expect(result.current.success).toBe(false);
    });

    it('should return correct data on success by entityId', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';

      const data2 = {};
      const onSuccessCallback = jest.fn();

      renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, true),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId2}});
      });

      act(() => {
        store.dispatch({
          ...successAction,
          payload: data2,
          meta: {entityId: productId2},
        });
      });

      expect(onSuccessCallback).toHaveBeenCalledWith(data2, productId2);
    });

    it('should work properly with simultanious calls', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';

      const data1 = {};
      const data2 = {};
      const onSuccessCallback = jest.fn();

      renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, true),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId2}});
      });

      act(() => {
        store.dispatch({
          ...successAction,
          payload: data1,
          meta: {entityId: productId},
        });
      });

      act(() => {
        store.dispatch({
          ...successAction,
          payload: data2,
          meta: {entityId: productId2},
        });
      });

      expect(onSuccessCallback).toHaveBeenCalledWith(data1, productId);
      expect(onSuccessCallback).toHaveBeenCalledWith(data2, productId2);
    });

    it('should clear success state by calling clearSuccessStatus', () => {
      const productId = 'product-1';
      const productId2 = 'product-2';

      const {result} = renderHook(() => useRequestSuccess(requestAction), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      act(() => {
        store.dispatch({...failureAction, meta: {entityId: productId2}});
      });

      expect(store.getState().success).toEqual({
        ANY_ACTION: {
          data: null,
          entityId: 'product-2',
          success: false,
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
          data: null,
          entityId: 'product-2',
          success: false,
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

    it('should auto clear success it needed', () => {
      const productId = 'product-1';

      const onSuccessCallback = jest.fn();

      renderHook(
        () => useOnRequestSuccess(requestAction, onSuccessCallback, true),
        {
          wrapper: Wrapper,
        },
      );

      act(() => {
        store.dispatch({...requestAction, meta: {entityId: productId}});
      });

      expect(store.getState().success).toEqual({
        ANY_ACTION: {
          data: null,
          entityId: 'product-1',
          success: null,
        },
      });

      act(() => {
        store.dispatch({...successAction, meta: {entityId: productId}});
      });

      expect(onSuccessCallback).toHaveBeenCalledWith(data, productId);
      expect(store.getState().success).toEqual({});
    });

    it('should has up to date data from the scope', () => {
      const initialState = {
        data: null,
      };

      const testReducer = (state = initialState, action) => {
        if (action.type === 'ANY_ACTION_SUCCESS') {
          return {
            ...state,
            data: action.payload,
          };
        }
        return state;
      };
      const newStore = createStore(
        combineReducers({
          ...asyncReducers,
          test: testReducer,
        }),
      );
      const NewWrapper = ({children}) => (
        <Provider store={newStore}>{children}</Provider>
      );

      let finalData = null;

      function useTest() {
        // @ts-ignore
        const testData = useSelector(state => state.test.data);

        const callback = useCallback(() => {
          finalData = testData;
        }, [testData]);

        useOnRequestSuccess(requestAction, callback);
      }

      renderHook(() => useTest(), {
        wrapper: NewWrapper,
      });

      act(() => {
        newStore.dispatch(requestAction);
      });

      act(() => {
        newStore.dispatch({
          ...successAction,
          payload: 'test',
        });
      });

      expect(finalData).toEqual('test');
    });

    it('should not be affected by other state hooks', () => {
      const onSuccessCallback = jest.fn();
      const onErrorCallback = jest.fn();

      function useTest() {
        useOnRequestSuccess(requestAction, onSuccessCallback);

        useOnRequestError(requestAction, onErrorCallback);
      }

      renderHook(() => useTest(), {
        wrapper: Wrapper,
      });

      act(() => {
        store.dispatch(requestAction);
      });

      act(() => {
        store.dispatch({...failureAction, payload: 'error'});
      });

      expect(onErrorCallback).toBeCalled();

      act(() => {
        store.dispatch(requestAction);
      });

      act(() => {
        store.dispatch(successAction);
      });

      expect(onSuccessCallback).toBeCalled();
    });
  });
});
