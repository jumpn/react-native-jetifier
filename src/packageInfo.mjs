// @flow

import glob from "fast-glob";

import * as withArray from "./array";
import * as withJsonFile from "./jsonFile";

import type {ExactShape} from "./flow";

type PackageManifest = {|
  name: string,
  version: string
|};

type PackageInfo = {|
  name: string,
  path: string,
  version: string
|};

const create = (
  packageManifestPath,
  {name, version}: PackageManifest
): PackageInfo => ({
  name,
  version,
  path: packageManifestPath.replace("/package.json", "")
});

const canRetrieveFrom = maybePackageManifest =>
  "name" in maybePackageManifest && "version" in maybePackageManifest;

const retrieveIfAnyFromUsing = packageManifestPath => (
  maybePackageManifest: ExactShape<PackageManifest>
) =>
  canRetrieveFrom(maybePackageManifest)
    ? create(packageManifestPath, (maybePackageManifest: any))
    : undefined;

const retrieveIfAnyFrom = packageManifestPath =>
  withJsonFile
    .read(packageManifestPath)
    .then(retrieveIfAnyFromUsing(packageManifestPath));

const retrieveAllFromUsing = (allPackageManifestPaths: Array<string>) =>
  Promise.all(allPackageManifestPaths.map(retrieveIfAnyFrom)).then(
    withArray.filter(Boolean)
  );

const packageManifestsGlobs = [
  "**/node_modules/*/package.json",
  "**/node_modules/*/*/package.json"
];

const retrieveAllFrom = (packagePath?: string): Promise<Array<PackageInfo>> =>
  glob(packageManifestsGlobs, {cwd: packagePath}).then(retrieveAllFromUsing);

export {retrieveAllFrom};

export type {PackageInfo};
