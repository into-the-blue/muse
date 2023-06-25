import { Container } from 'inversify';
export class BaseController {
  componentDidMount() {
    //
  }
  componentWillUnmount() {
    //
  }
}

export type StoreContextType = React.Context<Container>;


export type InjectableConfig = {
  name?: string;
  singleton?: boolean;
};