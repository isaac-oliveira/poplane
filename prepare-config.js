#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const androidPath = path.join(__dirname, "..", "..", "android", "app");

const configApk = path.join(androidPath, "dexprotector-config-apk.xml");
const configAab = path.join(androidPath, "dexprotector-config-aab.xml");
const configPlaystore = path.join(
  androidPath,
  "dexprotector-config-playstore.xml"
);
const newConfig = path.join(androidPath, "dexprotector-config.xml");

const prepareConfig = (lane, isAab) => {
  try {
    if (lane === "store") {
      const fileContent = fs.readFileSync(configPlaystore, {
        encoding: "utf-8",
      });
      fs.writeFileSync(newConfig, fileContent, { encoding: "utf-8" });
      return;
    }

    if (lane === "release" && isAab) {
      const fileContent = fs.readFileSync(configAab, { encoding: "utf-8" });
      fs.writeFileSync(newConfig, fileContent, { encoding: "utf-8" });
      return;
    }
    const fileContent = fs.readFileSync(configApk, { encoding: "utf-8" });
    fs.writeFileSync(newConfig, fileContent, { encoding: "utf-8" });
  } catch (e) {
    console.log("Não foram encontradas outras configurações do dexprotector");
  }
};

module.exports = prepareConfig;
