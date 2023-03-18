import Config from 'react-native-config';

export default {
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: parseFloat(Config.SENTRY_TRACE_SAMPLE_RATE),
};
