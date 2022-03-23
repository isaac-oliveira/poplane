#!/usr/bin/env node

const supportedValues = {
  os: ["android", "ios", "both"],
  lane: ["test", "development", "staging", "release", "store"],
  env: ["debug", "development", "staging", "production"],
};

const regexValues = {
  version: /\d+.\d+.\d+/,
  buildNumber: /^[0-9]*$/,
};

const messages = {
  os: "'android', 'ios' or 'both'",
  lane: "'test', 'development', 'staging', 'release' or 'store'",
  env: "'debug', 'development', 'staging' or 'production'",
  version: "should be X.X.X",
  buildNumber: "should be only numbers",
};

const main = (values) => {
  const keys = Object.keys(values);
  keys.map((key) => {
    const value = values[key];
    const message = messages[key];
    const supported = supportedValues[key];

    if (!supported) {
      const regex = regexValues[key];
      if (!regex) {
        if (value.apk && value.aab) {
          console.log(
            "You passed the '--apk' and '--aab' flags, this will be considered the default lane value"
          );
        }
        if (value.ios && value.android) {
          console.log(
            "If you want to build a version for both platforms, you can omit the '--android' and '--ios' flags"
          );
        }

        return;
      }
      if (value && !regex.test(value)) {
        throw new Error(`You must provide a valid '${key}' (${message})`);
      }
      return;
    }
    if (value && !supported.includes(value)) {
      throw new Error(`You must provide a valid '${key}' (${message})`);
    }
  });
};

module.exports = main;
