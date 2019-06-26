# React Native Jetifier (@jumpn/react-native-jetifier)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Glosary](#glosary)
  - [**Jetificable**](#jetificable)
  - [**Jetificable Group**](#jetificable-group)
  - [**Jetify**](#jetify)
  - [**Jetification**](#jetification)
- [Why this package exists?](#why-this-package-exists)
- [How jetification is done?](#how-jetification-is-done)
- [Installation](#installation)
  - [Using npm](#using-npm)
  - [Using yarn](#using-yarn)
- [Usage](#usage)
  - [Execute it after installation](#execute-it-after-installation)
    - [Using npm](#using-npm-1)
    - [Using yarn](#using-yarn-1)
  - [Setup it to run on npm postinstall](#setup-it-to-run-on-npm-postinstall)
    - [Using npm](#using-npm-2)
    - [Using yarn](#using-yarn-2)
  - [Commit the index file (`jetificableGroups.json`) to your repository](#commit-the-index-file-jetificablegroupsjson-to-your-repository)
  - [Unjetify if needed](#unjetify-if-needed)
    - [Using npm](#using-npm-3)
    - [Using yarn](#using-yarn-3)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Glosary

### **Jetificable**

> A Java, Kotlin, or XML file with references to any Support class, now migrated to AndroidX.

### **Jetificable Group**

> All the jetificables under a dependency (npm package).

### **Jetify**

> Rewrite Support classes to AndroidX equivalents.

### **Jetification**

> The process of jetify a jetificable.

## Why this package exists?

By the end of 2018, Android released [Jetpack](https://developer.android.com/jetpack) that comprises a full rewrite of the [Support Library](https://developer.android.com/topic/libraries/support-library) now called [AndroidX](https://developer.android.com/jetpack/androidx).

To support this, they ask you to set the following properties with `true` in your [gradle.properties](https://developer.android.com/studio/build#properties-files) file:

```
android.useAndroidX=true
android.enableJetifier=true
```

In addition to this, you also need to require [artifacts](https://developer.android.com/jetpack/androidx/migrate#artifact_mappings) and import [classes](https://developer.android.com/jetpack/androidx/migrate#class_mappings) with their new names.

So you might be thinking, I've already done this on my App, so I still don't understand *"Why this package exists?", so let me answer this with another question:

> What about your dependencies?

When we move to the world of [React Native](https://facebook.github.io/react-native), all your [dependencies](https://facebook.github.io/react-native/docs/linking-libraries-ios) instead of being libraries (`JAR, AAR, and ZIP files`) as they are in a normal Android App, they are **npm packages** and live under the **node_modules** folder, so this means that unless all the React Native packages (including React Native itself) you are using have already migrated to AndroidX, you will have to manually rewrite all the Support classes usages and point them to their respective AndroidX equivalent as the [Jetifier](https://developer.android.com/studio/command-line/jetifier) tool Android provides won't help you do this because it only handles Android libraries.

You can track the progress of React Native migration to AndroidX in this [issue](https://github.com/facebook/react-native/issues/23112) and I also recommend you to open an issue (if not already opened) and even better, submit a PR, to all your dependencies that haven't migrated yet.

## How jetification is done?

1. An index (**jetificableGroups.json**) file will be created (or updated if already there) under your package root with the jetificables of all your dependencies (npm packages).
2. All the jetificables of your dependencies (npm packages) present in the index (**jetificableGroups.json**) will be jetified.

This process should be fast (under 10 sec) on the first run (no index available) and super extremely fast (aprox 2 sec) on the following executions (index available).

## Installation

### Using [npm](https://docs.npmjs.com/cli/npm)
```console
$ npm install --save @jumpn/react-native-jetifier
```
### Using [yarn](https://yarnpkg.com)
```console
$ yarn add @jumpn/react-native-jetifier
```

## Usage

After having installed this package you will have an executable file called `react-native-jetifier` available under your `node_modules/.bin` folder.

Follow the following steps that will ensude your dependencies (npm packages) will be jetified even if you decide to remove or add some:

### Execute it after installation

Execute `react-native-jetifier` to jetify your dependencies (npm packages) and create the index (`jetificableGroups.json`).

#### Using [npm](https://docs.npmjs.com/cli/npm)

```console
$ npx react-native-jetifier
```

#### Using [yarn](https://yarnpkg.com)

```console
$ yarn react-native-jetifier
```

### Setup it to run on npm postinstall

Add it under the [npm postinstall script](https://docs.npmjs.com/misc/scripts) in your [package.json](https://docs.npmjs.com/files/package.json) to keep your dependencies jetified when you remove or add some.

#### Using [npm](https://docs.npmjs.com/cli/npm)

```json
{
  "scripts": {
    "postinstall": "npx react-native-jetifier"
  }
}
```

#### Using [yarn](https://yarnpkg.com)

```json
{
  "scripts": {
    "postinstall": "yarn react-native-jetifier"
  }
}
```

### Commit the index file (`jetificableGroups.json`) to your repository

Since all the jetificable paths are read from the index file (`jetificableGroups.json`) to improve perfomance, it's highly recommended to commit it to your repository so on a clean clone `react-native-jetifier` will use it instead of creating a new one.

### Unjetify if needed

I have been thinking for a while about the reasons you might want to do this and I found none, but well, if you want to unjetify your dependencies (npm packages) do the following:

#### Using [npm](https://docs.npmjs.com/cli/npm)

```console
$ npm install --force
```

#### Using [yarn](https://yarnpkg.com)

```console
$ yarn install --force
```

## License

[MIT](LICENSE.txt) :copyright: **Jumpn Limited**