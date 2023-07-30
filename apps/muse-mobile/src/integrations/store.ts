import { constructStore } from '@muse/store';
import { Container } from 'inversify';

const container = new Container();

const {
  Injectable,
  Instantiable,
  unionResolver,
  useInstance,
  useUnionResolve,
} = constructStore(container);

export {
  Injectable,
  Instantiable,
  unionResolver,
  useInstance,
  useUnionResolve,
  container,
};
