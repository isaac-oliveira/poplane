#!/usr/bin/env node

/**
 * Usage example
 *  $ node dexprotector.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");
const path = require("path");
const prepareConfig = require("./prepare-config");

const wasDexprotectorFound = () => {
  try {
    const path = execSync(`echo $DEXPROTECTOR_HOME`, { encoding: "utf-8" });

    if (path === "\n") {
      return false;
    }
    return true;
  } catch (e) {
    console.error("\nSorry about that :(");

    const sourcePath = path.join(__dirname, "..", "..", "android", "app");
    const gradleFilePath = path.join(sourcePath, "build.gradle");
    const backupFilePath = path.join(
      sourcePath,
      "build.gradle-dexprotector-backup"
    );

    restoreGradleFile({ gradleFilePath, backupFilePath });

    console.error(e);
    return false;
  }
};
const handleDexprotectorNotFound = () =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "Dexprotector was not found. Are you sure that you want to build an unprotected version of this app? (y/n)\n",
      (response) => {
        rl.close();

        if (response && response.match(/[yY]/i)) {
          return resolve(true);
        }
        resolve(false);
      }
    );
  });

const buildProtectedVersion = (runFastlane) => {
  console.log("A Dexprotector version was found 🔒");
  console.log("Here we go...\n");

  const sourcePath = path.join(__dirname, "..", "android", "app");
  const gradleFilePath = path.join(sourcePath, "build.gradle");
  const backupFilePath = path.join(
    sourcePath,
    "build.gradle-dexprotector-backup"
  );

  try {
    backupGradleFile({ gradleFilePath, backupFilePath });
    configDexprotectorOnGradleFile(gradleFilePath);
    runFastlane();
  } catch (error) {
    restoreGradleFile({ gradleFilePath, backupFilePath });
    return;
  }
  restoreGradleFile({ gradleFilePath, backupFilePath });
};
const buildUnprotectedVersion = (runFastlane) => {
  console.log("\nWith great power comes great responsibility...\n");
  runFastlane();
};
const cancelProcess = () => {
  console.log("\nSmart choice! Better safe than sorry :)");

  process.exit(0);
};

const configDexprotectorOnGradleFile = (filePath) => {
  console.log("Configuring Dexprotector...");
  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const fileLines = fileContent.split("\n");

  const addPlugin = "apply plugin: 'dexprotector'";
  const addConfigFile =
    `ext.set("dexprotector.configFile", "\${projectDir}/dexprotector-config.xml")`.padStart(
      12,
      " "
    );
  const buildScript = `buildscript {
     repositories {
         flatDir { dirs System.getenv('DEXPROTECTOR_HOME') }
     }
     dependencies {
         classpath ':dexprotector-gradle-plugin:'
         classpath ':dexprotector:'
     }
 }`;

  const newFileContent = fileLines
    .map((line) => {
      if (line === 'apply plugin: "com.android.application"') {
        return `${line}\n${addPlugin}`;
      }
      if (
        line.trim() ===
        'proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"'
      ) {
        return `${line}\n${addConfigFile}`;
      }
      if (line === "dependencies {") {
        return `${buildScript}\n\n${line}`;
      }
      return line;
    })
    .join("\n");
  fs.writeFileSync(filePath, newFileContent, { encoding: "utf-8" });

  console.log("Dexprotector successfully configured!\n");
};
const backupGradleFile = ({ gradleFilePath, backupFilePath }) => {
  const { COPYFILE_EXCL } = fs.constants;

  fs.copyFileSync(gradleFilePath, backupFilePath, COPYFILE_EXCL);
  console.log("Gradle file backed up\n");
};
const restoreGradleFile = ({ gradleFilePath, backupFilePath }) => {
  fs.unlinkSync(gradleFilePath);
  fs.renameSync(backupFilePath, gradleFilePath);
  console.log("\nGradle file restored");
};

const main = async (runFastlaneCallback, lane, isAab) => {
  if (wasDexprotectorFound()) {
    prepareConfig(lane, isAab);
    buildProtectedVersion(runFastlaneCallback);
    return;
  }

  const shouldProceedAnyway = await handleDexprotectorNotFound();
  if (shouldProceedAnyway) {
    buildUnprotectedVersion(runFastlaneCallback);
    return;
  }

  cancelProcess();
};

module.exports = main;
