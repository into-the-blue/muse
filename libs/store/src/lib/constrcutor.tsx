import { Container } from 'inversify';
import { createContext } from 'react';
export const constructStore = (container: Container) => {
  const context = createContext<Container>(container);
};
