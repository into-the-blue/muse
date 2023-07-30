import type { Container } from 'inversify';
import { createContext } from 'react';
import { createInjectable, createInstantiable } from './decorators';
import { createResolver, createUnionResolver } from './resolver';
import type { StoreContextType, StoreContextValue } from './types';
import { createUseSingletonHook, createUseUnionResolveHook } from './hooks';
import { createContextEnhancer } from '@muse/utils';

export const constructStore = (container: Container) => {
  const Injectable = createInjectable(container);
  const Instantiable = createInstantiable();
  const resolver = createResolver(container);
  const unionResolver = createUnionResolver(resolver);
  const ctxValue: StoreContextValue = {
    container,
    resolver,
    unionResolver,
  };
  const context: StoreContextType = createContext(ctxValue);
  context.displayName = 'StoreContext';

  const storeEnhancer = createContextEnhancer(
    context,
    ctxValue,
    'store-connected-'
  );

  const useInstance = createUseSingletonHook(context);
  const useUnionResolve = createUseUnionResolveHook(context);

  return {
    Injectable,
    Instantiable,
    resolver,
    unionResolver,
    context,
    useInstance,
    useUnionResolve,
    enhancer: storeEnhancer,
  };
};
