import type { InjectableConfig } from './types';

export const CLASS_SYMBOL = Symbol('classSymbol');
export const SINGLETON_SYMBOL = Symbol('isSingleton');
export const USE_SYMBOL_AS_IDENTIFIER = false;

export const DEFAULT_INJECTABLE_CONFIG: InjectableConfig = {
  name: undefined,
  singleton: false,
};
