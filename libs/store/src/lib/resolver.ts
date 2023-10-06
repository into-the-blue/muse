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
      idMapper?: Map<ClassLike, string>;
    } = {}
  ): T => {
    const { sharedContainer, id: _id, idMapper } = options;
    if (isWeb() && !isClass(target)) {
      throw new Error(`Invalid target, expect Class, but got: ${target}`);
    }
    const id = _id ?? idMapper?.get(target);
    const classId = getClassSymbol(target);
    const identifier = id ?? classId; // identifier of class
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target);
    if (!paramTypes?.length) {
      // no parameters, create an instance
      const isBound = container.isBound(identifier);
      if (!isBound) {
        const instance = new target();
        // if id is provided, bind to global container
        if (id) container.bind(id).toConstantValue(instance);
        return instance;
      }
      const isSingleton = Reflect.getMetadata(SINGLETON_SYMBOL, target);
      const instance = container.get(identifier) as T;
      /**
       * if
       * target is a singleton
       * or no shared container exists
       * or has id
       * return instance
       */
      if (isSingleton || !sharedContainer || id) {
        return instance;
      }
      // register instance in shared container and return it
      if (!sharedContainer.isBound(identifier)) {
        sharedContainer.bind(identifier).toConstantValue(instance);
      }
      return sharedContainer.get(identifier);
    }

    const args: unknown[] = paramTypes.map((param) =>
      resolver(param, {
        sharedContainer,
        idMapper,
      })
    );
    return new target(...args);
  };
  return resolver;
};

export const createUnionResolver = (resolve: Resolver) => {
  const unionResolver: UnionResolver = (...targets: ResolveTarget[]) => {
    const sharedContainer = new Container();
    const idMapper = new Map<ClassLike, string>();
    targets.forEach((target) => {
      const [targetClass, id] = getClassFromTarget(target);
      if (id) idMapper.set(targetClass, id);
    });
    return targets.map((target) => {
      const [targetClass, id] = getClassFromTarget(target);
      return resolve(targetClass, {
        sharedContainer,
        id,
        idMapper,
      });
    });
  };
  return unionResolver;
};
