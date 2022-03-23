#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const main = (version, buildNumber) => {
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

  if (checkVersionFormat(version)) {
    updateVersion(
      packagePath,
      /("version": )"\d+\.\d+\.\d+"/,
      `$1"${version}"`
    );
    updateVersion(
      androidPath,
      /(versionName )"\d+\.\d+\.\d+"/,
      `$1"${version}"`
    );
    updateVersion(
      iosProjectPath,
      /(MARKETING_VERSION = )\d+\.\d+\.\d+/g,
      `$1${version}`
    );
    updateVersion(
      iosInfoPath,
      /(<key>CFBundleShortVersionString<\/key>\n[\t ]+<string>)\d+\.\d+\.\d+(<\/string>)/,
      `$1${version}$2`
    );
  }

  if (checkBuildNumber(buildNumber)) {
    updateVersion(androidPath, /(versionCode )\d+/, `$1${buildNumber - 1}`);
    updateVersion(
      iosProjectPath,
      /(CURRENT_PROJECT_VERSION = )\d+/g,
      `$1${buildNumber - 1}`
    );
    updateVersion(
      iosInfoPath,
      /(<key>CFBundleVersion<\/key>\n[\t ]+<string>)\d+(<\/string>)/,
      `$1${buildNumber - 1}$2`
    );
  }

  function checkBuildNumber(buildNumber) {
    return buildNumber && /\d+/.test(buildNumber);
  }

  function checkVersionFormat(version) {
    if (!version || !/^[0-9.]*$/.test(version)) {
      return false;
    }

    const splitVersion = version.split(".");
    const filteredVersion = splitVersion.filter((item) => !!item);

    return filteredVersion.length === 3;
  }

  function updateVersion(filePath, searchValue, replaceValue) {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
    const newFileContent = fileContent.replace(searchValue, replaceValue);
    fs.writeFileSync(filePath, newFileContent, { encoding: "utf-8" });
  }
};

module.exports = main;
