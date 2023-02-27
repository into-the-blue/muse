import { render } from '@testing-library/react';

import Xeno from './xeno';

describe('Xeno', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Xeno />);
    expect(baseElement).toBeTruthy();
  });
});
