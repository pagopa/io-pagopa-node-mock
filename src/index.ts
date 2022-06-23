import {pipe} from "fp-ts/lib/function";
import * as http from "http";
import { reporters } from "@pagopa/ts-commons";
import * as App from "./app";
import { CONFIG, Configuration } from "./config";
import { logger } from "./utils/logger";
import * as E from "fp-ts/lib/Either";

// Retrieve server configuration
const config = pipe(Configuration.decode(CONFIG), E.getOrElseW(errors => {
  throw Error(`Invalid configuration: ${reporters.readableReport(errors)}`);
}));

// Create the Express Application
App.newExpressApp(config)
  .then(app => {
    // Create a HTTP server from the new Express Application
    const server = http.createServer(app);
    server.listen(config.NODO_MOCK.PORT);

    logger.info(
      `Server started at ${config.NODO_MOCK.HOST}:${config.NODO_MOCK.PORT}`
    );
  })
  .catch(error => {
    logger.error(`Error occurred starting server: ${error}`);
  });
