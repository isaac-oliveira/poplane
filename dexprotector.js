#!/usr/bin/env node

/**
 * Usage example
 *  $ node dexprotector.js
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const prepareDexprotectorConfig = require('./prepare-dexprotector-config')
const io = require('./io')

const wasDexprotectorFound = () => {
  try {
    const path = execSync(`echo $DEXPROTECTOR_HOME`, { encoding: 'utf-8' })

    if (path === '\n') {
      return false
    }
    return true
  } catch (e) {
    io.error('\nSorry about that :(', 'red')

    const sourcePath = path.join(__dirname, '..', '..', 'android', 'app')
    const gradleFilePath = path.join(sourcePath, 'build.gradle')
    const backupFilePath = path.join(sourcePath, 'build.gradle-dexprotector-backup')

    restoreGradleFile({ gradleFilePath, backupFilePath })

    io.error(e)
    return false
  }
}
const handleDexprotectorNotFound = async () => {
  const response = await io.question(
    'Dexprotector was not found. Are you sure that you want to build an unprotected version of this app? (y/n): ',
    'yellow'
  )
  return response && response.match(/[yY]/i)
}

const buildProtectedVersion = (runFastlane) => {
  io.log('A Dexprotector version was found 🔒', 'green')
  io.log('Here we go...\n')

  const sourcePath = path.join(__dirname, '..', 'android', 'app')
  const gradleFilePath = path.join(sourcePath, 'build.gradle')
  const backupFilePath = path.join(sourcePath, 'build.gradle-dexprotector-backup')

  try {
    backupGradleFile({ gradleFilePath, backupFilePath })
    configDexprotectorOnGradleFile(gradleFilePath)
    runFastlane()
  } catch (error) {
    restoreGradleFile({ gradleFilePath, backupFilePath })
    return
  }
  restoreGradleFile({ gradleFilePath, backupFilePath })
}
const buildUnprotectedVersion = (runFastlane) => {
  io.warn('\nWith great power comes great responsibility...\n')
  runFastlane()
}
const cancelProcess = () => {
  io.log('\nSmart choice! Better safe than sorry :)', 'green')

  process.exit(0)
}

const configDexprotectorOnGradleFile = (filePath) => {
  io.log('Configuring Dexprotector...')
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const fileLines = fileContent.split('\n')

  const addPlugin = "apply plugin: 'dexprotector'"
  const addConfigFile = `ext.set("dexprotector.configFile", "\${projectDir}/dexprotector-config.xml")`.padStart(12, ' ')
  const buildScript = `buildscript {
     repositories {
         flatDir { dirs System.getenv('DEXPROTECTOR_HOME') }
     }
     dependencies {
         classpath ':dexprotector-gradle-plugin:'
         classpath ':dexprotector:'
     }
 }`

  const newFileContent = fileLines
    .map((line) => {
      if (line === 'apply plugin: "com.android.application"') {
        return `${line}\n${addPlugin}`
      }
      if (line.trim() === 'proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"') {
        return `${line}\n${addConfigFile}`
      }
      if (line === 'dependencies {') {
        return `${buildScript}\n\n${line}`
      }
      return line
    })
    .join('\n')
  fs.writeFileSync(filePath, newFileContent, { encoding: 'utf-8' })

  io.log('Dexprotector successfully configured!\n', 'green')
}

const backupGradleFile = ({ gradleFilePath, backupFilePath }) => {
  const { COPYFILE_EXCL } = fs.constants

  fs.copyFileSync(gradleFilePath, backupFilePath, COPYFILE_EXCL)
  io.log('Gradle file backed up\n', 'green')
}

const restoreGradleFile = ({ gradleFilePath, backupFilePath }) => {
  fs.unlinkSync(gradleFilePath)
  fs.renameSync(backupFilePath, gradleFilePath)
  io.log('\nGradle file restored', 'green')
}

const main = async (runFastlaneCallback, lane, isAab) => {
  if (wasDexprotectorFound()) {
    prepareDexprotectorConfig(lane, isAab)
    buildProtectedVersion(runFastlaneCallback)
    return
  }

  const shouldProceedAnyway = await handleDexprotectorNotFound()
  if (shouldProceedAnyway) {
    buildUnprotectedVersion(runFastlaneCallback)
    return
  }

  cancelProcess()
}

module.exports = main
