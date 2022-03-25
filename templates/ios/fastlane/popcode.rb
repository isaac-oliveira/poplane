#!/usr/bin/ruby

class Popcode
  TeamId = "<teamId>"

  class AppIdentifier
    Production = "<packageName>"
    Staging = "<packageName>.staging"
    Debug = "<packageName>.debug"
  end

  class Scheme
    Production = "<projectName> Release"
    Staging = "<projectName> Staging"
    Debug = "<projectName> Debug"
  end

  class Configuration
    Production = "Release"
    Staging = "Staging"
    Debug = "Debug"
  end

  class Firebase
    ApiToken = "<ApiToken>" # Você precisa alterar esse campo
    AppIdProduction = "<AppIdProduction>" # Você precisa alterar esse campo
    AppIdStaging = "<AppIdStaging>" # Você precisa alterar esse campo
    AppIdDebug = "<AppIdDebug>" # Você precisa alterar esse campo
  end
end
