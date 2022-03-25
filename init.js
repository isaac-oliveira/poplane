#!/usr/bin/env node

const projectPaths = require('./project-paths')
const fs = require('fs')
const checkExists = require('./check-exists')
const io = require('./io')

const main = async (dexprotector, fastlane) => {
  const runBoth = (dexprotector && fastlane) || (!dexprotector && !fastlane)

  if (runBoth || fastlane) {
    const androidFastlane = projectPaths.getFastlanePath('android')
    const iosFastlane = projectPaths.getFastlanePath('ios')

    if (
      !(await checkExists(
        [androidFastlane.fastlaneFolderPath, iosFastlane.fastlaneFolderPath],
        'Fastlane já configurado. Deseja continuar? (y/n): '
      ))
    ) {
      await initFastlane(runBoth || dexprotector)
    }
  }

  if (runBoth || dexprotector) {
    const { dexprotectorFilePath } = projectPaths.getDexprotectorPath()
    const { apk, aab, playstore } = dexprotectorFilePath
    if (!(await checkExists([apk, aab, playstore], 'Dexprotector já configurado. Deseja continuar? (y/n): '))) {
      await initDexprotector()
    }
  }
}

async function initFastlane(dexprotector) {
  io.log('\nConfigurações do Fastlane\n', 'green')

  const projectName = await io.question('Nome do projeto iOS (projectName): ')
  const packageName = await io.question('Nome do pacote (packageName/appIdentifier): ')
  const appleId = await io.question('Apple Id: ')
  const itcTeamId = await io.question('itc Team Id: ')
  const teamId = await io.question('Team Id: ')
  const gitUrl = await io.question('Repositório dos certificados: ')

  io.log('\nCopiando arquivos do fastlane...\n')

  const data = { projectName, packageName, appleId, itcTeamId, teamId, gitUrl }
  for (platform of ['ios', 'android']) {
    const { fastlaneTemplatesPath, fastlaneFilesPath, fastlaneFolderPath } = projectPaths.getFastlanePath(platform)
    const keys = Object.keys(fastlaneTemplatesPath)
    keys.forEach((key) => {
      const path = fastlaneTemplatesPath[key]
      if (path) {
        move(
          fastlaneTemplatesPath[key],
          fastlaneFilesPath[key],
          fastlaneFolderPath,
          data,
          (key) => new RegExp(`<${key}>`, 'g')
        )
      }
    })
  }
  if (dexprotector) {
    io.log('Arquivos do fastlane gerados com sucesso!\n', 'green')
  } else {
    io.log('Arquivos do fastlane gerados com sucesso!', 'green')
  }
}

async function initDexprotector() {
  io.log('\nConfigurações do Dexprotector\n', 'green')
  const YOUR_KEYSTORE = await io.question('Sua keystore: ')
  const YOUR_ALIAS = await io.question('Sua alias: ')
  const YOUR_STOREPASS = await io.question('Sua storepass: ')
  const YOUR_KEYPASS = await io.question('Sua keypass: ')
  const YOUR_FIREBASE_CERTIFICATEFINGERPRINT = await io.question('Certificado de impressão digital do firebase: ')
  const YOUR_PLAYSTORE_CERTIFICATEFINGERPRINT = await io.question('Certificado de impressão digital da playstore: ')

  const data = {
    YOUR_ALIAS,
    YOUR_FIREBASE_CERTIFICATEFINGERPRINT,
    YOUR_KEYPASS,
    YOUR_KEYSTORE,
    YOUR_PLAYSTORE_CERTIFICATEFINGERPRINT,
    YOUR_STOREPASS
  }

  io.log('\nCopiando arquivos do dexprotector...\n')
  const { dexprotectorFilePath, dexprotectorTemplatePath } = projectPaths.getDexprotectorPath(__dirname, 'android')
  const keys = Object.keys(dexprotectorFilePath)
  keys.forEach((key) => {
    if (key !== 'default') {
      const path = dexprotectorFilePath[key]
      if (path) {
        move(dexprotectorTemplatePath[key], dexprotectorFilePath[key], null, data, (key) => new RegExp(`${key}`, 'g'))
      }
    }
  })
  io.log('Arquivos de configuração do dexprotector gerados com sucesso!', 'green')
}

function move(filesPath, newPath, folderPath, data, formatRegex) {
  let fileContent = fs.readFileSync(filesPath, { encoding: 'utf-8' })
  if (data) {
    const keys = Object.keys(data)
    keys.forEach((key) => {
      const value = data[key]
      if (value) {
        const regex = formatRegex(key)
        fileContent = fileContent.replace(regex, value)
      }
    })
  }
  if (folderPath && !fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
  fs.writeFileSync(newPath, fileContent, { encoding: 'utf-8' })
}

module.exports = main
