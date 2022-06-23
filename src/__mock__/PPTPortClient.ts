/**
 * Define SOAP Clients to call PPTPort services provided by PagoPa
 */

import * as soap from "soap";
import { nodoAttivaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";

import {
  createClient,
  fixImportoSingoloVersamentoDigits,
  promisifySoapMethod
} from "../utils/soap";
import { IPPTPortSoap } from "./IPPTPortSoap";

// WSDL path for PagamentiTelematiciPspNodo
export const PAGAMENTI_TELEMATICI_PSP_WSDL_PATH = `${__dirname}/../wsdl/NodoPerPsp.wsdl`;

/**
 * Create a client for PagamentiTelematiciPspNodo SOAP service
 * @param {soap.IOptions} options - Soap options
 * @return {Promise<soap.Client & IPPTPortSoap>} Soap client created
 */
export function createPagamentiTelematiciPspNodoClient(
  options: soap.IOptions,
  cert?: string,
  key?: string,
  hostHeader?: string
): Promise<soap.Client & IPPTPortSoap> {
  return createClient<IPPTPortSoap>(
    PAGAMENTI_TELEMATICI_PSP_WSDL_PATH,
    options,
    cert,
    key,
    hostHeader
  );
}

/**
 * Converts the callback based methods of a PagamentiTelematiciPspNodo client to
 * promise based methods.
 */
export class PagamentiTelematiciPspNodoAsyncClient {
  public readonly nodoVerificaRPT = promisifySoapMethod(
    this.client.nodoVerificaRPT
  );

  constructor(private readonly client: IPPTPortSoap) {}

  public readonly nodoAttivaRPT = (args: nodoAttivaRPT_element_ppt) =>
    promisifySoapMethod(this.client.nodoAttivaRPT)(args, {
      postProcess: fixImportoSingoloVersamentoDigits
    });
}
