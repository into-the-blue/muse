import type { XenoContextType } from './context';
import type { TXenoMessage, HandlerFunction, XenoEmitter } from './type';
import { type Context, useContext, useEffect, useMemo, useRef } from 'react';
import type { Observable, Subject } from 'rxjs';
const useIsUnmount = () => {
  const isUnmount = useRef(false);
  useEffect(() => {
    isUnmount.current = false;
    return () => {
      isUnmount.current = true;
    };
  }, []);
  return isUnmount;
};

export const createXenoHook = <T extends TXenoMessage>(
  xenoContext: Context<XenoContextType<T>>
) => {
  const useXeno = () => {
    const { xeno } = useContext(xenoContext);
    return xeno;
  };
  return useXeno;
};

export const createXenoListenerHook = <T extends TXenoMessage>(
  xenoContext: Context<XenoContextType<T>>
) => {
  const useXenoListener = <E extends T['name']>(
    event: E,
    listener: HandlerFunction<T, E>
  ) => {
    const { xeno } = useContext(xenoContext);
    const _listener = useMemo(() => listener, [listener]);
    useEffect(() => {
      const unlisten = xeno.on(event, _listener);
      return () => {
        unlisten();
      };
    }, [_listener, xeno, event]);
  };
  return useXenoListener;
};

export const createXenoTriggerHook = <T extends TXenoMessage>(
  xenoContext: Context<XenoContextType<T>>
) => {
  const useXenoTrigger = () => {
    const { xeno } = useContext(xenoContext);
    const isUnmount = useIsUnmount();
    const subjects = useRef<Subject<any>[]>([]);
    useEffect(() => {
      return () => {
        subjects.current.forEach((subject) => {
          if (subject.closed) return;
          subject.complete();
        });
      };
    }, []);
    const trigger: XenoEmitter<T, Observable<any>> = (name, params) => {
      if (isUnmount.current) {
        throw new Error('Cannot trigger event when component is unmounted');
      }
      const [obsr, subject] = xeno.trigger(name, params);
      // IMPROVE
      subjects.current.push(subject);
      return obsr;
    };
    return trigger;
  };

  return useXenoTrigger;
};
