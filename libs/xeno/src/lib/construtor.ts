import { XenoContextType } from './context';
import { createContext, useContext } from 'react';
import { TXenoMessage } from './type';
import { Xeno } from './xeno';
import {
  createXenoHook,
  createXenoListenerHook,
  createXenoTriggerHook,
} from './hooks';

export const constrcutXeno = <T extends TXenoMessage>() => {
  const XenoContext = createContext<XenoContextType<T>>(
    null as unknown as XenoContextType<T>
  );
  XenoContext.displayName = 'XenoContext';

  const xeno = new Xeno<T>();

  const useXeno = createXenoHook(XenoContext);
  const useXenoListener = createXenoListenerHook(XenoContext);
  const useXenoTrigger = createXenoTriggerHook(XenoContext);

  return {
    XenoContext,
    xeno,
    useXeno,
    useXenoListener,
    useXenoTrigger,
  };
};
