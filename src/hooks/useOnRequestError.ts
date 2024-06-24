import {Action} from './types';
import {IError} from '../types';
import {useStaticCallback} from './useStaticCallback';
import {useRequestError} from './useRequestError';
import useUpdateEffect from './useUpdateEffect';

export function useOnRequestError<T extends IError>(
  action: Action,
  callback: (error: T | null, entityId: string | null) => void,
  autoClear = false,
) {
  const {entityId, error, clearError, timestamp} = useRequestError(action);

  const errorCallback = useStaticCallback(() => {
    if (callback) {
      if (autoClear) {
        clearError();
      }
      callback(error as T, entityId);
    }
  }, [autoClear, callback, clearError, entityId, error]);

  useUpdateEffect(() => {
    if (error) {
      errorCallback();
    }
  }, [errorCallback, error, entityId, timestamp]);
}
