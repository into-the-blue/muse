import 'reflect-metadata';
import { resolve, Instantiable, container, unionResolve } from '../lib/store';
import { Service1, Service2, Store2 } from './util';

test('Resolve should work', () => {
  const instance = resolve(Service1);
  expect(instance instanceof Service1).toBe(true);
  instance.invoke();
  expect(instance.getCount).toBe(1);
});

test('Inherited class should work', () => {
  class BaseController {
    method1() {
      //
    }
    mehod2() {
      //
    }
  }
  @Instantiable()
  class Controller1 extends BaseController {
    constructor(private service1: Service1, private service2: Service2) {
      super();
    }
    invoke1 = () => {
      this.service1.invoke();
    };
    invoke2 = () => {
      this.service2.invoke();
    };
    get service1Count() {
      return this.service1.getCount;
    }
    get service2Count() {
      return this.service2.getCount;
    }
  }
  const instance = resolve(Controller1);
  expect(instance instanceof Controller1).toBeTruthy();
  instance.invoke1();
  instance.invoke2();
  expect(instance.service1Count).toBe(2);
  expect(instance.service2Count).toBe(2);
});

test('Constant registration', () => {
  const obj = {
    a: 'a',
  };
  container.bind<typeof obj>('constant').toConstantValue(obj);
  const res = container.get<typeof obj>('constant');
  expect(res.a).toBe('a');
});

test('Union resolve', () => {
  const [store2, service2] = unionResolve(Store2, Service2);
  store2.increase2();
  expect(store2.count2).toBe(2);
  expect(service2.getCount).toBe(2);
});
