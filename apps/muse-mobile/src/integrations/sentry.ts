import * as Sentry from '@sentry/react-native';
import Config from '../configs/sentry';

console.warn({
  Config
})
Sentry.init({
  dsn: Config.dsn,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: Config.tracesSampleRate,
});

export const setupSentry = <P>(app: React.ComponentType<P>) => {
  return Sentry.wrap(app);
};
