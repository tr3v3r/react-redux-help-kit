import {DependencyList, useRef, useCallback, useLayoutEffect} from 'react';

export function useStaticCallback(
  callback: (...args: any[]) => any,
  deps: DependencyList,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const simpleCallback = useCallback(callback, deps);
  const staticCallback = useRef(simpleCallback);

  useLayoutEffect(() => {
    staticCallback.current = simpleCallback;
  }, [simpleCallback]);

  const memoizedCallback = useCallback((...args) => {
    return staticCallback.current(...args);
  }, []);

  return memoizedCallback;
}
