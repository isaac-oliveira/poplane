#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))

const validateInputs = require('./validate-inputs')
const getBuildInfo = require('./get-build-info')
const updateVersion = require('./update-version')
const fastlane = require('./fastlane')
const init = require('./init')
const io = require('./io')
const getValue = require('./get-value')

io.log('\n-----------------------------------', 'green')
io.log('      Welcome to the Poplane!      ', 'green')
io.log('-----------------------------------\n', 'green')

const {
  _: [firstArg, ...args],
  ...flags
} = argv

if (firstArg === 'init') {
  init(argv.dexprotector, argv.fastlane)
  return
}

try {
  const lane = firstArg
  validateInputs({ lane })

  const { getArgValue, getFlagValue } = getValue(lane, args, flags)

  //args
  const env = getArgValue('env') // 'debug', 'development', 'staging' or 'production'
  const version = getArgValue('version') // number version
  const buildNumber = getArgValue('buildNumber') // build number

  // flags
  const os = getFlagValue('os') // 'android', 'ios' or 'both'
  const isAab = getFlagValue('isAab') // 'aab' or 'apk'
  const certificates = getFlagValue('certificates') // 'true' or 'false'

  // main
  const main = async () => {
    try {
      validateInputs({ os, env, version, buildNumber, flags })
      updateVersion(version, Number(buildNumber))

      const buildInfo = getBuildInfo()
      const { androidVersion, iOSVersion, packageVersion } = buildInfo

      if (os === 'both') {
        io.table({ lane, os: 'android, ios', env, ...buildInfo, androidExtention: isAab ? 'aab' : 'apk' })
      } else if (os === 'android') {
        io.table({ lane, os, env, packageVersion, androidVersion, androidExtention: isAab ? 'aab' : 'apk' })
      } else {
        io.table({ lane, os, env, packageVersion, iOSVersion })
      }

      const response = await io.question('\nConfira se as variáveis estão corretas. Podemos prosseguir? (s/n): ')
      if (response === 's') {
        if (os === 'both') {
          await fastlane('android', lane, env, false, isAab)
          fastlane('ios', lane, env, certificates)
          return
        } else {
          fastlane(os, lane, env, certificates, isAab)
        }
      }
    } catch (e) {
      io.error(String(e), 'red')
    }
  }

  main()
} catch (e) {
  io.error(String(e), 'red')
}
