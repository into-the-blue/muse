import type { Xeno } from './xeno';
import type { TXenoMessage } from './type';
export type XenoContextType<T extends TXenoMessage> = {
  xeno: Xeno<T>;
};
