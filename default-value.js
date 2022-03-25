#!/usr/bin/env node

const defaultValue = {
  test: {
    env: 'debug',
    version: undefined,
    os: 'both',
    isAab: false
  },
  development: {
    env: 'development',
    version: undefined,
    os: 'both',
    isAab: false
  },
  staging: {
    env: 'staging',
    version: undefined,
    os: 'both',
    isAab: false
  },
  release: {
    env: 'production',
    version: undefined,
    os: 'both',
    isAab: true
  },
  store: {
    env: 'production',
    version: undefined,
    os: 'both',
    isAab: true
  }
}

module.exports = defaultValue
