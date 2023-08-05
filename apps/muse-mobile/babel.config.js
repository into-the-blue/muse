module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      'babel-plugin-transform-typescript-metadata',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
    presets: ['babel-preset-expo'],
  };
};
