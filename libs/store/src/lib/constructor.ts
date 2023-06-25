import { Container } from 'inversify';
import { createContext } from 'react';
import { createInjectable, createInstantiable } from './decorators';
import { createResolver, createUnionResolver } from './resolver';
import { StoreContextType } from './types';

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

  return {
    Injectable,
    Instantiable,
    resolver,
    unionResolver,
    context,
  };
};
