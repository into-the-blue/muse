import { Container } from 'inversify';
import { ClassLike } from '@muse/types';
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
  sharedContaienr?: Container
) => T;

type ForArray<T> = T extends unknown[]
  ? T extends [infer Item, ...infer Rest]
    ? [ExtractClass<Item>, ...ForArray<Rest>]
    : T
  : T;

type ExtractClass<T> = T extends new (...args: any[]) => infer R ? R : never;

export interface UnionResolver {
  <T extends [...ClassLike<any>[]]>(...targets: [...T]): ForArray<T>;
  (...targets: ClassLike<any>[]): any[];
}

export type StoreContextType = React.Context<{
  container: Container;
  resolver: Resolver;
  unionResolver: UnionResolver;
}>;

export type InjectableConfig = {
  name?: string;
  singleton?: boolean;
};
