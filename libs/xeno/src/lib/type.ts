import { ReplaySubject, ObservableInput } from 'rxjs';

export type TFutureTask<P = unknown> = {
  params: P;
  subject: ReplaySubject<P>;
};

export type TXenoMessage<
  Name extends string = string,
  Payload = unknown,
  Res = unknown
> = {
  name: Name;
  uniqKey?: string;
  payload: Payload;
  response?: Res;
};

export interface IXenoInjectedProps<Events extends TXenoMessage> {
  on: XenoListener<Events>;
  trigger: XenoEmitter<Events>;
}

export type RequiredObject<O> = Record<
  string | number | symbol,
  unknown
> extends O
  ? { [K in keyof O]-?: O[K] }
  : O;

export type HandlerFunction<T extends TXenoMessage, EventName = T['name']> = (
  params: Extract<T, { name: EventName }>['payload']
) => ObservableInput<unknown> | undefined | void;

export type XenoEmitter<T extends TXenoMessage, Return = unknown> = <
  E extends T['name']
>(
  name: E,
  params: Extract<T, { name: E }>['payload']
) => Return;

export type XenoListener<T extends TXenoMessage, Return = unknown> = <
  E extends T['name']
>(
  name: E,
  handler: HandlerFunction<T, E>
) => Return;
