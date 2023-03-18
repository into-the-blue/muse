const { withNxMetro } = require('@nrwl/react-native');
const { getDefaultConfig } = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
// const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return withNxMetro(
    {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        }),
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
      },
      resolver: {
        // resolveRequest: MetroSymlinksResolver(), // https://microsoft.github.io/rnx-kit/docs/tools/metro-resolver-symlinks
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
        blockList: exclusionList([/^(?!.*node_modules).*\/dist\/.*/]),
      },
    },
    {
      // Change this to true to see debugging info.
      // Useful if you have issues resolving modules
      debug: false,
      // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
      extensions: [],
      // the project root to start the metro server
      projectRoot: __dirname,
      // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
      watchFolders: [],
    }
  );
})();
