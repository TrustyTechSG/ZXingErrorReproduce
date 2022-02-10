const {
  withProjectBuildGradle,
  withPlugins,
} = require('@expo/config-plugins');

function setMinSdkVersion(buildGradle, minVersion) {
  const regexpMinSdkVersion = /\bminSdkVersion\s*=\s*(\d+)/;
  const match = buildGradle.match(regexpMinSdkVersion);

  if (match) {
    const version = parseInt(match[1], 10);

    if (version < minVersion) {
      buildGradle = buildGradle.replace(
        /\bcompileSdkVersion\s*=\s*\d+/,
        `compileSdkVersion = ${minVersion}`
      );
    } else {
      console.warn(`WARN: minSdkVersion is already >= ${version}`);
    }
  }

  return buildGradle;
}

const withMinSdkVersion = (config, { minSdkVersion } = {}) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = setMinSdkVersion(
        config.modResults.contents,
        minSdkVersion
      );
    } else {
      throw new Error(
        "Can't set minSdkVersion in the project build.gradle, because it's not groovy"
      );
    }
    return config;
  });
};

module.exports = (config, props) =>
  withPlugins(config, [
    [withMinSdkVersion, props],
  ]);