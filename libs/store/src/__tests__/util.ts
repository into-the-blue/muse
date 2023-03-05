import { Injectable, Instantiable } from '../lib/store';
import { makeObservable, observable, action } from 'mobx';
@Injectable({ singleton: true })
export class Store1 {
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
export class Store2 {
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
export class Service1 {
  store1: Store1;
  constructor(store1: Store1) {
    this.store1 = store1;
  }

  invoke = () => {
    this.store1.increase();
  };
  get getCount() {
    return this.store1.count;
  }
}

@Injectable()
export class Service2 {
  constructor(private store2: Store2) {}
  invoke = () => {
    this.store2.increase2();
  };
  get getCount() {
    return this.store2.count2;
  }
}

@Instantiable()
export class Controller1 {
  constructor(private service1: Service1, private service2: Service2) {}
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
