import App from './app/App';
import { setupSentry } from './integrations/sentry';

const AppWithSentry = setupSentry(App);

export default AppWithSentry;
