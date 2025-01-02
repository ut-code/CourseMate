export type Config = {
  origins: string[]; // allowed origins
  methods?: string[]; // Access-Control-Allow-Methods
  credentials?: boolean; // Access-Control-Allow-Credentials
};

// make the cors config valid.
// throws error if unrecoverable.
function validateConfig(config: Config) {
  config.credentials = !!config.credentials; // make it boolean. not using Boolean() or new Boolean() because I don't trust JS

  // normalize allowOrigin URLs
  config.origins = config.origins.map((origin) => {
    const url = new URL(origin);
    if (url.origin === "null") {
      console.log(
        `invalid URL: ${origin}. Please prefix this with http:// or https:// if you haven't.`,
      );
      throw "";
    }
    return url.origin;
  });

  if (!config.methods) config.methods = []; // provide default

  // they must be uppercase
  config.methods = config.methods.map((method) => method.toUpperCase());

  // GET and HEAD must be in this field. POST is for convenience.
  // ref: not found
  const defaultAllowedMethods = ["GET", "HEAD", "POST"];
  for (const defaultMethod of defaultAllowedMethods) {
    if (!config.methods.includes(defaultMethod)) {
      config.methods.push(defaultMethod);
    }
  }

  assertValidConfig(config);
}

// this throws error if config is not good
function assertValidConfig(config: Config) {
  if (config.origins.length === 0) {
    throw new Error(
      `Empty allowedOrigins in CORS config: ${JSON.stringify(config)}`,
    );
  }
}

export { validateConfig };
