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
