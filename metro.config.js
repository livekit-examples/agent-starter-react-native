const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro resolves package.json "exports" per import syntax: ESM `import`s get the
// "import" condition and CJS `require`s get the "require" condition. These packages
// are imported both ways (app code uses `import`, the precompiled CommonJS build of
// @livekit/react-native uses `require`), which puts both builds in the bundle and
// duplicates stateful singletons like RoomContext, breaking useRoomContext().
// Pin them to a single build.
const DUAL_BUILD_PACKAGES = ['livekit-client', '@livekit/components-react'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    DUAL_BUILD_PACKAGES.some(
      (pkg) => moduleName === pkg || moduleName.startsWith(`${pkg}/`)
    )
  ) {
    return context.resolveRequest(
      { ...context, isESMImport: true },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
