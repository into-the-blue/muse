import { useContext, useMemo, useRef } from 'react';
import type { StoreContextType, UnionResolver, ResolveTarget } from './types';
import { getClassFromTarget } from './util';

export const createUseSingletonHook = (context: StoreContextType) => {
  const useSingleton = <T>(target: ResolveTarget<T>) => {
    const { resolver } = useContext(context);
    const _result = useRef<T>();
    const result = useMemo(() => {
      if (_result.current) return _result.current;
      const [storeClass, id] = getClassFromTarget(target);
      _result.current = resolver(storeClass, {
        id,
      });
      return _result.current;
    }, [target, resolver]);
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
