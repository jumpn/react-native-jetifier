// @flow

import * as withJetificableGroup from "./jetificableGroup";
import * as withRnJetifier from "./rnJetifier";
import * as withState from "./cliState";

const jetificableGroupsPath = "./jetificableGroups.json";

const jetifyAllJetificableGroups = (rnJetifier, jetificableGroups) =>
  jetificableGroups.forEach(withJetificableGroup.jetify(rnJetifier));

const saveAndJetifyJetificableGroups = (rnJetifier, jetificableGroups) =>
  withJetificableGroup
    .save(jetificableGroupsPath, jetificableGroups)
    .then(() => jetifyAllJetificableGroups(rnJetifier, jetificableGroups));

const onJetificableGroups = (rnJetifier, state) => jetificableGroups =>
  saveAndJetifyJetificableGroups(rnJetifier, [
    ...state.jetificableGroups,
    ...jetificableGroups
  ]);

const retrieveJetificableGroups = (rnJetifier, state) =>
  withJetificableGroup
    .retrieveAllFrom(rnJetifier, state.packageInfos)
    .then(onJetificableGroups(rnJetifier, state));

const onRetrieveDependencies = ([rnJetifier, state]) => {
  if (state.packageInfos.length === 0) {
    jetifyAllJetificableGroups(rnJetifier, state.jetificableGroups);
  } else {
    retrieveJetificableGroups(rnJetifier, state);
  }
};

const retrieveDependencies = () =>
  Promise.all([
    withRnJetifier.retrieve(),
    withState.create(jetificableGroupsPath)
  ]);

const run = () => retrieveDependencies().then(onRetrieveDependencies);

export {run};
