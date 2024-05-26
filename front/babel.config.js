module.exports = function (api) {
  api.cache(true);
  const isEnvFile = (filename) => filename && filename.includes("env.js");
  return {
    presets: ["babel-preset-expo"],
    overrides: [
      {
        test: isEnvFile,
        cache: false,
      },
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          safe: true,
        },
      ],
    ],
  };
};
