import { IWithinRangeNumberTag } from "@pagopa/ts-commons/lib/numbers";
import * as express from "express";
import * as bodyParserXml from "express-xml-bodyparser";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { IWithinRangeStringTag } from "@pagopa/ts-commons/lib/strings";
import * as morgan from "morgan";
import { DateFromString } from "@pagopa/ts-commons/lib/dates";
import { CONFIG, Configuration } from "./config";
import { closePayment, ClosePaymentRequest } from "./fixtures/closePayment";
import {
  activateIOPaymenResponse,
  activatePaymenNoticeResponse,
  NodoAttivaRPT,
  NodoVerificaRPT,
  VerifyPaymentNoticeResponse
} from "./fixtures/nodoRPTResponses";
import * as FespCdClient from "./services/pagopa_api/FespCdClient";
import {
  PAA_PAGAMENTO_DUPLICATO,
  PPT_ERRORE_EMESSO_DA_PAA,
  PPT_MULTI_BENEFICIARIO
} from "./utils/helper";
import { logger } from "./utils/logger";

const avvisoMultiBeneficiario = new RegExp("^.*30200.*");
const avvisoPAIbanNotConfigured = new RegExp("^.*30201.*");

// eslint-disable-next-line max-lines-per-function
export const newExpressApp = async (
  config: Configuration
): Promise<Express.Application> => {
  const app = express();
  app.set("port", config.NODO_MOCK.PORT);
  const loggerFormat =
    ":date[iso] [info]: :method :url :status - :response-time ms";
  app.use(morgan(loggerFormat));

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(bodyParserXml({}));

  // SOAP Server mock entrypoint
  // eslint-disable-next-line max-lines-per-function, sonarjs/cognitive-complexity
  app.post(config.NODO_MOCK.ROUTES.PPT_NODO, async (req, res) => {
    const soapRequest = req.body["soap:envelope"]["soap:body"][0];
    logger.info("Rx request : ");
    logger.info(soapRequest);
    // The SOAP request is a NodoAttivaRPT request
    // eslint-disable-next-line sonarjs/no-duplicate-string
    if (soapRequest["ppt:nodoattivarpt"] || soapRequest["ns3:nodoattivarpt"]) {
      const nodoAttivaRPT = soapRequest["ppt:nodoattivarpt"]
        ? soapRequest["ppt:nodoattivarpt"][0]
        : soapRequest["ns3:nodoattivarpt"][0];
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

      // eslint-disable-next-line sonarjs/no-duplicate-string
      const iuv = nodoAttivaRPT.codiceidrpt[0]["qrc:qrcode"]
        ? nodoAttivaRPT.codiceidrpt[0]["qrc:qrcode"][0]["qrc:codiuv"][0]
        : nodoAttivaRPT.codiceidrpt[0].qrcode[0].codiuv[0];

      const isIuvMultiBeneficiario = avvisoMultiBeneficiario.test(iuv);

      logger.info(`nodoattivarpt IUV ${iuv}`);

      if (isIuvMultiBeneficiario) {
        const nodoAttivaErrorResponse = NodoAttivaRPT({
          esito: "KO",
          fault: {
            faultCode: PPT_MULTI_BENEFICIARIO.value,
            faultString: "Avviso Multi Beneficiario",
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
    // eslint-disable-next-line no-console
    console.log("Check SOAP request is a NodoVerificaRPT request");
    if (
      // eslint-disable-next-line sonarjs/no-duplicate-string
      soapRequest["ppt:nodoverificarpt"] ||
      soapRequest["ns3:nodoverificarpt"]
    ) {
      const nodoVerificaRPT = soapRequest["ppt:nodoverificarpt"]
        ? soapRequest["ppt:nodoverificarpt"][0]
        : soapRequest["ns3:nodoverificarpt"][0];
      const iuv = nodoVerificaRPT.codiceidrpt[0]["qrc:qrcode"]
        ? nodoVerificaRPT.codiceidrpt[0]["qrc:qrcode"][0]["qrc:codiuv"][0]
        : nodoVerificaRPT.codiceidrpt[0].qrcode[0].codiuv[0];
      logger.info(`nodoverificarpt IUV ${iuv}`);
      const isIuvMultiBeneficiario = avvisoMultiBeneficiario.test(iuv);
      const isIuvPAIbanNotConfigured = avvisoPAIbanNotConfigured.test(iuv);
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
      if (isIuvMultiBeneficiario) {
        const nodoVerificaErrorResponse = NodoVerificaRPT({
          esito: "KO",
          fault: {
            faultCode: PPT_MULTI_BENEFICIARIO.value,
            faultString: "Avviso Multi Beneficiario",
            id: "0"
          }
        });
        return res
          .status(nodoVerificaErrorResponse[0])
          .send(nodoVerificaErrorResponse[1]);
      }
      if (isIuvPAIbanNotConfigured) {
        const nodoVerificaErrorResponse = NodoVerificaRPT({
          esito: "KO",
          fault: {
            faultCode: PPT_ERRORE_EMESSO_DA_PAA.value,
            faultString: "Errore emesso da pa",
            id: "0",
            originalDescription: "PAA - Errore emesso da pa",
            originalFaultCode: PAA_PAGAMENTO_DUPLICATO.value,
            originalFaultString: "PAA - Errore emesso da pa"
          }
        });

        return res
          .status(nodoVerificaErrorResponse[0])
          .send(nodoVerificaErrorResponse[1]);
      }
      const importoSingoloVersamento = 1.0 as
        | 99999999.99
        | (number & IWithinRangeNumberTag<0, 99999999.99>);
      const nodoVerificaSuccessResponse = NodoVerificaRPT({
        datiPagamento: { importoSingoloVersamento },
        esito: "OK"
      });
      logger.info(nodoVerificaSuccessResponse);
      return res
        .status(nodoVerificaSuccessResponse[0])
        .send(nodoVerificaSuccessResponse[1]);
    }
    // The SOAP request is a verifypaymentnoticereq request
    if (
      soapRequest["nfpsp:verifypaymentnoticereq"] ||
      soapRequest["ns2:verifypaymentnoticereq"]
    ) {
      const amountNotice = "2.00";
      const verifyPaymentNoticeRes = VerifyPaymentNoticeResponse({
        amount: +amountNotice,
        dueDate: pipe(
          DateFromString.decode("2025-07-31"),
          E.getOrElseW(_ => undefined)
        ),
        outcome: "OK"
      });
      return res
        .status(verifyPaymentNoticeRes[0])
        .send(verifyPaymentNoticeRes[1]);
    }
    // The SOAP request is a activateiopaymentreq request
    // NOTE : activateIOPayment is a special request of the canonical activatePaymentNotice made available by NODO for the PSPs.
    //        It's only used by the appIO for new multi-beneficiary payments.
    //        To details see :
    //        activateIOPaymentRes :  https://github.com/pagopa/pagopa-api/blob/0d2ae003abc7cdcd55e339af41220adbe4a59b06/cd/nodeForIO.xsd#L479
    //        activatePaymentNoticeRes : https://github.com/pagopa/pagopa-api/blob/0d2ae003abc7cdcd55e339af41220adbe4a59b06/nodo/nodeForPsp.xsd#L709
    if (soapRequest["nfpsp:activateiopaymentreq"]) {
      const amountNotice = "2.00";
      const activateIOPaymenRes = activateIOPaymenResponse({
        amount: +amountNotice,
        outcome: "OK"
      });
      return res.status(activateIOPaymenRes[0]).send(activateIOPaymenRes[1]);
    }
    if (soapRequest["ns2:activatepaymentnoticereq"]) {
      const activatePaymenRes = activatePaymenNoticeResponse();
      return res.status(activatePaymenRes[0]).send(activatePaymenRes[1]);
    }
    // The SOAP Request not implemented
    res.status(404).send("Not found");
  });

  app.post("/v2/closepayment", async (req, res) =>
    pipe(
      ClosePaymentRequest.decode(req.body),
      E.map(closePayment),
      E.map(([response, status]) => res.status(status).json(response)),
      E.mapLeft(errors => {
        logger.error(errors);
        return res
          .status(400)
          .json({ descrizione: "closePayment: bad request", esito: "KO" });
      })
    )
  );

  app.get("/nodo-per-pm/v1/informazioniPagamento", async (req, res) =>
    res.status(200).json({
      IBAN: "IT96R0123451234512345678904",
      bolloDigitale: false,
      codiceFiscale: "RCCGLD09P09H502E",
      dettagli: [
        {
          CCP: "35727",
          IUV: "11000554726628192",
          codicePagatore: "RCCGLD09P09H501E",
          enteBeneficiario: "AZIENDA XXX",
          idDominio: "11111111111",
          importo: 11.0,
          nomePagatore: "Gesualdo;Riccitelli",
          tipoPagatore: "F"
        }
      ],
      email: "gesualdo.riccitelli@poste.it",
      importoTotale: 11.0,
      oggettoPagamento: "RFB/11000554726628192/11.00/TXT/pagamento/RPT/by/mock",
      ragioneSociale: "Pa per tutti",
      urlRedirectEC:
        "http://localhost:81/pa?qstr=/prova&idSession=737b6191-6d48-43a5-99ea-0e1b2d2d3cea&idDominio=11111111111"
    })
  );

  return app;
};
