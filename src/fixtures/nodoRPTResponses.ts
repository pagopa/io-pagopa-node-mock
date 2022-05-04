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

interface IActivateIOPaymentReq {
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
        ${
          params.fault.originalFaultCode
            ? // tslint:disable-next-line:no-nested-template-literals
              `<originalFaultCode>${params.fault.originalFaultCode}</originalFaultCode>
          <originalDescription>${params.fault.originalDescription}</originalDescription>
          <originalFaultString>${params.fault.originalFaultString}</originalFaultString>`
            : ""
        }
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
  `<?xml version="1.0" encoding="UTF-8" standalone="no" ?><soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd" xmlns:tns="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.wsdl"><soapenv:Body><nfpsp:verifyPaymentNoticeRes><outcome>OK</outcome><paymentList><paymentOptionDescription><amount>17.00</amount><options>EQ</options><paymentNote>/RFB/349192200032537944/17.00/TXT/Reversale W14680/2022 CF: INCIDENTI  STRADALI||||</paymentNote></paymentOptionDescription></paymentList><paymentDescription>Reversale W14680/2022 CF: INCIDENTI  STRADALI||||</paymentDescription><fiscalCodePA>02438750586</fiscalCodePA><companyName>Roma Capitale</companyName><officeName>CORPO DI POLIZIA LOCALE DI ROMA CAPITALE</officeName></nfpsp:verifyPaymentNoticeRes></soapenv:Body></soapenv:Envelope>`
];

export const activateIOPaymenResponse = (
  params: IActivateIOPaymentReq
): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
  <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForIO.xsd">
   <soapenv:Body>
    <nfpsp:activateIOPaymentRes>
     <outcome>OK</outcome>
     <totalAmount>100.00</totalAmount>
     <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
     <fiscalCodePA>80017010721</fiscalCodePA>
     <paymentToken>4d500e9908714202b55751ed6b1dfdf3</paymentToken>
     <creditorReferenceId>01225090200079679</creditorReferenceId>
    </nfpsp:activateIOPaymentRes>
   </soapenv:Body>
  </soapenv:Envelope>
 `
];

export const activatePaymenNoticeResponse = (
): MockResponse => [
  200,
  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForIO.xsd">
   <soapenv:Body>
    <nfpsp:activatePaymentNoticeRes>
     <outcome>OK</outcome>
     <totalAmount>100.00</totalAmount>
     <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
     <fiscalCodePA>80017010721</fiscalCodePA>
     <paymentToken>4d500e9908714202b55751ed6b1dfdf3</paymentToken>
     <creditorReferenceId>01225090200079679</creditorReferenceId>
    </nfpsp:activatePaymentNoticeRes>
   </soapenv:Body>
  </soapenv:Envelope>
 `
];
