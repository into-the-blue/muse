import { createContext, useContext } from 'react';
import { Xeno } from './xeno';
import { TXenoMessage } from './type';
export type XenoContextType<T extends TXenoMessage> = {
  xeno: Xeno<T>;
};
