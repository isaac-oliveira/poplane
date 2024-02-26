#!/usr/bin/env node

const defaultValue = require("./default-value");

const main = (lane, args, flags) => {
  const getValue = {
    getArgValue: (name) => {
      const found = args.find((arg) => arg.includes(name));
      if (!found) {
        return defaultValue[lane][name];
      }
      const value = found.split(":")[1];
      return value;
    },
    getFlagValue: (name) => {
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
    },
  };

  return getValue;
};

module.exports = main;
