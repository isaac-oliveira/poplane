#!/usr/bin/env node

const { execSync } = require('child_process')

const dexprotector = require('./dexprotector')
const io = require('./io')

const supportedOS = ['android', 'ios']

let envParam = null

const main = async (os, lane, env, certificates = false, isAab = false) => {
  if (os === 'android' && lane === 'release') {
    envParam = `env:${env} isAab:${isAab}`
  } else {
    envParam = `env:${env}`
  }

  if (!os || !supportedOS.includes(os)) {
    throw new Error('You must provide a valid OS (either "android" or "ios")')
  }

  const runFastlane = () => {
    execSync(`fastlane ${lane} ${envParam}`, {
      cwd: os,
      encoding: 'utf-8',
      stdio: 'inherit'
    })
  }

  try {
    if (os === 'android' && (lane === 'release' || lane === 'store')) {
      await dexprotector(runFastlane, lane, isAab)
    } else {
      if (os === 'ios' && certificates) {
        execSync('fastlane certificates', {
          cwd: os,
          encoding: 'utf-8',
          stdio: 'inherit'
        })
      }
      runFastlane()
    }
  } catch (e) {
    io.error(e, 'red')
    io.error('\nSorry about that :(', 'red')
  }
}

module.exports = main
