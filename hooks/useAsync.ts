import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: any[] = []
): { data: T | undefined; loading: boolean; error: Error | undefined } {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useCallback(asyncFn, deps);
  const [state, setState] = useState<{
    data: T | undefined;
    loading: boolean;
    error: Error | undefined;
  }>({
    data: undefined,
    loading: true,
    error: undefined
  });

  useEffect(() => {
    setState({ data: undefined, loading: true, error: undefined });
    fn()
      .then((data) => setState({ data, loading: false, error: undefined }))
      .catch((error) => setState({ data: undefined, loading: false, error }));
  }, [fn]);

  return state;
}
