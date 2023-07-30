import React from 'react';
import type { Enhancer } from '@muse/types';

export const createContextEnhancer =
  <Ctx extends React.Context<V>, V>(
    context: Ctx,
    value: V,
    displayNamePrefix: string
  ) =>
  <P extends JSX.IntrinsicAttributes>(Comp: React.ComponentType<P>) => {
    const EnhancedComp = (props: P) => {
      return (
        <context.Provider value={value}>{<Comp {...props} />}</context.Provider>
      );
    };
    EnhancedComp.displayName = displayNamePrefix + Comp.displayName;
    return EnhancedComp;
  };

export const composeEnhancers =
  <P extends JSX.IntrinsicAttributes>(Comp: React.ComponentType<P>) =>
  (...enhancers: Enhancer[]) => {
    return enhancers.reduce(
      (Comp, enhancer) => enhancer(Comp),
      Comp
    ) as React.ComponentType<P>;
  };
