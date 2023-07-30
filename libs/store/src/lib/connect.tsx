import type { BaseController } from './types';
import type { ClassLike } from '@muse/types';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { zip } from 'lodash';
import { unionResolve } from './defaultContainer';

type Enhancer<IncluedProps> = <
  P extends IncluedProps & JSX.IntrinsicAttributes
>(
  Comp: React.FunctionComponent<P>
) => React.FunctionComponent<
  Omit<P, keyof IncluedProps> & JSX.IntrinsicAttributes
>;

function connectStores<
  Stores extends Record<string, ClassLike<any>>,
  IncluedProps = { [K in keyof Stores]: any }
>(stores: Stores): Enhancer<IncluedProps>;
function connectStores<
  Stores extends Record<string, ClassLike<any>>,
  C extends BaseController,
  IncluedProps = { controller: C } & { [K in keyof Stores]: any }
>(stores: Stores, controller: ClassLike<C>): Enhancer<IncluedProps>;
function connectStores<
  Stores extends Record<string, ClassLike<any>>,
  C extends BaseController,
  IncluedProps = { controller?: C } & { [K in keyof Stores]: any }
>(stores: Stores, controller?: ClassLike<C>): Enhancer<IncluedProps> {
  const enhanceComp = <P extends IncluedProps & JSX.IntrinsicAttributes>(
    Comp: React.FunctionComponent<P>
  ) => {
    const keys: string[] = (!!controller ? ['controller'] : []).concat(
      Object.keys(stores)
    );
    const classes: ClassLike[] = (!!controller ? [controller] : []).concat(
      Object.values(stores)
    );
    const instances = unionResolve(...classes);
    const compProps: Partial<
      { controller?: C } & { [K in keyof Stores]: any }
    > = Object.fromEntries(zip(keys, instances));

    const CompObserver = observer(Comp);
    function Enhanced(props: Omit<P, keyof IncluedProps>) {
      const _props = {
        ...props,
        ...compProps,
      } as P;
      useEffect(() => {
        compProps.controller?.componentDidMount?.();
        return () => compProps.controller?.componentWillUnmount?.();
      }, []);
      return <CompObserver {..._props} />;
    }
    Enhanced.displayName =
      `connected-with-${controller?.name ?? ''}-${Object.values(stores)
        .map((o) => o.name)
        .join('-')}` + Comp.displayName;
    return Enhanced;
  };
  return enhanceComp;
}

export { connectStores };
