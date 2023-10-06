import 'reflect-metadata';
import type { InjectableConfig } from './types';
import type { ClassLike } from '@muse/types';
import type { Container } from 'inversify';
import { injectable } from 'inversify';
import {
  USE_SYMBOL_AS_IDENTIFIER,
  CLASS_SYMBOL,
  SINGLETON_SYMBOL,
  DEFAULT_INJECTABLE_CONFIG,
} from './constants';

const getClassIdentifier = (target: ClassLike<any>, name?: string) => {
  if (!USE_SYMBOL_AS_IDENTIFIER) return target;
  if (typeof name !== 'undefined') return Symbol(name);
  return Symbol.for(target.name);
};

export const getClassSymbol = (target: ClassLike<any>) => {
  if (!USE_SYMBOL_AS_IDENTIFIER) return target;
  const storedSymbol: symbol | string = Reflect.getMetadata(
    CLASS_SYMBOL,
    target
  );
  return storedSymbol ?? Symbol.for(target.name);
};

export const createInjectable =
  (
    container: Container,
    defaultConfig: InjectableConfig = DEFAULT_INJECTABLE_CONFIG
  ) =>
  ({ name, singleton }: InjectableConfig = defaultConfig) => {
    const Injectable = (target: ClassLike<any>) => {
      const res = injectable()(target);
      const classIdentifier = getClassIdentifier(target, name);
      if (typeof name !== 'undefined' && USE_SYMBOL_AS_IDENTIFIER) {
        Reflect.defineMetadata(CLASS_SYMBOL, classIdentifier, target);
      }
      Reflect.defineMetadata(SINGLETON_SYMBOL, !!singleton, target);
      const bind = container.bind<typeof target>(classIdentifier).to(target);
      if (singleton) bind.inSingletonScope();

      return res;
    };
    return Injectable;
  };

export const createInstantiable = () => {
  const Instantiable = () => {
    return (target: ClassLike<any>) => void 0;
  };
  return Instantiable;
};
