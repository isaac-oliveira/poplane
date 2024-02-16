#!/usr/bin/env node

const projectPaths = require("./project-paths");
const fs = require("fs");

const {
  packageFilePath,
  androidGradleAppFile,
  iosInfoplistFile,
  iosXcodeprojFile,
} = projectPaths;

const filesInfo = {
  android: {
    version: /(versionName ")\d+\.\d+\.\d+/,
    buildNumber: /(versionCode )\d+/,
    path: androidGradleAppFile,
  },
  iosInfoplist: {
    version:
      /(<key>CFBundleShortVersionString<\/key>.*[\n]*.*<string>)\d+\.\d+\.\d+/,
    buildNumber: /(<key>CFBundleVersion<\/key>.*[\n]*.*<string>)\d+/,
    path: iosInfoplistFile,
  },
  iosXcodeproj: {
    version: /(MARKETING_VERSION = )\d+\.\d+\.\d+/g,
    buildNumber: /(CURRENT_PROJECT_VERSION = )\d+/g,
    path: iosXcodeprojFile,
  },
  package: {
    version: /("version": ")\d+\.\d+\.\d+/,
    path: packageFilePath,
  },
};

const main = (version, buildNumber) => {
  const { android, iosInfoplist, iosXcodeproj, package } = filesInfo;
  if (checkVersionFormat(version)) {
    updateVersion(package.path, package.version, version);
    updateVersion(android.path, android.version, version);
    updateVersion(iosXcodeproj.path, iosXcodeproj.version, version);
    updateVersion(iosInfoplist.path, iosInfoplist.version, version);
  }

  if (checkBuildNumber(buildNumber)) {
    updateVersion(android.path, android.buildNumber, buildNumber - 1);
    updateVersion(iosXcodeproj.path, iosXcodeproj.buildNumber, buildNumber - 1);
    updateVersion(iosInfoplist.path, iosInfoplist.buildNumber, buildNumber - 1);
  }
};

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

function updateVersion(filePath, searchValue, value) {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const newFileContent = fileContent.replace(searchValue, `$1${value}`);
  fs.writeFileSync(filePath, newFileContent, { encoding: "utf-8" });
}

module.exports = main;
