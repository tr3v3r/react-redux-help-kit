import {useSelector, DefaultRootState, useDispatch} from 'react-redux';
import {useLayoutEffect} from 'react';
import {removeReducerById} from '../redux-kit/reducers';
const subscribers = {};

export function useCurrentDataSelector<
  T extends (state: DefaultRootState, reducerId: string) => any,
>(selector: T, reducerId: string, reduxStateBranchName: string): ReturnType<T> {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (subscribers[reducerId]) {
      subscribers[reducerId] += 1;
    } else {
      subscribers[reducerId] = 1;
    }

    return () => {
      subscribers[reducerId] -= 1;
      if (subscribers[reducerId] === 0) {
        delete subscribers[reducerId];
        dispatch(
          removeReducerById({reduxStateBranchName, reducerId: reducerId}),
        );
      }
    };
  }, [dispatch, reducerId, reduxStateBranchName]);

  const data: ReturnType<T> = useSelector(state =>
    selector(
      state,
      state?.[reduxStateBranchName]?.[reducerId] ? reducerId : 'default',
    ),
  );

  return data;
}
