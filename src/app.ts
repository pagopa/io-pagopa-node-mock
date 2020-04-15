import * as express from "express";
import * as http from "http";
import * as morgan from "morgan";
import { Configuration } from "./config";
import * as PagamentiTelematiciPspNodoServer from "./services/pagopa_api/PagamentiTelematiciPspNodo";
import { logger } from "./utils/logger";

export async function startApp(config: Configuration): Promise<http.Server> {
  const app = express();
  app.set("port", config.CONTROLLER.PORT);
  const loggerFormat =
    ":date[iso] [info]: :method :url :status - :response-time ms";
  app.use(morgan(loggerFormat));

  const soapServer = await PagamentiTelematiciPspNodoServer.attachPagamentiTelematiciPspNodoServer(
    app,
    config.CONTROLLER.ROUTES.SOAP.NODO_VERIFICA_RPT,
    PagamentiTelematiciPspNodoServer.PagamentiTelematiciPspNodoServiceHandler
  );
  const server = http.createServer(app);
  server.listen(config.CONTROLLER.PORT);
  // tslint:disable-next-line: no-object-mutation
  soapServer.log = (type, data) => {
    console.log("TYPE: ", type);
    console.log("DATA: ", data);
  };
  logger.info(
    `Server started at ${config.CONTROLLER.HOST}:${config.CONTROLLER.PORT}`
  );
  return server;
}

export function stopServer(server: http.Server): void {
  logger.info("Stopping Proxy PagoPA Server...");
  server.close();
}
