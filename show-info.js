#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const main = () => {
  const packagePath = path.join(__dirname, "..", "package.json");
  const androidPath = path.join(
    __dirname,
    "..",
    "android",
    "app",
    "build.gradle"
  );
  const iosInfoPath = path.join(
    __dirname,
    "..",
    "ios",
    "tkslojista",
    "Info.plist"
  );
  const iosProjectPath = path.join(
    __dirname,
    "..",
    "ios",
    "tkslojista.xcodeproj",
    "project.pbxproj"
  );

  let iOSVersion;
  const packageVersion = getVersion(
    packagePath,
    /(?!"version": ")(\d+\.\d+\.\d+)/
  );
  const androidVersion = getVersion(
    androidPath,
    /(?!versionName ")(\d+\.\d+\.\d+)/
  );
  iOSVersion = getVersion(
    iosInfoPath,
    /(?!<key>CFBundleShortVersionString<\/key>\n[\t ]+<string>)(\d+\.\d+\.\d+)/
  );
  if (!iOSVersion) {
    iOSVersion = getVersion(
      iosProjectPath,
      /(?!MARKETING_VERSION = )(\d+\.\d+\.\d+)/
    );
  }

  return { packageVersion, androidVersion, iOSVersion };
};

function getVersion(filePath, search) {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const found = fileContent.match(search);
  if (!found) {
    return undefined;
  }
  return found[0];
}

module.exports = main;
