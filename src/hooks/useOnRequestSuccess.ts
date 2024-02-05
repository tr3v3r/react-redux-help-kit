import {Action} from './types';
import {useStaticCallback} from './useStaticCallback';
import {useRequestSuccess} from './useRequestSuccess';
import useUpdateEffect from './useUpdateEffect';

export function useOnRequestSuccess(
  action: Action,
  callback?: (data: any, entityId: string | null) => void,
  autoClear: boolean = false,
) {
  const {data, clearSuccessStatus, entityId, success} =
    useRequestSuccess(action);

  const successCallback = useStaticCallback(() => {
    if (callback) {
      if (autoClear) {
        clearSuccessStatus();
      }
      callback(data, entityId);
    }
  }, [callback, autoClear, data, entityId, clearSuccessStatus]);

  useUpdateEffect(() => {
    if (success === true) {
      successCallback();
    }
  }, [successCallback, success, entityId]);
}
