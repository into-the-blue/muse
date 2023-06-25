import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import { ClassLike } from '@muse/types';

const CLASS_SYMBOL = Symbol('classSymbol');
const SINGLETON_SYMBOL = Symbol('isSingleton');
export const container = new Container();

const USE_SYMBOL_AS_IDENTIFIER = false;

type InjectableConfig = {
  name?: string;
  singleton?: boolean;
};
export const Injectable = (
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

const getClassSymbol = (target: ClassLike<any>) => {
  if (!USE_SYMBOL_AS_IDENTIFIER) return target;
  const storedSymbol = Reflect.getMetadata(CLASS_SYMBOL, target);
  return storedSymbol ?? Symbol.for(target.name);
};

export const checkIfContainsCircleDeps = (
  chain: ClassLike<any>[],
  nowResolving: ClassLike<any>
) => {
  const hasBeenRequired = chain.some((c) => c === nowResolving);
  return hasBeenRequired;
};

const isClass = (target: new (...args: unknown[]) => unknown) => {
  return (
    typeof target === 'function' &&
    /^class\s/.test(target.prototype.constructor.toString())
  );
};
export const resolve = <T>(
  target: ClassLike<T>,
  sharedContaienr?: Container
): T => {
  if (!isClass(target)) throw new Error('Invalid target, expect Class');
  const identifier = getClassSymbol(target); // identifier of class
  const paramTypes = Reflect.getMetadata('design:paramtypes', target);
  if (!paramTypes?.length) {
    // no parameters, create an instance
    const isBound = container.isBound(identifier);
    if (isBound) {
      const isSingleton = Reflect.getMetadata(SINGLETON_SYMBOL, target);
      const instance = container.get(identifier) as T;
      // if target is a singleton or no shared container exists, return instance
      if (isSingleton || !sharedContaienr) return instance;
      // for non-singleton class, register instance, return instance from shared container
      if (!sharedContaienr.isBound(identifier)) {
        sharedContaienr.bind(identifier).toConstantValue(instance);
      }
      return sharedContaienr.get(identifier);
    }
    return new target();
  }

  const args: unknown[] = (paramTypes as any[]).map((param) =>
    resolve(param, sharedContaienr)
  );
  return new target(...args);
};
function unionResolve<T1>(arg1: ClassLike<T1>): [T1];
function unionResolve<T1, T2>(
  arg1: ClassLike<T1>,
  arg2: ClassLike<T2>
): [T1, T2];
function unionResolve<T1, T2, T3>(
  arg1: ClassLike<T1>,
  arg2: ClassLike<T2>,
  arg3: ClassLike<T3>
): [T1, T2, T3];
function unionResolve<T1, T2, T3, T4>(
  arg1: ClassLike<T1>,
  arg2: ClassLike<T2>,
  arg3: ClassLike<T3>,
  arg4: ClassLike<T4>
): [T1, T2, T3, T4];
function unionResolve<T1, T2, T3, T4, T5>(
  arg1: ClassLike<T1>,
  arg2: ClassLike<T2>,
  arg3: ClassLike<T3>,
  arg4: ClassLike<T4>,
  arg5: ClassLike<T5>
): [T1, T2, T3, T4, T5];
function unionResolve<T extends [...ClassLike<any>[]]>(
  ...targets: [...T]
): ForArray<T>;
function unionResolve(...targets: ClassLike<any>[]): any[] {
  const sharedContainer = new Container();
  return targets.map((target) => resolve(target, sharedContainer));
}

export { unionResolve };
export const Instantiable = () => {
  return (target: ClassLike<any>) => void 0;
};

type ForArray<T> = T extends unknown[]
  ? T extends [infer Item, ...infer Rest]
    ? [ExtractClass<Item>, ...ForArray<Rest>]
    : T
  : T;

type ExtractClass<T> = T extends new (...args: any[]) => infer R ? R : never;
