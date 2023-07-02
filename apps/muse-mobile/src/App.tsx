import App from './main';
import { setupSentry } from './integrations/sentry';

const AppWithSentry = setupSentry(App);

export default AppWithSentry;
