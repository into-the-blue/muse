export const isRN = () => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return true;
  }
  return false;
};

export const isWeb = () => {
  if (typeof document !== 'undefined') {
    return true;
  }
  return false;
};

export class ENV {
  static get isDev() {
    if (isRN()) {
      return __DEV__;
    }
    return process.env['NODE_ENV'] === 'development';
  }
  static get isProd() {
    if (isRN()) {
      return !__DEV__;
    }
    return process.env['NODE_ENV'] === 'production';
  }
}
