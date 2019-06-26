// @flow

import glob from "fast-glob";

import dirName from "./dirName";
import * as withArray from "./array";
import * as withJsonFile from "./jsonFile";
import * as withUtf8File from "./utf8File";
import * as withString from "./string";

type JetificationMapping = {|
  fromClass: string,
  toClass: string
|};

type RnJetifierInfo = {|
  fromClasses: Array<string>,
  toClasses: Array<string>
|};

type RnJetifier = {|
  ...RnJetifierInfo,
  fromClassRegExps: Array<RegExp>
|};

const reduceGetInfo = ({fromClasses, toClasses}, jetificationMapping) => ({
  fromClasses: [...fromClasses, jetificationMapping.fromClass],
  toClasses: [...toClasses, jetificationMapping.toClass]
});

const getInfoFromUsing = (allJetificableMappings: Array<JetificationMapping>) =>
  allJetificableMappings.reduce(reduceGetInfo, {
    fromClasses: [],
    toClasses: []
  });

const getInfoFrom = (jetificationMappingsPath): Promise<RnJetifierInfo> =>
  withJsonFile.read(jetificationMappingsPath).then(getInfoFromUsing);

const rnJetifierInfoJsonPath = `${dirName}/rnJetifierInfo.json`;

const writeInfoFrom = (jetificationMappingsPath: string) =>
  getInfoFrom(jetificationMappingsPath).then(rnJetifierInfo =>
    withJsonFile.write(rnJetifierInfoJsonPath, rnJetifierInfo)
  );

const isJetificable = ({fromClasses}, maybeJetificable) =>
  fromClasses.some(withString.includes(maybeJetificable));

const retrieveJetificablePathIfAnyUsing = (
  rnJetifier,
  maybeJetificablePath
) => maybeJetificable =>
  isJetificable(rnJetifier, maybeJetificable)
    ? maybeJetificablePath
    : undefined;

const retrieveJetificablePathIfAny = rnJetifier => maybeJetificablePath =>
  withUtf8File
    .read(maybeJetificablePath)
    .then(retrieveJetificablePathIfAnyUsing(rnJetifier, maybeJetificablePath));

const retrieveJetificablePaths = rnJetifier => (
  maybeJetificablePaths: Array<string>
) =>
  Promise.all(
    maybeJetificablePaths.map(retrieveJetificablePathIfAny(rnJetifier))
  ).then(withArray.filter(Boolean));

const getMaybeJetificableGlobs = packagePath => [
  `${packagePath}/**/*.(java|kt|xml)`,
  `!${packagePath}/**/node_modules`
];

const retrieveJetificablePathsFrom = (
  rnJetifier: RnJetifier,
  packagePath: string
): Promise<Array<string>> =>
  glob(getMaybeJetificableGlobs(packagePath)).then(
    retrieveJetificablePaths(rnJetifier)
  );

const getFromClassRegExp = fromClasses => new RegExp(fromClasses, "g");

const create = ({fromClasses, toClasses}) => ({
  fromClasses,
  toClasses,
  fromClassRegExps: fromClasses.map(getFromClassRegExp)
});

const readInfo = () => withJsonFile.read<RnJetifier>(rnJetifierInfoJsonPath);

const retrieve = (): Promise<RnJetifier> => readInfo().then(create);

const applyJetification = (rnJetifier, jetificable, jetificationIndex) =>
  jetificable.replace(
    rnJetifier.fromClassRegExps[jetificationIndex],
    rnJetifier.toClasses[jetificationIndex]
  );

const applyJetificationIfNeeded = rnJetifier => (
  jetificable,
  jetificationFromClass,
  jetificationIndex
) =>
  jetificable.includes(jetificationFromClass)
    ? applyJetification(rnJetifier, jetificable, jetificationIndex)
    : jetificable;

const applyAllJetifications = rnJetifier => jetificable =>
  rnJetifier.fromClasses.reduce<string>(
    applyJetificationIfNeeded(rnJetifier),
    jetificable
  );

const jetify = (rnJetifier: RnJetifier) => (jetificablePath: string) =>
  withUtf8File
    .read(jetificablePath)
    .then(applyAllJetifications(rnJetifier))
    .then(jetificable => withUtf8File.write(jetificablePath, jetificable));

export {jetify, retrieve, retrieveJetificablePathsFrom, writeInfoFrom};

export type {RnJetifier};
