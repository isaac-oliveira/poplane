#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// root project
const rootProjectPath = path.join(__dirname, "..", "..");

// platform folder
const androidFolderPath = path.join(rootProjectPath, "android");
const iosFolderPath = path.join(rootProjectPath, "ios");

// templates folder
const androidTemplatePath = path.join(__dirname, "templates", "android");
const iosTemplatePath = path.join(__dirname, "templates", "ios");

// package file
const packageFilePath = path.join(rootProjectPath, "package.json");

// android folders and files
const androidAppFolderPath = path.join(androidFolderPath, "app");
const androidGradleAppFile = path.join(androidAppFolderPath, "build.gradle");

// ios folders and files
const dirs = fs.readdirSync(iosFolderPath, { encoding: "utf-8" });
let xcodeprojFile, infoplistFile;
for (const dir of dirs) {
  if (/.*(?=\.xcodeproj)/gi.test(dir)) {
    xcodeprojFile = dir;
    infoplistFile = dir.replace(/([a-zA-Z0-9]+)\.xcodeproj/gi, "$1");
  }
}

const iosInfoplistFile = path.join(iosFolderPath, infoplistFile, "Info.plist");
const iosXcodeprojFile = path.join(
  iosFolderPath,
  xcodeprojFile,
  "project.pbxproj"
);

// fastlane files
const getFastlanePath = (platform, withDexprotector) => {
  const platformFolderPath =
    platform === "android" ? androidFolderPath : iosFolderPath;
  const templateFolderPath =
    platform === "android" ? androidTemplatePath : iosTemplatePath;

  const fastlaneFolderPath = path.join(platformFolderPath, "fastlane");

  const commonFastfilePath = path.join(
    templateFolderPath,
    "fastlane",
    "commonFastfile"
  );
  const dexprotectorFastfilePath = path.join(
    templateFolderPath,
    "fastlane",
    "dexprotectorFastfile"
  );
  const fastfilePath = path.join(templateFolderPath, "fastlane", "Fastfile");

  fs.copyFileSync(
    withDexprotector ? dexprotectorFastfilePath : commonFastfilePath,
    fastfilePath
  );

  const fastlaneTemplatesPath = {
    appfile: path.join(templateFolderPath, "fastlane", "Appfile"),
    fastfile: fastfilePath,
    devices:
      platform !== "android"
        ? path.join(templateFolderPath, "fastlane", "devices.txt")
        : undefined,
    matchfile:
      platform !== "android"
        ? path.join(templateFolderPath, "fastlane", "Matchfile")
        : undefined,
    pluginfile: path.join(templateFolderPath, "fastlane", "Pluginfile"),
    popcode: path.join(templateFolderPath, "fastlane", "popcode.rb"),
    gemfile: path.join(templateFolderPath, "Gemfile"),
    obfuscateBinary: path.join(__dirname, "templates", "obfuscateBinary.sh"),
  };

  const fastlaneFilesPath = {
    appfile: path.join(fastlaneFolderPath, "Appfile"),
    fastfile: path.join(fastlaneFolderPath, "Fastfile"),
    devices:
      platform !== "android"
        ? path.join(fastlaneFolderPath, "devices.txt")
        : undefined,
    matchfile:
      platform !== "android"
        ? path.join(fastlaneFolderPath, "Matchfile")
        : undefined,
    pluginfile: path.join(fastlaneFolderPath, "Pluginfile"),
    popcode: path.join(fastlaneFolderPath, "popcode.rb"),
    gemfile: path.join(platformFolderPath, "Gemfile"),
    obfuscateBinary: path.join(fastlaneFolderPath, "obfuscateBinary.sh"),
  };

  return { fastlaneFolderPath, fastlaneTemplatesPath, fastlaneFilesPath };
};

// dexprotector files path
const getDexprotectorPath = () => {
  const androidDexprotectorTemplateFolderPath = path.join(
    androidTemplatePath,
    "dexprotector"
  );

  const iosDexprotectorTemplateFolderPath = path.join(
    iosTemplatePath,
    "dexprotector"
  );

  const dexprotectorTemplatePath = {
    apk: path.join(
      androidDexprotectorTemplateFolderPath,
      "dexprotector-config-apk.xml"
    ),
    aab: path.join(
      androidDexprotectorTemplateFolderPath,
      "dexprotector-config-aab.xml"
    ),
    playstore: path.join(
      androidDexprotectorTemplateFolderPath,
      "dexprotector-config-playstore.xml"
    ),
    ios: path.join(
      iosDexprotectorTemplateFolderPath,
      "dexprotector-config-ios.xml"
    ),
  };

  const dexprotectorFilePath = {
    apk: path.join(androidFolderPath, "app", "dexprotector-config-apk.xml"),
    aab: path.join(androidFolderPath, "app", "dexprotector-config-aab.xml"),
    playstore: path.join(
      androidFolderPath,
      "app",
      "dexprotector-config-playstore.xml"
    ),
    ios: path.join(iosFolderPath, "dexprotector-config-ios.xml"),
  };

  return { dexprotectorTemplatePath, dexprotectorFilePath };
};

module.exports = {
  rootProjectPath,
  androidFolderPath,
  iosFolderPath,
  androidTemplatePath,
  iosTemplatePath,
  packageFilePath,
  androidAppFolderPath,
  androidGradleAppFile,
  iosInfoplistFile,
  iosXcodeprojFile,
  getFastlanePath,
  getDexprotectorPath,
};
