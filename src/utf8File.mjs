// @flow

import fs from "fs";

const write = (filePath: string, data: string) =>
  fs.promises.writeFile(filePath, data);

const read = (filePath: string) => fs.promises.readFile(filePath, "utf8");

export {read, write};
