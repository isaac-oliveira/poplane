#!/bin/bash
. .zshrc

# Diretório do Dexprotector
pathDexprotector=$( echo $DEXPROTECTOR_HOME )

# Diretório das versões do APP
pathAppVersions="<PATH TO BINARY>/$1"

# Preparando os parametros do ofuscamento
configFile="$pathAppVersions/dexprotector-config-$2.xml"
inputFile="$pathAppVersions/app.$2"
outputFile="$pathAppVersions/app.protected.$2"

# Ofuscando o binário
if [ $2 = "ipa" ]; then
  java -cp $pathDexprotector/dexprotector.jar com.licel.dexprotector.ios.ConsoleTask -verbose > $pathAppVersions/app.protected.$2.txt -configFile $configFile $inputFile $outputFile
else
  java -jar $pathDexprotector/dexprotector.jar -verbose > $pathAppVersions/app.protected.$2.txt -configFile $configFile $inputFile $outputFile
fi
