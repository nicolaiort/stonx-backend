import {join} from "path";
import {loggerConfig} from "./logger";
import typeormConfig from "./typeorm";

const {version} = require("../../package.json");
export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
  // additional shared configuration
};
