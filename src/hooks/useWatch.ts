import { useEffect, useRef } from 'react';

function useWatch<T>(deps: T, handler: (prev: T, next: T) => void, immediate = false) {
  let nextRef: any = useRef<T>();
  const isImmediate: any = useRef(immediate);

  useEffect(() => {
    if (isImmediate.current) {
      handler(nextRef.current as T, deps);
    } else {
      isImmediate.current = true;
    }
    return () => {
      nextRef.current = deps;
    };
  }, [deps]);
}

export default useWatch;                                                                                                                      