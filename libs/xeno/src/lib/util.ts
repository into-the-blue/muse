import { from, of, isObservable, type ObservableInput } from 'rxjs';
export const isPromise = <T>(obj: T) => {
  return String(obj) === '[object Promise]';
};

export const toObservable = <T>(res: ObservableInput<T> | undefined | void) => {
  if (isObservable(res)) return res;
  return isPromise(res) ? from(res as Promise<unknown>) : of(res);
};
export const zip = <T, T2>(arr1: T[], arr2: T2[]): [T, T2][] => {
  const maxLen = Math.max(arr1.length, arr2.length);
  const res: [T, T2][] = [];
  for (let i = 0; i < maxLen; i++) {
    res.push([arr1[i], arr2[i]]);
  }
  return res;
};

export const map2Array = <K, V, T>(
  _map: Map<K, V>,
  valueExtractor: (v: [K, V]) => T
) => {
  const res: T[] = [];
  const entries = _map.entries();
  for (const [key, value] of entries) {
    res.push(valueExtractor([key, value]));
  }
  return res;
};
export const isDev = process.env.NODE_ENV === 'development';
