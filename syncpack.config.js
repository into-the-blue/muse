// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      packages: ['package.json', 'packages/*', 'apps/*', 'libs/*'],
      dependencies: ['**'],
      snapTo: ['muse-monorepo'],
    },
  ],
};

module.exports = config;
