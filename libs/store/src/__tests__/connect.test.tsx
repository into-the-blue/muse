import { connectStores } from '../lib/connect';
import { Controller1, Store1 } from './util';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
const Comp1 = ({
  store1,
  controller,
}: {
  store1: Store1;
  controller: Controller1;
}) => {
  return (
    <div>
      <div>Count: {store1.count}</div>
      <button onClick={controller.invoke1}>{'increase'}</button>
    </div>
  );
};
const ConnectedComp1 = connectStores({
  store1: Store1,
  controller: Controller1,
})(Comp1);

test('Connection should work', () => {
  const { getByText } = render(<ConnectedComp1 />);
  expect(getByText('Count: 0')).toBeInTheDocument();
  fireEvent.click(getByText('increase'));
  expect(getByText('Count: 1')).toBeInTheDocument();
});

// @TODO test mount, unmount