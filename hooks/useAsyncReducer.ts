import { useCallback, useEffect, useState } from 'react';

export function useAsyncReducer<T extends unknown[], R>(
  callback: (...args: T) => Promise<R>,
  args?: T,
  initialState?: R
) {
  const [data, setData] = useState<R | undefined>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const fetchData = useCallback(async (...args: T) => {
    setLoading(true);
    try {
      const result = await callback(...args);
      setData(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (args && !initialState) {
      fetchData(...args);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, fetchData };
}
