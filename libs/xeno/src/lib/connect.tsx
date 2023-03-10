import { useEffect, useRef } from "react";
import { Xeno } from "./xeno";
import { TXenoMessage, XenoEmitter, XenoListener } from "./type";
import React from "react";
import { Observable } from "rxjs";
export const connectXeno =
  <T extends TXenoMessage>(xeno: Xeno<T>) =>
  <
    P extends {
      on: XenoListener<T, () => void>;
      trigger: XenoEmitter<T, Observable<any>>;
    } & JSX.IntrinsicAttributes
  >(
    Comp: React.ComponentType<P>
  ) => {
    const EnhancedComp = (props: Omit<P, "on" | "trigger">) => {
      const unlistens = useRef<(()=>void)[]>([]);
      const on: XenoListener<T, () => void> = (eventName, handler) => {
        const unlisten = xeno.on(eventName, handler);
        unlistens.current.push(unlisten);
        return unlisten;
      };
      useEffect(() => {
        const cleanListeners = () => {
          unlistens.current.forEach((func) => func());
        };
        return cleanListeners;
      }, []);
      const _props = {
        ...props,
        on,
        trigger: xeno.trigger,
      } as P;
      return <Comp {..._props} />;
    };
    EnhancedComp.displayName = "Xeno-connected-" + Comp.displayName;
    return EnhancedComp;
  };
