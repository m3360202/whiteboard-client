import { useRef, useEffect } from 'react';

export const useUnmountedRef = () => {
  const unmountedRef: any = useRef(false);

  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    [],
  );

  return unmountedRef;
};
