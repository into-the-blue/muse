// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['dev', 'prod', 'peer'],
  source: [
    'packages/*/package.json',
    'apps/*/package.json',
    'libs/*/package.json',
  ],
  versionGroups: [
    // {
    //   packages: ['**'],
    //   dependencies: ['**'],
    //   snapTo: ['muse'],
    // },
  ],
};

module.exports = config;
