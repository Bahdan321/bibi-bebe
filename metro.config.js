const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
// Оптимизация какая-то
config.transformer.minifierConfig.compress = { drop_console: false };
// Для фикса
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
