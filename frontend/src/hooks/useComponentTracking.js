import { useEffect } from 'react';

export const useComponentTracking = (onMount) => {
  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, [onMount]);
};
