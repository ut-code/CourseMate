module.exports = function (api) {
  const isEnvFile = (filename) => filename && filename.includes("env.js");
  api.cache((file) => !isEnvFile(file));
  return {
    presets: ["babel-preset-expo"],
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
