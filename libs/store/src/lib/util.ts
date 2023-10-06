import type { ResolveTarget } from './types';
import type { ClassLike } from '@muse/types';

export const getClassFromTarget = <T>(
  target: ResolveTarget<T>
): [ClassLike<T>, string | undefined] => {
  return [
    'class' in target ? target.class : target,
    'id' in target ? target.id : undefined,
  ];
};

export const isClass = (target: new (...args: unknown[]) => unknown) => {
  return (
    typeof target === 'function' &&
    /^class\s/.test(target.prototype.constructor.toString())
  );
};
