import {useRef, useState} from 'react';
import {useStaticCallback} from '../useStaticCallback';
import {act, renderHook} from '@testing-library/react-hooks';

describe('useStaticCallback', () => {
  it('should create callback based on passed function', () => {
    const fn = jest.fn();
    const {result} = renderHook(() => useStaticCallback(fn, []));
    result.current();

    expect(fn).toHaveBeenCalled();
  });

  it('should not re-create callback if dependencies change', () => {
    function useTest() {
      const [randomValue, setRandomValue] = useState(1);
      const latestValue = useRef(1);

      const assingLatestValue = useStaticCallback(() => {
        latestValue.current = randomValue;
      }, [randomValue]);

      return {
        latestValue: latestValue,
        setRandomValue,
        assingLatestValue,
      };
    }

    const {result} = renderHook(() => useTest());

    const currentCallback = result.current.assingLatestValue;
    act(() => {
      result.current.setRandomValue(2);
    });

    expect(currentCallback).toBe(result.current.assingLatestValue);
    act(() => {
      result.current.assingLatestValue();
    });

    expect(result.current.latestValue.current).toBe(2);
  });
});
