import { constrcutXeno } from '../lib/construtor';
import type { TXenoMessage } from '../lib/type';
import { renderHook } from '@testing-library/react';
jest.useFakeTimers();

const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
type Message1 = TXenoMessage<'message1', undefined>;

type Message2 = TXenoMessage<
  'message2',
  {
    attribute: string;
    count: number;
  },
  string
>;

type Message3 = TXenoMessage<
  'message3',
  {
    message3: string;
  },
  string
>;

type Messages = Message2 | Message1 | Message3;

const { useXeno, XenoContext, useXenoListener, useXenoTrigger, xeno } =
  constrcutXeno<Messages>();

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <XenoContext.Provider
      value={{
        xeno,
      }}
    >
      {children}
    </XenoContext.Provider>
  );
};
beforeEach(() => {
  xeno.reset();
});

test('useXeno', () => {
  const res = renderHook(() => useXeno(), { wrapper });
  expect(res.result.current).toEqual(xeno);
});

describe('useXenoListener', () => {
  test('listener should work', () => {
    const callback = jest.fn();

    renderHook(() => useXenoListener('message1', callback), {
      wrapper,
    });
    xeno.trigger('message1', undefined);
    expect(callback).toBeCalledTimes(1);
  });

  test('unmount should unlisten', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(
      () => useXenoListener('message1', callback),
      { wrapper }
    );
    xeno.trigger('message1', undefined);
    unmount();
    xeno.trigger('message1', undefined);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('useXenoTrigger', () => {
  test('should work', () => {
    const callback = jest.fn();

    renderHook(() => useXenoListener('message1', callback), {
      wrapper,
    });
    const res = renderHook(() => useXenoTrigger(), {
      wrapper,
    });
    res.result.current('message1', undefined);
    expect(callback).toBeCalledTimes(1);
  });

  test('unmount', () => {
    const callback = jest.fn();

    renderHook(() => useXenoListener('message1', callback), {
      wrapper,
    });
    const res = renderHook(() => useXenoTrigger(), {
      wrapper,
    });
    res.result.current('message1', undefined);
    res.unmount();
    expect(callback).toBeCalledTimes(1);
    expect(() => res.result.current('message1', undefined)).toThrowError();
  });

  test('unmount should close subscription', async () => {
    const mockCallback = jest.fn().mockResolvedValue('1');
    renderHook(
      () =>
        useXenoListener('message1', async () => {
          await sleep(100);
          return mockCallback();
        }),
      {
        wrapper,
      }
    );
    const res = renderHook(() => useXenoTrigger(), {
      wrapper,
    });

    const mockNext = jest.fn();
    const mockComplete = jest.fn();
    const sub = res.result.current('message1', undefined).subscribe({
      next: mockNext,
      complete: mockComplete,
    });
    res.unmount();
    jest.runAllTimersAsync();
    await sleep(100);
    jest.advanceTimersByTimeAsync(100);
    expect(mockNext).toBeCalledTimes(0);
    expect(mockComplete).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledTimes(1);
    expect(sub.closed).toBeTruthy();
  });
});
