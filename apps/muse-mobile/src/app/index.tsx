import { RealmWrapper } from '../integrations/realm';
import { setupSentry } from '../integrations/sentry';
import { Navigation } from '../integrations/navigation';

const App = () => {
  return (
    <RealmWrapper>
      <Navigation />
    </RealmWrapper>
  );
};
export default setupSentry(App);
