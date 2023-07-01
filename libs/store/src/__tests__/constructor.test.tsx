import {
  Store1,
  Service1,
  Service2,
  Store2,
  Controller1,
  useInstance,
  useUnionResolve,
} from './constructor.util';
import { renderHook } from '@testing-library/react';

test('useInstance should work', () => {
  const render = renderHook(() => useInstance(Store1));
  render.result.current.increase();
  expect(render.result.current.count).toBe(1);
  render.rerender();
  render.result.current.increase();
  expect(render.result.current.count).toBe(2);
});

test('useUnionResolve should work', () => {
  const render = renderHook(() => useUnionResolve(Store2, Service2));

  const [store2, service2] = render.result.current;
  service2.invoke();
  expect(store2.count2).toBe(2);
  render.rerender();
  const [store2_1, service2_1] = render.result.current;
  service2_1.invoke();
  expect(store2_1.count2).toBe(4);
});
