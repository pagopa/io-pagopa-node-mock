import * as express from "express";
import * as bodyParserXml from "express-xml-bodyparser";
import { IWithinRangeStringTag } from "italia-ts-commons/lib/strings";
import * as morgan from "morgan";
import { CONFIG, Configuration } from "./config";
import { NodoAttivaRPT, NodoVerificaRPT } from "./fixtures/nodoRPTResponses";
import * as FespCdClient from "./services/pagopa_api/FespCdClient";
import { logger } from "./utils/logger";

export async function newExpressApp(
  config: Configuration
): Promise<Express.Application> {
  const app = express();
  app.set("port", config.NODO_MOCK.PORT);
  const loggerFormat =
    ":date[iso] [info]: :method :url :status - :response-time ms";
  app.use(morgan(loggerFormat));

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(bodyParserXml({}));

  // SOAP Server mock entrypoint
  app.post(config.NODO_MOCK.ROUTES.PPT_NODO, async (req, res) => {
    const soapRequest = req.body["soap:envelope"]["soap:body"][0];
    // The SOAP request is a NodoAttivaRPT request
    if (soapRequest["ppt:nodoattivarpt"]) {
      const nodoAttivaRPT = soapRequest["ppt:nodoattivarpt"][0];
      const password = nodoAttivaRPT.password[0];
      if (password !== config.PAGOPA_PROXY.PASSWORD) {
        const nodoAttivaErrorResponse = NodoAttivaRPT({
          esito: "KO",
          fault: {
            faultCode: "401",
            faultString: "Invalid password",
            id: "0"
          }
        });
        return res
          .status(nodoAttivaErrorResponse[0])
          .send(nodoAttivaErrorResponse[1]);
      }
      const importoSingoloVersamento =
        nodoAttivaRPT.datipagamentopsp[0].importosingoloversamento[0];
      const codiceContestoPagamento = nodoAttivaRPT.codicecontestopagamento[0];
      const nodoAttivaSuccessResponse = NodoAttivaRPT({
        datiPagamento: { importoSingoloVersamento },
        esito: "OK"
      });
      // Async call to PagoPa Proxy FespCd SOAP service
      setTimeout(async () => {
        const pagoPaProxyClient = new FespCdClient.FespCdClientAsync(
          await FespCdClient.createFespCdClient({
            endpoint: `${CONFIG.PAGOPA_PROXY.HOST}:${CONFIG.PAGOPA_PROXY.PORT}${CONFIG.PAGOPA_PROXY.WS_SERVICES.FESP_CD}`,
            wsdl_options: {
              timeout: 1000
            }
          })
        );
        try {
          await pagoPaProxyClient.cdInfoWisp({
            codiceContestoPagamento,
            // Fake paymentId
            idPagamento: Math.random()
              .toString(36)
              .slice(2)
              .toUpperCase(), // TODO: Check required format
            identificativoDominio: "1" as (string &
              IWithinRangeStringTag<1, 36>),
            identificativoUnivocoVersamento:
              // Fake paymentId
              Math.random()
                .toString(36)
                .slice(2)
                .toUpperCase() as (string & IWithinRangeStringTag<1, 36>) // TODO: check required format
          });
        } catch (err) {
          logger.error(err);
        }
      }, 1000);
      return res
        .status(nodoAttivaSuccessResponse[0])
        .send(nodoAttivaSuccessResponse[1]);
    }
    // The SOAP request is a NodoVerificaRPT request
    if (soapRequest["ppt:nodoverificarpt"]) {
      const nodoVerificaRPT = soapRequest["ppt:nodoverificarpt"][0];
      const password = nodoVerificaRPT.password[0];
      if (password !== config.PAGOPA_PROXY.PASSWORD) {
        const nodoVerificaErrorResponse = NodoVerificaRPT({
          esito: "KO",
          fault: {
            faultCode: "401",
            faultString: "Invalid password",
            id: "0"
          }
        });
        return res
          .status(nodoVerificaErrorResponse[0])
          .send(nodoVerificaErrorResponse[1]);
      }
      const importoSingoloVersamento = "1.00";
      const nodoVerificaSuccessResponse = NodoVerificaRPT({
        datiPagamento: { importoSingoloVersamento },
        esito: "OK"
      });
      return res
        .status(nodoVerificaSuccessResponse[0])
        .send(nodoVerificaSuccessResponse[1]);
    }
    // The SOAP Request not implemented
    res.status(404).send("Not found");
  });
  return app;
}
