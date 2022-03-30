# Getting Started

Requisitos para aplicar o poplane:

- É necessário que o app tenha multiplos ambientes (debug, staging e release), seguindo o mesmo padrão do TKS Lojista.

Para adicionar no projeto execute:

```cmd
yarn add poplane --dev
```

ou

```cmd
npm i poplane --dev
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

# Geração de versões

## Estrutura

yarn poplane [lane] […args] […flags]

A lane é obrigatória.
os args são opcionais, caso não sejam passados serão usados os valores padrões da lane.
Os flags seguem os mesmos padrões dos args.

## Valores aceitos

### Lane

- test
- development
- staging
- release
- store

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
  - –-android
- androidExtension
  - --apk
  - –-aab
- certificate
  - --certificate

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
