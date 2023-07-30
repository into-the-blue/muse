import React from 'react';

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
