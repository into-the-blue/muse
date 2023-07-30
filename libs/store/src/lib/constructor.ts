import type { Container } from 'inversify';
import { createContext } from 'react';
import { createInjectable, createInstantiable } from './decorators';
import { createResolver, createUnionResolver } from './resolver';
import type { StoreContextType } from './types';
import { createUseSingletonHook, createUseUnionResolveHook } from './hooks';

export const constructStore = (container: Container) => {
  const Injectable = createInjectable(container);
  const Instantiable = createInstantiable();
  const resolver = createResolver(container);
  const unionResolver = createUnionResolver(resolver);
  const context: StoreContextType = createContext({
    container,
    resolver,
    unionResolver,
  });

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
  };
};
