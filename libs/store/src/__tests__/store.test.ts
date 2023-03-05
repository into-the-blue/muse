import 'reflect-metadata';
import {
  Injectable,
  resolve,
  Instantiable,
  container,
  unionResolve,
} from '../lib/store';
import { makeObservable, observable, action } from 'mobx';

@Injectable({ singleton: true })
class Store1 {
  constructor() {
    makeObservable(this, {
      count: observable,
      increase: action,
    });
  }
  count = 0;
  increase = () => {
    this.count += 1;
  };
}

@Injectable()
class Store2 {
  constructor() {
    makeObservable(this, {
      count2: observable,
      increase2: action,
    });
  }
  count2 = 0;

  increase2 = () => {
    this.count2 += 2;
  };
}

@Injectable()
class Service1 {
  store1: Store1;
  constructor(store1: Store1) {
    this.store1 = store1;
  }

  invoke = () => {
    this.store1.increase();
    console.log('[Service1]', this.store1.count);
  };
  get getCount() {
    return this.store1.count;
  }
}

@Injectable()
class Service2 {
  constructor(private store2: Store2) {}
  invoke = () => {
    this.store2.increase2();
    console.log('[Service2]', this.store2.count2);
  };
  get getCount() {
    return this.store2.count2;
  }
}

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
