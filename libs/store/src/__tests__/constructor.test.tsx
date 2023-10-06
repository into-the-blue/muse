import {
  Store1,
  Service1,
  Service2,
  Store2,
  Controller1,
  useInstance,
  useUnionResolve,
  container,
} from './constructor.util';
import { renderHook } from '@testing-library/react';

describe('store constructor', () => {
  afterEach(() => {
    if (container.isBound('store1')) container.unbind('store1');
    if (container.isBound('store2')) container.unbind('store2');
  });
  test('useInstance should work', () => {
    const render = renderHook(() => useInstance(Store1));
    render.result.current.increase();
    expect(render.result.current.count).toBe(1);
    render.rerender();
    render.result.current.increase();
    expect(render.result.current.count).toBe(2);
  });

  test('global target should work', () => {
    const render = renderHook(() => useInstance(Store1));
    expect(render.result.current.count).toBe(2);
  });

  test('resolve global target with id', () => {
    const render1 = renderHook(() =>
      useInstance({
        class: Store1,
        id: 'store1',
      })
    );
    expect(render1.result.current.count).toBe(0);
    render1.result.current.increase();
    const render2 = renderHook(() =>
      useInstance({
        class: Store1,
        id: 'store1',
      })
    );
    expect(render2.result.current.count).toBe(1);
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

  test('resolve with id', () => {
    const render = renderHook(() =>
      useInstance({
        class: Store2,
        id: 'store2',
      })
    );
    const store2 = render.result.current;
    store2.increase2();
    expect(store2.count2).toBe(2);
    render.unmount();
    const render2 = renderHook(() =>
      useUnionResolve(
        {
          class: Store2,
          id: 'store2',
        },
        Service2
      )
    );
    const [store2_1, service2_1] = render2.result.current;
    service2_1.invoke();
    expect(store2_1.count2).toBe(4);
    expect(store2.count2).toBe(4);
  });
});
