import React from 'react';
import { useComponentTracking } from '../../hooks/useComponentTracking';

export const withTracking = (WrappedComponent) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  function WithTrackingComponent(props) {
    useComponentTracking(displayName);
    
    return <WrappedComponent {...props} />;
  }

  WithTrackingComponent.displayName = `withTracking(${displayName})`;
  
  return WithTrackingComponent;
};