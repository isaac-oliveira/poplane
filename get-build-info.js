#!/usr/bin/env node

const fs = require("fs");
const projectPaths = require("./project-paths");

const {
  packageFilePath,
  androidGradleAppFile,
  iosInfoplistFile,
  iosXcodeprojFile,
} = projectPaths;

const findInfo = {
  android: {
    version: /versionName "(\d+\.\d+\.\d+)/,
    buildNumber: /versionCode (\d+)/,
    path: androidGradleAppFile,
  },
  iosInfoplist: {
    version:
      /<key>CFBundleShortVersionString<\/key>*[\n]*.*<string>(\d+\.\d+\.\d+)/,
    buildNumber: /<key>CFBundleVersion<\/key>.*[\n]*.*<string>(\d+)/,
    path: iosInfoplistFile,
  },
  iosXcodeproj: {
    version: /MARKETING_VERSION = (\d+\.\d+\.\d+)/,
    buildNumber: /CURRENT_PROJECT_VERSION = (\d+)/,
    path: iosXcodeprojFile,
  },
  package: {
    version: /"version": "(\d+\.\d+\.\d+)/,
    path: packageFilePath,
  },
};

const main = ({ version, buildNumber }) => {
  let iOSVersion = "";
  let packageVersion = "";
  let androidVersion = "";

  const { android } = findInfo;
  const versionGradle = foundRegexInFile(
    androidGradleAppFile,
    android.version,
    "$1"
  );
  const buildNumberGradle = foundRegexInFile(
    androidGradleAppFile,
    android.buildNumber,
    "$1"
  );
  androidVersion = `${version || versionGradle} (${
    buildNumber ? Number(buildNumber) : Number(buildNumberGradle) + 1
  })`;

  const { iosInfoplist, iosXcodeproj } = findInfo;

  const versionInfo = foundRegexInFile(
    iosInfoplistFile,
    iosInfoplist.version,
    "$1"
  );
  const buildNumberInfo = foundRegexInFile(
    iosInfoplistFile,
    iosInfoplist.buildNumber,
    "$1"
  );

  const versionXcodeproj = foundRegexInFile(
    iosXcodeprojFile,
    iosXcodeproj.version,
    "$1"
  );
  const buildNumberXcodeproj = foundRegexInFile(
    iosXcodeprojFile,
    iosXcodeproj.buildNumber,
    "$1"
  );

  iOSVersion = `${version || versionInfo || versionXcodeproj} (${
    buildNumber
      ? Number(buildNumber)
      : Number(buildNumberInfo || buildNumberXcodeproj) + 1
  })`;

  const { package } = findInfo;
  packageVersion =
    version || foundRegexInFile(packageFilePath, package.version, "$1");

  return { packageVersion, androidVersion, iOSVersion };
};

function foundRegexInFile(filePath, search, format) {
  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const found = fileContent.match(search);
  if (!found) {
    return undefined;
  }

  if (!format) {
    return found[0];
  }

  const value = found[0].replace(search, format);
  return value;
}

module.exports = main;
