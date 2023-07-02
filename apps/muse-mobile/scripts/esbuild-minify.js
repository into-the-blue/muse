const esbuild = require('esbuild');
function minify({ code, map, reserved, config }) {
  // easiest package ever lol
  const minified = esbuild.transformSync(code, {
    minify: true,
    legalComments: 'none',
    ...config,
  });
  return minified;
}

module.exports = minify
