import { ReplaySubject, of, from, Observable, Subject } from 'rxjs';
import { catchError, mergeMap, switchMap, take } from 'rxjs/operators';
import {
  TFutureTask,
  TXenoMessage,
  XenoListener,
  XenoEmitter,
  HandlerFunction,
} from './type';
import { map2Array, toObservable, isDev } from './util';
const LOG = false;
const log = (
  target: 'LISTENER' | 'SENDER',
  name: string,
  ...args: unknown[]
) => {
  if (isDev && LOG) {
    console.info(`[${target}]`, name, `${new Date().toISOString()}`, ...args);
  }
};
class Handlers<Messages extends TXenoMessage> {
  _handlers: Map<HandlerFunction<Messages>, HandlerFunction<Messages>> =
    new Map();
  _name: string;
  constructor(name: string) {
    this._name = name;
  }
  addHandler = (handler: HandlerFunction<Messages>) => {
    this._handlers.set(handler, handler);
    const removeListener = () => {
      if (!this._handlers.has(handler)) return 0;
      this._handlers.delete(handler);
      log('LISTENER', this._name, 'UNLISTEN', 'REAMINING', this.numOfListeners);
      return 1;
    };
    return removeListener;
  };
  getHandlers = () => {
    return map2Array(this._handlers, (v) => v[1]);
  };
  get numOfListeners() {
    return this._handlers.size;
  }
}

export class Xeno<Messages extends TXenoMessage> {
  events: Map<Messages['name'], Handlers<Messages>> = new Map();
  _futureEvents: Map<Messages['name'], TFutureTask<Messages['payload']>> =
    new Map();

  reset = () => {
    this.events = new Map();
    this._futureEvents = new Map();
  };

  getEventsStatus = () => {
    const keyValues: {
      name: Messages['name'];
      handlers: HandlerFunction<Messages>[];
    }[] = [];
    this.events.forEach((value, key) => {
      keyValues.push({
        name: key,
        handlers: value.getHandlers(),
      });
    });
    return {
      total: this.events.size,
      keyValues,
    };
  };

  _cleanFutureEvent = <K extends Messages['name']>(name: K) => {
    // const task = this._futureEvents.get(name);
    // if (!task?.subject.closed) task?.subject.unsubscribe();
    this._futureEvents.delete(name);
  };
  _addFutureEvent = <E extends Messages['name']>(
    subject: ReplaySubject<unknown>,
    name: E,
    params: Extract<Messages, { name: E }>['payload']
  ) => {
    if (this._futureEvents.has(name)) {
      // already existed a future event, will replace the old one
      this._cleanFutureEvent(name);
    }
    this._futureEvents.set(name, {
      params,
      subject,
    });
  };
  _executeFutureEvent: XenoListener<Messages> = (name, handler) => {
    //only first listener will receive event
    const task = this._futureEvents.get(name);
    if (!task) return null;
    of(handler(task.params))
      .pipe(switchMap(toObservable))
      .subscribe({
        next: (res) => {
          if (!task.subject.closed) task.subject.next(res);
        },
        complete: () => this._cleanFutureEvent(name),
      });
  };

  _checkIfHasFutureEvent: XenoListener<Messages> = (name, handler) => {
    if (this._futureEvents.has(name)) {
      log('LISTENER', name, 'FUTURE TASK TRIGGERED');
      this._executeFutureEvent(name, handler);
    }
  };

  on: XenoListener<Messages, () => void> = (name, handler) => {
    if (!this.events.get(name)) {
      this.events.set(name, new Handlers(name));
    }
    this._checkIfHasFutureEvent(name, handler);
    const eventHandler = this.events.get(name) as Handlers<Messages>;
    const removeHandler = eventHandler.addHandler(handler);
    log('LISTENER', name, 'TOTAL', this.events.get(name)?.numOfListeners);

    const unlisten = () => {
      removeHandler();
      if (eventHandler.numOfListeners === 0) {
        this.events.delete(name);
      }
    };
    return unlisten;
  };

  /**
   *
   *
   * @memberof Xeno3
   * implementation 2: each time create a new subject
   */
  trigger: XenoEmitter<Messages, [Observable<any>, Subject<any>]> = (
    name,
    params
  ) => {
    const handlerIns = this.events.get(name);
    const sub = new ReplaySubject<any>();
    if (!handlerIns || handlerIns.numOfListeners === 0) {
      log('SENDER', name, 'FUTURE TASK');
      // no handlers
      this._addFutureEvent(sub, name, params);
      return [sub.pipe(take(1)), sub];
    }
    const handlers = handlerIns.getHandlers();
    // exist handlers
    from(
      // listeners are notified in this step
      handlers.map((_handler) => _handler(params))
    )
      .pipe(
        // if senders want to know results, this line will be executed
        mergeMap(toObservable),
        catchError((err) => of({ error: err }))
      )
      .subscribe({
        next: (res) => {
          if (!sub.closed) {
            sub.next(res);
          }
        },
      });
    log('SENDER', name, 'LISTENERS TRIGGERED', handlers.length);
    return [sub.pipe(take(handlers.length)), sub];
  };
}
