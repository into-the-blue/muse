import { useContext, useMemo, useRef } from 'react';
import type { StoreContextType, UnionResolver } from './types';
import type { ClassLike } from '@muse/types';

export const createUseSingletonHook = (context: StoreContextType) => {
  const useSingleton = <T>(storeClass: ClassLike<T>) => {
    const { resolver } = useContext(context);
    const _result = useRef<T>();
    const result = useMemo(() => {
      if (_result.current) return _result.current;
      _result.current = resolver(storeClass);
      return _result.current;
    }, [storeClass, resolver]);
    return result;
  };

  return useSingleton;
};

export const createUseUnionResolveHook = (context: StoreContextType) => {
  const useUnionResolve: UnionResolver = (...classes: any[]) => {
    const { unionResolver } = useContext(context);
    const classRef = useRef(classes);
    const _results = useRef<any[]>();
    const results = useMemo(() => {
      if (_results.current) return _results.current;
      _results.current = unionResolver(...classRef.current);
      return _results.current;
    }, [unionResolver]);
    return results;
  };
  return useUnionResolve;
};
