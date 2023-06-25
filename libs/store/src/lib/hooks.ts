import { useContext } from 'react';
import { StoreContextType } from './types';
import { ClassLike } from '@muse/types';

export const createUseStoreHook = (context: StoreContextType) => {
  const useStore = <T>(storeClass: ClassLike<T>) => {
    const container = useContext(context);
  };
};
