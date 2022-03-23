#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const readline = require("readline");

const validateInputs = require("./validate-inputs");
const showInfo = require("./show-info");
const updateVersion = require("./update-version");
const fastlane = require("./fastlane");

const defaultValue = {
  test: {
    env: "debug",
    version: undefined,
    os: "both",
    isAab: false,
  },
  development: {
    env: "development",
    version: undefined,
    os: "both",
    isAab: false,
  },
  staging: {
    env: "staging",
    version: undefined,
    os: "both",
    isAab: false,
  },
  release: {
    env: "production",
    version: undefined,
    os: "both",
    isAab: true,
  },
  store: {
    env: "production",
    version: undefined,
    os: "both",
    isAab: true,
  },
};

const {
  _: [lane, ...args],
  ...flags
} = argv;

try {
  validateInputs({ lane });

  //args
  const env = getArgValue("env"); // 'debug', 'development', 'staging' or 'production'
  const version = getArgValue("version"); // number version
  const buildNumber = getArgValue("buildNumber"); // build number

  // flags
  const os = getFlagValue("os"); // 'android', 'ios' or 'both'
  const isAab = getFlagValue("isAab"); // 'aab' or 'apk'
  const certificates = getFlagValue("certificates"); // 'true' or 'false'

  // function
  function getArgValue(name) {
    const found = args.find((arg) => arg.includes(name));
    if (!found) {
      return defaultValue[lane][name];
    }
    const value = found.split(":")[1];
    return value;
  }

  function getFlagValue(name) {
    if (name === "os") {
      if (flags.android && !flags.ios) {
        return "android";
      }
      if (!flags.android && flags.ios) {
        return "ios";
      }
      return defaultValue[lane].os;
    }
    if (name === "isAab") {
      if (flags.apk && !flags.aab && !flags.ios && lane !== "store") {
        return false;
      }
      if (!flags.apk && flags.aab && !flags.ios && lane === "release") {
        return true;
      }
      return !flags.ios ? defaultValue[lane].isAab : undefined;
    }

    if (name === "certificates") {
      return !!flags.certificates;
    }
  }

  // main
  const main = async () => {
    try {
      validateInputs({ os, env, version, buildNumber, flags });
      updateVersion(version, Number(buildNumber));
      console.log({
        lane,
        os,
        env,
        ...showInfo(),
        androidExtention: isAab ? "aab" : "apk",
      });

      const ok = await new Promise((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question("Deseja prosseguir? (y/n)\n", (response) => {
          rl.close();

          if (response && response.match(/[yY]/i)) {
            return resolve(true);
          }
          resolve(false);
        });
      });
      if (ok) {
        if (os === "both") {
          await fastlane("android", lane, env, false, isAab);
          fastlane("ios", lane, env, certificates);
          return;
        } else {
          fastlane(os, lane, env, certificates, isAab);
        }
      }
    } catch (e) {
      console.error(String(e));
    }
  };

  main();
} catch (e) {
  console.error(String(e));
}
