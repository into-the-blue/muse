import { ClassLike } from '@muse/types';
import { Container } from 'inversify';
import { getClassSymbol } from './decorators';
import { SINGLETON_SYMBOL } from './constants';

const isClass = (target: new (...args: unknown[]) => unknown) => {
  return (
    typeof target === 'function' &&
    /^class\s/.test(target.prototype.constructor.toString())
  );
};

type Resolver = <T>(target: ClassLike<T>, sharedContaienr?: Container) => T;

export const createResolver = (container: Container) => {
  const resolve: Resolver = <T>(
    target: ClassLike<T>,
    sharedContaienr?: Container
  ): T => {
    if (!isClass(target)) throw new Error('Invalid target, expect Class');
    const identifier = getClassSymbol(target); // identifier of class
    const paramTypes = Reflect.getMetadata('design:paramtypes', target);
    if (!paramTypes?.length) {
      // no parameters, create an instance
      const isBound = container.isBound(identifier);
      if (isBound) {
        const isSingleton = Reflect.getMetadata(SINGLETON_SYMBOL, target);
        const instance = container.get(identifier) as T;
        // if target is a singleton or no shared container exists, return instance
        if (isSingleton || !sharedContaienr) return instance;
        // for non-singleton class, register instance, return instance from shared container
        if (!sharedContaienr.isBound(identifier)) {
          sharedContaienr.bind(identifier).toConstantValue(instance);
        }
        return sharedContaienr.get(identifier);
      }
      return new target();
    }

    const args: unknown[] = (paramTypes as any[]).map((param) =>
      resolve(param, sharedContaienr)
    );
    return new target(...args);
  };
  return resolve;
};

interface UnionResolver {
  <T extends [...ClassLike<any>[]]>(...targets: [...T]): ForArray<T>;
  (...targets: ClassLike<any>[]): any[];
}

export const createUnionResolve = (resolve: Resolver) => {
  const unionResolve: UnionResolver = (...targets: ClassLike<any>[]) => {
    const sharedContainer = new Container();
    return targets.map((target) => resolve(target, sharedContainer));
  };
  return unionResolve;
};

type ForArray<T> = T extends unknown[]
  ? T extends [infer Item, ...infer Rest]
    ? [ExtractClass<Item>, ...ForArray<Rest>]
    : T
  : T;

type ExtractClass<T> = T extends new (...args: any[]) => infer R ? R : never;
