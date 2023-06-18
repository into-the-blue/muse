import { XenoContextType } from './context';
import { createContext } from 'react';
import { TXenoMessage } from './type';
import { Xeno } from './xeno';
import {
  createXenoHook,
  createXenoListenerHook,
  createXenoTriggerHook,
} from './hooks';

const createContextEnhancer =
  <Ctx extends React.Context<V>, V>(context: Ctx, value: V) =>
  <P extends JSX.IntrinsicAttributes>(Comp: React.ComponentType<P>) => {
    const EnhancedComp = (props: P) => {
      return (
        <context.Provider value={value}>{<Comp {...props} />}</context.Provider>
      );
    };
    EnhancedComp.displayName = 'Xeno-connected-' + Comp.displayName;
    return EnhancedComp;
  };
export const constrcutXeno = <T extends TXenoMessage>() => {
  const XenoContext = createContext<XenoContextType<T>>(
    null as unknown as XenoContextType<T>
  );
  XenoContext.displayName = 'XenoContext';

  const xeno = new Xeno<T>();

  const useXeno = createXenoHook(XenoContext);
  const useXenoListener = createXenoListenerHook(XenoContext);
  const useXenoTrigger = createXenoTriggerHook(XenoContext);
  const Enhancer = createContextEnhancer(XenoContext, { xeno });
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
