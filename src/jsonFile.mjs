// @flow

import * as withUtf8File from "./utf8File";

type Jsonificable = null | string | number | boolean | {...} | Array<mixed>;

const write = <Data: Jsonificable>(
  jsonPath: string,
  data: Data
): Promise<Data> =>
  withUtf8File.write(jsonPath, JSON.stringify(data)).then(() => data);

const read = <Data>(jsonPath: string): Promise<Data> =>
  withUtf8File.read(jsonPath).then(JSON.parse);

export {read, write};
