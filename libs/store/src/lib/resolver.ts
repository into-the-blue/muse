import type { ClassLike } from '@muse/types';
import { Container } from 'inversify';
import { getClassSymbol } from './decorators';
import { SINGLETON_SYMBOL } from './constants';
import type { Resolver, UnionResolver, ResolveTarget } from './types';
import { isWeb } from '@muse/utils';
import { getClassFromTarget, isClass } from './util';

export const createResolver = (container: Container) => {
  const resolver: Resolver = <T>(
    target: ClassLike<T>,
    options: {
      sharedContainer?: Container;
      id?: string;
    } = {}
  ): T => {
    const { sharedContainer, id } = options;
    if (isWeb() && !isClass(target)) {
      throw new Error(`Invalid target, expect Class, but got: ${target}`);
    }
    const identifier = id ?? getClassSymbol(target); // identifier of class
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target);
    if (!paramTypes?.length) {
      // no parameters, create an instance
      const isBound = container.isBound(identifier);
      if (isBound) {
        const isSingleton = Reflect.getMetadata(SINGLETON_SYMBOL, target);
        const instance = container.get(identifier) as T;
        // if target is a singleton or no shared container exists, return instance
        if (isSingleton || !sharedContainer) return instance;
        // for non-singleton class, register instance, return instance from shared container
        if (!sharedContainer.isBound(identifier)) {
          sharedContainer.bind(identifier).toConstantValue(instance);
        }
        return sharedContainer.get(identifier);
      }
      return new target();
    }

    const args: unknown[] = paramTypes.map((param) =>
      resolver(param, {
        sharedContainer,
      })
    );
    return new target(...args);
  };
  return resolver;
};

export const createUnionResolver = (resolve: Resolver) => {
  const unionResolver: UnionResolver = (...targets: ResolveTarget[]) => {
    const sharedContainer = new Container();
    return targets.map((target) => {
      const [targetClass, id] = getClassFromTarget(target);
      return resolve(targetClass, {
        sharedContainer,
        id,
      });
    });
  };
  return unionResolver;
};
