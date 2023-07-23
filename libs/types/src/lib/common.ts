import React from 'react';
export type ClassLike<T = any> = new (...args: any[]) => T;
export type Enhancer = <P extends JSX.IntrinsicAttributes>(
  app: React.ComponentType<P>
) => React.ComponentType<P>;
