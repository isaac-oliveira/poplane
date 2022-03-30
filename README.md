# Getting Started

Requisitos para aplicar o poplane:

- É necessário que o app tenha multiplos ambientes (debug, staging e release), seguindo o mesmo padrão do TKS Lojista.

Para adicionar no projeto execute:

```cmd
yarn add poplane@https://github.com/isaac-oliveira/poplane.git#develop --dev
```

ou

```cmd
npm i poplane@https://github.com/isaac-oliveira/poplane.git#develop  --dev
```

Caso você queira utilizar o script em um projeto que ainda não tem o dexprotector ou fastlane você pode utilizar o `init` para gerar os arquivos do fastlane e dexprotector.

Inicializar os arquivos do dexprotector e fastlane

```cmd
yarn poplane init
```

Inicializar apenas os arquivos do fastlane

```cmd
yarn poplane init --faslane
```

Inicializar apenas os arquivos do dexprotector

```cmd
yarn poplane init --dexprotector
```

Obs: Caso você já use o fastlane e/ou dexprotector, você pode verificar os [templates](/templates) para tentar replicar as configurações.

# Geração de versões

## Estrutura

yarn poplane [lane] […args] […flags]

A lane é obrigatória.
os args são opcionais, caso não sejam passados serão usados os valores padrões da lane.
Os flags seguem os mesmos padrões dos args.

## Valores aceitos

### Lane

- test

  Essa lane servi para realizar testes no fastlane

- development

  Essa lane é usada para compartilhar uma versão funcional entre os devs

- staging

  Essa lane é usada para compartilhar uma versão de homologação para os devs, clientes e alguns membros da empresa

- release

  Essa lane gera uma versão identica a que vai para a loja

- store

  Essa lane sobe uma versão para as lojas (App Store e Google Play)

### Args

- env

  - debug

    ambiente de debug, aponta para o localhost ou ambiente de desenvolvimento.

  - development

    caso o ambiente de debug aponte para o localhost, esse ambiente deve aponta para o desenvolvimento, não é necessário em todos o projetos.

  - staging
    Aponta para o ambiente de homologação. Esse env deve ser utilizada quando for gerar uma build para a homologação do cliente.

  - production
    Aponta para o ambiente de produção, deve ser usado apenas nas versões de testes finais ou que vão para as lojas.

- version (opcional)

  string no formato: x.x.x

- buildNumber(opcional)

  inteiro equivalente ao versionCode e versionNumber

### Flags

- os

  - --ios

    Gera apenas uma versão iOS

  - –-android

    Gera apenas uma versão android

- androidExtension

  - --apk

    Gera uma versão android com a extensão APK

  - –-aab

    Gera uma versão android com a extensão ABB

- certificate

  - --certificate

    Roda os certificados do iOS antes de gerar a versão

## Gera versões para as duas plataformas

android e iOS

```cmd
yarn poplane test env:debug version:1.0.0
```

android com extensão apk e iOS

```cmd
yarn poplane staging env:staging version:1.0.0 --apk
```

android com extensão aab e iOS

```cmd
yarn poplane test env:production version:1.0.0 -—aab
```

## Gera uma versão para uma plataforma especificada

versão android

```cmd
yarn poplane test env:debug version:1.0.0 —-android
```

versão iOS

```cmd
yarn poplane test env:debug version:1.0.0 —-ios
```

## Gera uma versão android com extensão apk ou aab (apenas android)

android com extensão aab

```cmd
yarn poplane test env:debug version:1.0.0 -—android -—aab
```

android com extensão apk

```cmd
yarn poplane test env:debug version:1.0.0 -—android —-apk
```

## Versões para as lojas

android e iOS

```cmd
yarn poplane store version:1.0.0 buildNumber:10
```

android

```cmd
yarn poplane store version:1.0.0 buildNumber:10 –-android
```

iOS

```cmd
yarn poplane store version:1.0.0 buildNumber:10 –-ios
```

Observações: No caso da lane store, só é aceito o arg version e a flag os
