// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ['dev', 'prod', 'peer'],
  versionGroups: [
    {
      packages: ['packages/*', 'apps/*', 'libs/*'],
      dependencies: ['**'],
      snapTo: ['muse-monorepo'],
    },
  ],
};

module.exports = config;
