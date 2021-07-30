import { ctFaultBean_type_nfpsp } from "../generated/nodeForPsp/ctFaultBean_type_nfpsp";
import { stAmount_type_nfpsp } from "../generated/nodeForPsp/stAmount_type_nfpsp";
import { faultBean_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/faultBean_type_ppt";
import { nodoTipoDatiPagamentoPSP_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoTipoDatiPagamentoPSP_type_ppt";

type MockResponse = readonly [number, string];

interface INodoRPTRequest {
  esito: "OK" | "KO";
  datiPagamento?: nodoTipoDatiPagamentoPSP_type_ppt;
  fault?: faultBean_type_ppt;
}

interface IVerifyPaymentNoticeReq {
  outcome: "OK" | "KO";
  fault?: ctFaultBean_type_nfpsp;
  amount?: stAmount_type_nfpsp;
}

export const NodoAttivaRPT = (params: INodoRPTRequest): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:ppt="http://ws.pagamenti.telematici.gov/">
  <nodoAttivaRPTRisposta>
    <ppt:nodoAttivaRPTRisposta>
      <esito>${params.esito}</esito>
      ${
        params.datiPagamento
          ? // tslint:disable-next-line: no-nested-template-literals
            `<datiPagamentoPA>
            <causaleVersamento>Causale versamento mock</causaleVersamento>
            <ibanAccredito>IT47L0300203280645139156879</ibanAccredito>
            <importoSingoloVersamento>${params.datiPagamento.importoSingoloVersamento}</importoSingoloVersamento>
      </datiPagamentoPA>`
          : ""
      }
      
      ${
        params.fault
          ? // tslint:disable-next-line: no-nested-template-literals
            `<fault>
        <faultCode>${params.fault.faultCode}</faultCode>
        <faultString>${params.fault.faultString}</faultString>
        <id>${params.fault.id}</id>
      </fault>`
          : ""
      }
    </ppt:nodoAttivaRPTRisposta>
  </nodoAttivaRPTRisposta>
</s:Body>
</s:Envelope>`
];

export const NodoVerificaRPT = (params: INodoRPTRequest): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:ppt="http://ws.pagamenti.telematici.gov/">
  <nodoVerificaRPTRisposta>
    <ppt:nodoVerificaRPTRisposta>
      <esito>${params.esito}</esito>
      ${
        params.datiPagamento
          ? // tslint:disable-next-line: no-nested-template-literals
            `<datiPagamentoPA>
            <causaleVersamento>Causale versamento mock</causaleVersamento>
            <ibanAccredito>IT47L0300203280645139156879</ibanAccredito>
            <importoSingoloVersamento>${params.datiPagamento.importoSingoloVersamento}</importoSingoloVersamento>
      </datiPagamentoPA>`
          : ""
      }
      
      ${
        params.fault
          ? // tslint:disable-next-line: no-nested-template-literals
            `<fault>
        <faultCode>${params.fault.faultCode}</faultCode>
        <faultString>${params.fault.faultString}</faultString>
        <id>${params.fault.id}</id>
      </fault>`
          : ""
      }
    </ppt:nodoVerificaRPTRisposta>
  </nodoVerificaRPTRisposta>
</s:Body>
</s:Envelope>`
];

export const VerifyPaymentNoticeResponse = (
  params: IVerifyPaymentNoticeReq
): MockResponse => [
  200,
  `<s:Envelope xmlns:tns="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.wsdl" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd" 
  xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <nfpsp:verifyPaymentNoticeRes>
      <outcome>${params.outcome}</outcome>
      ${
        params.amount
          ? // tslint:disable-next-line: no-nested-template-literals
            `<paymentList>
        <paymentOptionDescription>
          <amount>${params.amount}</amount>
          <options>EQ</options>
          <paymentNote>test</paymentNote>
        </paymentOptionDescription>
      </paymentList>
      <paymentDescription>Pagamento di Test</paymentDescription>
      <fiscalCodePA>12345678901</fiscalCodePA>
      <companyName>companyName</companyName>
      <officeName>officeName</officeName>`
          : ""
      }      
      ${
        params.fault
          ? // tslint:disable-next-line: no-nested-template-literals
            `<fault>
        <faultCode>${params.fault.faultCode}</faultCode>
        <faultString>${params.fault.faultString}</faultString>
        <id>${params.fault.id}</id>
        <description>${params.fault.description}</description>
      </fault>`
          : ""
      }
    </nfpsp:verifyPaymentNoticeRes>
  </s:Body>
</s:Envelope> `
];
