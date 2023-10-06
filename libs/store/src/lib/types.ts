import type { Container } from 'inversify';
import type { ClassLike } from '@muse/types';
export class BaseController {
  componentDidMount() {
    //
  }
  componentWillUnmount() {
    //
  }
}

export type Resolver = <T>(
  target: ClassLike<T>,
  options?: {
    sharedContainer?: Container;
    id?: string;
  }
) => T;

type ForArray<T> = T extends unknown[]
  ? T extends [infer Item, ...infer Rest]
    ? [ExtractClass<GetTargetClass<Item>>, ...ForArray<Rest>]
    : T
  : T;

type GetTargetClass<T> = T extends { class: infer C } ? C : T;
type ExtractClass<T> = T extends new (...args: any[]) => infer R ? R : never;

export interface UnionResolver {
  <T extends [...ResolveTarget[]]>(...targets: [...T]): ForArray<T>;
  (...targets: ResolveTarget[]): any[];
}

export type StoreContextValue = {
  container: Container;
  resolver: Resolver;
  unionResolver: UnionResolver;
};

export type StoreContextType = React.Context<StoreContextValue>;

export type InjectableConfig = {
  name?: string;
  singleton?: boolean;
};

export type ResolveTarget<T = any> =
  | ClassLike<T>
  | {
      class: ClassLike<T>;
      id: string;
    };
