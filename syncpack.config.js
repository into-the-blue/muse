// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['dev', 'prod', 'peer'],
  source: [
    'package.json',
    'packages/*/package.json',
    'apps/*/package.json',
    'libs/*/package.json',
  ],
  semverGroups: [
    {
      range: '',
      dependencies: ['**'],
      packages: ['muse'],
    },
  ],
  versionGroups: [
    {
      label: 'All package versions should be defined in the root package.json',
      packages: ['**', '!muse'],
      dependencies: ['**'],
      snapTo: ['muse'],
    },
  ],
};

module.exports = config;
