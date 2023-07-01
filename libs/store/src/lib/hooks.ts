import { useContext, useMemo } from 'react';
import { StoreContextType, UnionResolver } from './types';
import { ClassLike } from '@muse/types';

export const createUseSingletonHook = (context: StoreContextType) => {
  const useSingleton = <T>(storeClass: ClassLike<T>) => {
    const { resolver } = useContext(context);
    const result = useMemo(() => {
      return resolver(storeClass);
    }, [storeClass, resolver]);
    return result;
  };

  return useSingleton;
};

export const createUseUnionResolveHook = (context: StoreContextType) => {
  const useUnionResolve: UnionResolver = (...classes: any[]) => {
    const { unionResolver } = useContext(context);
    const results = useMemo(() => {
      return unionResolver(...classes);
    }, [unionResolver, classes]);
    return results;
  };
  return useUnionResolve;
};
