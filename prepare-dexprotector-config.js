#!/usr/bin/env node

const fs = require('fs')
const projectPaths = require('./project-paths')
const io = require('./io')

const prepareDexprotectorConfig = (lane, isAab) => {
  const { dexprotectorFilePath } = projectPaths.getDexprotectorPath()
  try {
    if (lane === 'store') {
      const fileContent = fs.readFileSync(dexprotectorFilePath.playstore, {
        encoding: 'utf-8'
      })
      fs.writeFileSync(dexprotectorFilePath.default, fileContent, { encoding: 'utf-8' })
      io.log('\nUsando dexprotector-config-playstore.xml.\n', 'green')
      return
    }

    if (lane === 'release' && isAab) {
      const fileContent = fs.readFileSync(dexprotectorFilePath.aab, { encoding: 'utf-8' })
      fs.writeFileSync(dexprotectorFilePath.default, fileContent, { encoding: 'utf-8' })
      io.log('\nUsando dexprotector-config-aab.xml.\n', 'green')
      return
    }
    const fileContent = fs.readFileSync(dexprotectorFilePath.apk, { encoding: 'utf-8' })
    fs.writeFileSync(dexprotectorFilePath.default, fileContent, { encoding: 'utf-8' })
    io.log('\nUsando dexprotector-config-apk.xml.\n', 'green')
  } catch (e) {
    io.error(String(e), 'red')
  }
}

module.exports = prepareDexprotectorConfig
