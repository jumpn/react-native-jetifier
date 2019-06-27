// @flow

import * as withRnJetifier from "./rnJetifier";
import * as withJsonFile from "./jsonFile";

import type {DictOf} from "./flow";
import type {RnJetifier} from "./rnJetifier";
import type {PackageInfo} from "./packageInfo";

type JetificableGroup = {|
  jetificablePaths: Array<string>,
  packageInfo: PackageInfo
|};

type JetificableGroupDict = DictOf<JetificableGroup>;

const getDictKey = ({name, version}: PackageInfo) => `${name}:${version}`;

const reduceCreateDict = (jetificableGroupDict, jetificableGroup) => ({
  ...jetificableGroupDict,
  [getDictKey(jetificableGroup.packageInfo)]: jetificableGroup
});

const createDict = (
  jetificableGroups: Array<JetificableGroup>
): JetificableGroupDict => jetificableGroups.reduce(reduceCreateDict, {});

const save = (filePath: string, jetificableGroups: Array<JetificableGroup>) =>
  withJsonFile.write(filePath, createDict(jetificableGroups));

const retrieveSaved = (filePath): Promise<JetificableGroupDict> =>
  withJsonFile.read(filePath);

const retrieveSavedIfAny = (filePath: string) =>
  retrieveSaved(filePath).catch(() => undefined);

const create = packageInfo => jetificablePaths => ({
  jetificablePaths,
  packageInfo
});

const retrieveFrom = rnJetifier => packageInfo =>
  withRnJetifier
    .retrieveJetificablePathsFrom(rnJetifier, packageInfo.path)
    .then(create(packageInfo));

const retrieveAllFrom = (
  rnJetifier: RnJetifier,
  packageInfos: Array<PackageInfo>
): Promise<Array<JetificableGroup>> =>
  Promise.all(packageInfos.map(retrieveFrom(rnJetifier)));

const jetify = (rnJetifier: RnJetifier) => (
  jetificableGroup: JetificableGroup
) =>
  jetificableGroup.jetificablePaths.forEach(withRnJetifier.jetify(rnJetifier));

const getWith = (
  jetificableGroupDict: JetificableGroupDict,
  packageInfo: PackageInfo
): void | JetificableGroup => jetificableGroupDict[getDictKey(packageInfo)];

export {getWith, jetify, retrieveAllFrom, retrieveSavedIfAny, save};

export type {JetificableGroup};
