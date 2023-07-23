import { RealmWrapper } from '../integrations/realm';
import { sentryEnhancer } from '../integrations/sentry';
import { Navigation } from '../integrations/navigation';
import { Enhancer } from '@muse/types';
import { xenoEnhancer } from '../integrations/xeno';

const composeEnhancers =
  <P extends JSX.IntrinsicAttributes>(Comp: React.ComponentType<P>) =>
  (...enhancers: Enhancer[]) => {
    return enhancers.reduce(
      (Comp, enhancer) => enhancer(Comp),
      Comp
    ) as React.ComponentType<P>;
  };
const App = () => {
  return (
    <RealmWrapper>
      <Navigation />
    </RealmWrapper>
  );
};
export default composeEnhancers(App)(sentryEnhancer, xenoEnhancer);
