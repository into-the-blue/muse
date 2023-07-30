import type { XenoContextType } from './context';
import { createContext } from 'react';
import type { TXenoMessage } from './type';
import { Xeno } from './xeno';
import {
  createXenoHook,
  createXenoListenerHook,
  createXenoTriggerHook,
} from './hooks';
import { createContextEnhancer } from '@muse/utils';

export const constrcutXeno = <T extends TXenoMessage>() => {
  const XenoContext = createContext<XenoContextType<T>>(
    null as unknown as XenoContextType<T>
  );
  XenoContext.displayName = 'XenoContext';

  const xeno = new Xeno<T>();

  const useXeno = createXenoHook(XenoContext);
  const useXenoListener = createXenoListenerHook(XenoContext);
  const useXenoTrigger = createXenoTriggerHook(XenoContext);
  const Enhancer = createContextEnhancer(
    XenoContext,
    { xeno },
    'Xeno-connected-'
  );
  return {
    XenoContext,
    xeno,
    useXeno,
    useXenoListener,
    useXenoTrigger,
    Provider: XenoContext.Provider,
    Enhancer,
  };
};
