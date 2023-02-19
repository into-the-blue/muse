import { mergeWith, assign, assignWith, assignIn } from 'lodash';

console.warn(
  mergeWith({ a: ['1', '2'] }, { a: ['2', '3'] }, (obj, src) => obj.concat(src))
);
