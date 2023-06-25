import { useContext } from 'react';
import { StoreContextType, UnionResolver } from './types';
import { ClassLike } from '@muse/types';

export const createUseSingletonHook = (context: StoreContextType) => {
  const useSingleton = <T>(storeClass: ClassLike<T>) => {
    const { resolver } = useContext(context);
    return resolver(storeClass);
  };

  return useSingleton;
};

export const createUseUnionResolveHook = (context: StoreContextType) => {
  const useUnionResolve: UnionResolver = (...classes: any[]) => {
    const { unionResolver } = useContext(context);
    return unionResolver(...classes);
  };
  return useUnionResolve;
};
