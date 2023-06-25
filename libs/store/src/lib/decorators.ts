import 'reflect-metadata';
import { InjectableConfig } from './types';
import { ClassLike } from '@muse/types';
import { Container, injectable } from 'inversify';
import {
  USE_SYMBOL_AS_IDENTIFIER,
  CLASS_SYMBOL,
  SINGLETON_SYMBOL,
} from './constants';

export const createInjectable =
  (container: Container) =>
  (
    { name, singleton }: InjectableConfig = {
      name: undefined,
      singleton: false,
    }
  ) => {
    return (target: ClassLike<any>) => {
      const res = injectable()(target);
      let classIdentifier = USE_SYMBOL_AS_IDENTIFIER
        ? Symbol.for(target.name)
        : target;
      if (typeof name !== 'undefined' && USE_SYMBOL_AS_IDENTIFIER) {
        classIdentifier = Symbol(name);
        Reflect.defineMetadata(CLASS_SYMBOL, classIdentifier, target);
      }
      Reflect.defineMetadata(SINGLETON_SYMBOL, !!singleton, target);
      const bind = container.bind<typeof target>(classIdentifier).to(target);
      if (singleton) bind.inSingletonScope();

      return res;
    };
  };

export const createInstantiable = () => () => {
  return (target: ClassLike<any>) => void 0;
};

export const getClassSymbol = (target: ClassLike<any>) => {
  if (!USE_SYMBOL_AS_IDENTIFIER) return target;
  const storedSymbol = Reflect.getMetadata(CLASS_SYMBOL, target);
  return storedSymbol ?? Symbol.for(target.name);
};
