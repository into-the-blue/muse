import { useContext } from 'react';
import { StoreContextType } from './types';

export const createUseStoreHook = (context: StoreContextType) => {
  const useStore = () => {
    const container = useContext(context);
  };
};
