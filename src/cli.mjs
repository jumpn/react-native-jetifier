// @flow

import * as withJetificableGroup from "./jetificableGroup";
import * as withRnJetifier from "./rnJetifier";
import * as withState from "./cliState";

const jetificableGroupsPath = "./jetificableGroups.json";

const finish = (rnJetifier, jetificableGroups) =>
  withJetificableGroup
    .save(jetificableGroupsPath, jetificableGroups)
    .then(() => withJetificableGroup.jetifyAll(rnJetifier, jetificableGroups));

const onJetificableGroups = (state, rnJetifier) => jetificableGroups =>
  finish(rnJetifier, [...state.jetificableGroups, ...jetificableGroups]);

const onRnJetifier = state => rnJetifier =>
  withJetificableGroup
    .retrieveAllFrom(rnJetifier, state.packageInfos)
    .then(onJetificableGroups(state, rnJetifier));

const start = state => withRnJetifier.retrieve().then(onRnJetifier(state));

const onState = state => {
  if (state.packageInfos.length > 0) {
    start(state);
  }
};

const run = () => withState.create(jetificableGroupsPath).then(onState);

export {run};
