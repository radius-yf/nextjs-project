import { useCallback, useEffect, useRef, useState } from 'react';

export function useAsyncReducer<T extends unknown[], R>(
  callback: (...args: T) => Promise<R>,
  args?: T,
  initialState?: R
) {
  const [status, setStatus] = useState({
    data: initialState,
    loading: !initialState,
    error: undefined as Error | undefined
  });

  const fetchData = useCallback(
    async (...args: T) => {
      setStatus((s) => ({ ...s, loading: true }));
      try {
        const result = await callback(...args);
        setStatus({ data: result, loading: false, error: undefined });
      } catch (error) {
        setStatus((s) => ({ ...s, loading: false, error: error as Error }));
      }
    },
    [callback]
  );

  // 即使在严格模式下，也只会执行一次
  const initialFlag = useRef(true);
  useEffect(() => {
    if (args && !initialState && initialFlag.current) {
      initialFlag.current = false;
      fetchData(...args);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...status, fetchData };
}
