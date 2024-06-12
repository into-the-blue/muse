import 'reflect-metadata';
import { RealmWrapper } from '../integrations/realm';
import { sentryEnhancer } from '../integrations/sentry';
import { Navigation } from '../integrations/navigation';
import { xenoEnhancer } from '../integrations/xeno';
import { storeEnhancer } from '../integrations/store';
import { safeAreaEnhancer } from '../integrations/safeArea';
import { composeEnhancers } from '@muse/utils';

const App = () => {
  return (
    <RealmWrapper>
      <Navigation />
    </RealmWrapper>
  );
};
export default composeEnhancers(App)(
  sentryEnhancer,
  xenoEnhancer,
  storeEnhancer,
  safeAreaEnhancer
);
