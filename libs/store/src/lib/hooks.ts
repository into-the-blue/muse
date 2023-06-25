import { useContext } from 'react';
import { StoreContextType } from './types';
import { ClassLike } from '@muse/types';

export const createUseSingletonHook = (context: StoreContextType) => {
  const useSingleton = <T>(storeClass: ClassLike<T>) => {
    const container = useContext(context);
  };
};

export const createUseStoreHook = (context: StoreContextType) => {
  const useStore = <T>(storeClass: ClassLike<T>) => {
    const container = useContext(context);
  };
};
