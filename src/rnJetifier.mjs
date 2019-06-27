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

type JetifyContext = {|
  jetificable: string,
  wasJetified: boolean
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

const getFromClassRegExp = fromClass => new RegExp(fromClass, "g");

const create = ({fromClasses, toClasses}) => ({
  fromClasses,
  toClasses,
  fromClassRegExps: fromClasses.map(getFromClassRegExp)
});

const readInfo = () => withJsonFile.read<RnJetifier>(rnJetifierInfoJsonPath);

const retrieve = (): Promise<RnJetifier> => readInfo().then(create);

const writeJetificableIfJetified = jetificablePath => ({
  jetificable,
  wasJetified
}) => {
  if (wasJetified) {
    withUtf8File.write(jetificablePath, jetificable);
  }
};

const jetify = (rnJetifier, jetificable, jetificationIndex) =>
  jetificable.replace(
    rnJetifier.fromClassRegExps[jetificationIndex],
    rnJetifier.toClasses[jetificationIndex]
  );

const applyJetification = (rnJetifier, {jetificable}, jetificationIndex) => ({
  jetificable: jetify(rnJetifier, jetificable, jetificationIndex),
  wasJetified: true
});

const applyJetificationIfNeeded = rnJetifier => (
  context,
  jetificationFromClass,
  jetificationIndex
) =>
  context.jetificable.includes(jetificationFromClass)
    ? applyJetification(rnJetifier, context, jetificationIndex)
    : context;

const applyAllJetifications = rnJetifier => jetificable =>
  rnJetifier.fromClasses.reduce<JetifyContext>(
    applyJetificationIfNeeded(rnJetifier),
    {jetificable, wasJetified: false}
  );

const jetifyIfNeeded = (rnJetifier: RnJetifier) => (jetificablePath: string) =>
  withUtf8File
    .read(jetificablePath)
    .then(applyAllJetifications(rnJetifier))
    .then(writeJetificableIfJetified(jetificablePath));

export {jetifyIfNeeded, retrieve, retrieveJetificablePathsFrom, writeInfoFrom};

export type {RnJetifier};
