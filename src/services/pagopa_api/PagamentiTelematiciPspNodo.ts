/**
 * Define FespCd SOAP Servers to expose to PagoPa
 */

import * as core from "express-serve-static-core";
import {
  IWithinRangeStringTag,
  NonEmptyString
} from "italia-ts-commons/lib/strings";
import * as path from "path";
import * as soap from "soap";

import { readWsdl } from "../../utils/soap";

import { nodoAttivaRPT_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";
import { nodoAttivaRPTRisposta_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPTRisposta_element_ppt";
import { nodoVerificaRPT_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPT_element_ppt";
import { nodoVerificaRPTRisposta_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPTRisposta_element_ppt";

import { PagoPAProxyConfig } from "../../config";
import { logger } from "../../utils/logger";
import * as FespCdClient from "./FespCdClient";

// WSDL path for FespCd
const PPT_WSDL_PATH = path.join(
  __dirname,
  "./../../wsdl/NodoPerPsp.wsdl"
) as NonEmptyString;

/**
 * Attach FespCd SOAP service to a server instance
 * @param {core.Express} server - The server instance to use to expose services
 * @param {NonEmptyString} path - The endpoint path
 * @param {IFespCdPortTypeSoap} pagamentiTelematiciPspNodoHandlers - The service controller
 * @return {Promise<soap.Server>} The soap server defined and started
 */
export async function attachPagamentiTelematiciPspNodoServer(
  server: core.Express,
  apiPath: NonEmptyString,
  pagamentiTelematiciPspNodoHandlers: soap.IServicePort
): Promise<soap.Server> {
  const wsdl = await readWsdl(PPT_WSDL_PATH);
  const service = {
    PagamentiTelematiciPspNodoservice: {
      PPTPort: pagamentiTelematiciPspNodoHandlers
    }
  };
  return soap.listen(server, apiPath, service, wsdl);
}

export const PagamentiTelematiciPspNodoServiceHandler: (
  pagoPaProxyConf: PagoPAProxyConfig
) => soap.IServicePort = (pagoPaProxyConf: PagoPAProxyConfig) => ({
  nodoAttivaRPT: (
    input: unknown,
    callback?: (value: nodoAttivaRPTRisposta_element_ppt) => void
  ) => {
    nodoAttivaRPT_element_ppt.decode(input).bimap(
      err => {
        return callback
          ? callback({
              nodoAttivaRPTRisposta: {
                esito: "KO"
              }
            })
          : err;
      },
      _ => {
        if (callback && _.password === pagoPaProxyConf.PASSWORD) {
          callback({
            nodoAttivaRPTRisposta: {
              datiPagamentoPA: {
                causaleVersamento: "Causale versamento mock" as (string &
                  IWithinRangeStringTag<1, 141>),
                ibanAccredito: "IT47L0300203280645139156879",
                importoSingoloVersamento:
                  _.datiPagamentoPSP.importoSingoloVersamento
              },
              esito: "OK"
            }
          });
          setTimeout(async () => {
            const pagoPaProxyClient = new FespCdClient.FespCdClientAsync(
              await FespCdClient.createFespCdClient({
                endpoint: `${pagoPaProxyConf.HOST}:${pagoPaProxyConf.PORT}${pagoPaProxyConf.WS_SERVICES.FESP_CD}`,
                wsdl_options: {
                  timeout: 1000
                }
              })
            );
            try {
              await pagoPaProxyClient.cdInfoWisp({
                codiceContestoPagamento: _.codiceContestoPagamento,
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
        } else if (callback) {
          callback({
            nodoAttivaRPTRisposta: {
              esito: "KO",
              fault: {
                faultCode: "401",
                faultString: "Invalid password",
                id: "0"
              }
            }
          });
        } else {
          return _;
        }
      }
    );
  },
  nodoVerificaRPT: (
    input: unknown,
    callback?: (value: nodoVerificaRPTRisposta_element_ppt) => void
  ) => {
    nodoVerificaRPT_element_ppt.decode(input).bimap(
      err => {
        return callback
          ? callback({
              nodoVerificaRPTRisposta: {
                esito: "KO"
              }
            })
          : err;
      },
      _ => {
        return callback && _.password === pagoPaProxyConf.PASSWORD
          ? callback({
              nodoVerificaRPTRisposta: {
                datiPagamentoPA: {
                  causaleVersamento: "Causale di versamento mock" as (string &
                    IWithinRangeStringTag<1, 141>),
                  ibanAccredito: "IT47L0300203280645139156879",
                  importoSingoloVersamento: 100
                },
                esito: "OK"
              }
            })
          : callback
          ? callback({
              nodoVerificaRPTRisposta: {
                esito: "KO",
                fault: {
                  faultCode: "401",
                  faultString: "Invalid password",
                  id: "0"
                }
              }
            })
          : _;
      }
    );
  }
});
