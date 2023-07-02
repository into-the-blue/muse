// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['dev', 'prod', 'peer'],
  source: [
    'packages/*/package.json',
    'apps/*/package.json',
    'libs/*/package.json',
    'package.json',
  ],
  semverGroups: [
    {
      range: '~',
      dependencies: ['**'],
      packages: ['muse'],
    },
    {
      packages: ['@muse/*'],
      isIgnored: true,
      dependencies: ['**'],
    },
  ],
  versionGroups: [
    {
      packages: ['@muse/note-spider'],
      dependencies: ['**'],
      isIgnored: true,
    },
    {
      packages: ['@muse/*', 'muse'],
      dependencies: ['**'],
      snapTo: ['muse'],
    },
  ],
};

module.exports = config;
