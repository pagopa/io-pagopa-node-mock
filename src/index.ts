import * as App from "./app";
import { CONFIG, Configuration } from "./config";
import { logger } from "./utils/logger";
import { reporters } from "italia-ts-commons";

// Retrieve server configuration
const config = Configuration.decode(CONFIG).getOrElseL(errors => {
  throw Error(`Invalid configuration: ${reporters.readableReport(errors)}`);
});

App.startApp(config).catch(error => {
  logger.error(`Error occurred starting server: ${error}`);
});
