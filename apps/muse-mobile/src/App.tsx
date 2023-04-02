import App from './app';
import { setupSentry } from './integrations/sentry';

const AppWithSentry = setupSentry(App);

export default AppWithSentry;
