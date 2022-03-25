#!/usr/bin/ruby

class Popcode
  class Task
    AabProduction = "bundleRelease"
    ApkProduction = "assembleRelease"
    Staging = "assembleStagingrelease"
    Debug = "assembleDebug"
  end

  class Firebase
    ApiToken = "<ApiToken>" # Você precisa alterar esse campo
    AppIdProduction = "<AppIdProduction>" # Você precisa alterar esse campo
    AppIdStaging = "<AppIdStaging>" # Você precisa alterar esse campo
    AppIdDebug = "<AppIdDebug>" # Você precisa alterar esse campo
  end
end
