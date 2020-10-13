/**
 * Handler interface for PPTPortType SOAP Endpoint
 */

// tslint:disable:no-any
import { nodoAttivaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";
import { nodoAttivaRPTRisposta_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPTRisposta_element_ppt";
import { nodoVerificaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPT_element_ppt";
import { nodoVerificaRPTRisposta_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPTRisposta_element_ppt";
import { SoapMethodCB } from "../utils/soap";

export interface IPPTPortSoap {
  readonly nodoVerificaRPT: SoapMethodCB<
    nodoVerificaRPT_element_ppt,
    nodoVerificaRPTRisposta_element_ppt
  >;
  readonly nodoAttivaRPT: SoapMethodCB<
    nodoAttivaRPT_element_ppt,
    nodoAttivaRPTRisposta_element_ppt
  >;
}
