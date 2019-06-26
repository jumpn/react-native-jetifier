// @flow

import * as withJetificableGroup from "./jetificableGroup";
import * as withRnJetifier from "./rnJetifier";
import * as withState from "./cliState";

const jetificableGroupsPath = "./jetificableGroups.json";

const saveAndJetifyJetificableGroups = (rnJetifier, jetificableGroups) =>
  withJetificableGroup
    .save(jetificableGroupsPath, jetificableGroups)
    .then(() => withJetificableGroup.jetifyAll(rnJetifier, jetificableGroups));

const onJetificableGroups = (state, rnJetifier) => jetificableGroups =>
  saveAndJetifyJetificableGroups(rnJetifier, [
    ...state.jetificableGroups,
    ...jetificableGroups
  ]);

const retrieveJetificableGroups = (rnJetifier, state) =>
  withJetificableGroup
    .retrieveAllFrom(rnJetifier, state.packageInfos)
    .then(onJetificableGroups(state, rnJetifier));

const onRetrieveDependencies = ([rnJetifier, state]) => {
  if (state.packageInfos.length > 0) {
    retrieveJetificableGroups(rnJetifier, state);
  } else {
    withJetificableGroup.jetifyAll(rnJetifier, state.jetificableGroups);
  }
};

const retrieveDependencies = () =>
  Promise.all([
    withRnJetifier.retrieve(),
    withState.create(jetificableGroupsPath)
  ]);

const run = () => retrieveDependencies().then(onRetrieveDependencies);

export {run};
