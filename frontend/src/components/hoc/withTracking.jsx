import React from 'react';
import { useComponentTracking } from '../../hooks/useComponentTracking';
export const withTracking = (WrappedComponent, componentName) => {
  return function WithTrackingComponent({ onMount, ...props }) {
    useComponentTracking(onMount);
    
    return <WrappedComponent {...props} />;
  };
};