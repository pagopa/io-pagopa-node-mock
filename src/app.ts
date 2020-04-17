import * as express from "express";
import * as morgan from "morgan";
import { Configuration } from "./config";
import * as PagamentiTelematiciPspNodoServer from "./services/pagopa_api/PagamentiTelematiciPspNodo";
import { logger } from "./utils/logger";

export async function newExpressApp(
  config: Configuration
): Promise<Express.Application> {
  const app = express();
  app.set("port", config.NODO_MOCK.PORT);
  const loggerFormat =
    ":date[iso] [info]: :method :url :status - :response-time ms";
  app.use(morgan(loggerFormat));

  const soapServer = await PagamentiTelematiciPspNodoServer.attachPagamentiTelematiciPspNodoServer(
    app,
    config.NODO_MOCK.ROUTES.PPT_NODO,
    PagamentiTelematiciPspNodoServer.PagamentiTelematiciPspNodoServiceHandler(
      config.PAGOPA_PROXY
    )
  );
  // tslint:disable-next-line: no-object-mutation
  soapServer.log = (type, data) => {
    logger.debug("SOAP TYPE: %s", type);
    logger.debug("SOAP DATA: %s", data);
  };
  return app;
}
