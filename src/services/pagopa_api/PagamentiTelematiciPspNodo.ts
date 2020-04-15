/**
 * Define FespCd SOAP Servers to expose to PagoPa
 */

import * as core from "express-serve-static-core";
import { NonEmptyString } from "italia-ts-commons/lib/strings";
import * as soap from "soap";
import * as path from "path";

import { readWsdl } from "../../utils/soap";

import { nodoAttivaRPT_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";
import { nodoVerificaRPT_element_ppt } from "../../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPT_element_ppt";

// WSDL path for FespCd
const PPT_WSDL_PATH = path.join(
  __dirname,
  "/../../../src/wsdl/NodoPerPsp.wsdl"
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

export const PagamentiTelematiciPspNodoServiceHandler: soap.IServicePort = {
  nodoAttivaRPT: (input: unknown, callback) => {
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
        return callback
          ? callback({
              nodoAttivaRPTRisposta: {
                esito: "OK"
              }
            })
          : _;
      }
    );
  },
  nodoVerificaRPT: (input: unknown, callback) => {
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
        return callback
          ? callback({
              nodoVerificaRPTRisposta: {
                esito: "OK"
              }
            })
          : _;
      }
    );
  }
};
