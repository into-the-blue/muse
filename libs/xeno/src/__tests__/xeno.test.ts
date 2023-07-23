import { Xeno } from '../lib/xeno';
import { TXenoMessage } from '../lib/type';

const xeno = new Xeno<Messages>();

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

beforeEach(() => {
  xeno.reset();
});

test('Should receive message', (done) => {
  const listener = jest.fn(({ attribute, count }) => {
    expect(attribute).toBe('1');
    expect(count).toBe(2);
    const status = xeno.getEventsStatus();
    expect(status.total).toBe(1);
    unlisten();
    expect(xeno.getEventsStatus().total).toBe(0);
    done();
  });
  const unlisten = xeno.on('message2', listener);

  xeno.trigger('message2', {
    attribute: '1',
    count: 2,
  });
  expect(listener).toBeCalledTimes(1);
});

test('Should receive response from listener', (done) => {
  const unlisten = xeno.on('message3', ({ message3 }) => {
    return 'message3' + message3;
  });
  xeno.trigger('message3', { message3: 'xxx' })[0].subscribe((res) => {
    expect(res).toBe('message3xxx');
    done();
    unlisten();
  });
});
