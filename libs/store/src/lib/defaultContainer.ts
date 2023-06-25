import { createInjectable, createInstantiable } from './decorators';
import { createResolver, createUnionResolver } from './resolver';
import { Container } from 'inversify';

export const container = new Container();
export const Injectable = createInjectable(container);
export const Instantiable = createInstantiable();
export const resolve = createResolver(container);
export const unionResolve = createUnionResolver(resolve);
