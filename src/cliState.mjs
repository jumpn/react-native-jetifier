// @flow

import * as withJetificableGroup from "./jetificableGroup";
import * as withPackageInfo from "./packageInfo";

import type {JetificableGroup} from "./jetificableGroup";
import type {PackageInfo} from "./packageInfo";

type CliState = {|
  jetificableGroups: Array<JetificableGroup>,
  packageInfos: Array<PackageInfo>
|};

const createWithoutSavedJetificableGroups = allPackageInfos => ({
  jetificableGroups: [],
  packageInfos: allPackageInfos
});

const addPackageInfo = ({jetificableGroups, packageInfos}, packageInfo) => ({
  jetificableGroups,
  packageInfos: [...packageInfos, packageInfo]
});

const addJetificableGroup = (
  {jetificableGroups, packageInfos},
  jetificableGroup
) => ({
  packageInfos,
  jetificableGroups: [...jetificableGroups, jetificableGroup]
});

const addPackageInfoOrJetificableGroupUsing = (
  cliState,
  packageInfo,
  maybeJetificableGroup
) =>
  maybeJetificableGroup
    ? addJetificableGroup(cliState, maybeJetificableGroup)
    : addPackageInfo(cliState, packageInfo);

const addPackageInfoOrJetificableGroup = savedJetificableGroups => (
  cliState,
  packageInfo
) =>
  addPackageInfoOrJetificableGroupUsing(
    cliState,
    packageInfo,
    withJetificableGroup.getWith(savedJetificableGroups, packageInfo)
  );

const createWithSavedJetificableGroups = (
  allPackageInfos,
  savedJetificableGroups
) =>
  allPackageInfos.reduce(
    addPackageInfoOrJetificableGroup(savedJetificableGroups),
    {jetificableGroups: [], packageInfos: []}
  );

const onRetrieveDependencies = ([allPackageInfos, savedJetificableGroups]) =>
  savedJetificableGroups
    ? createWithSavedJetificableGroups(allPackageInfos, savedJetificableGroups)
    : createWithoutSavedJetificableGroups(allPackageInfos);

const retrieveDependencies = jetificableGroupsPath =>
  Promise.all([
    withPackageInfo.retrieveAllFrom(),
    withJetificableGroup.retrieveSavedIfAny(jetificableGroupsPath)
  ]);

const create = (jetificableGroupsPath: string): Promise<CliState> =>
  retrieveDependencies(jetificableGroupsPath).then(onRetrieveDependencies);

export {create};

export type {CliState};
