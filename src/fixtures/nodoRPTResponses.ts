import { DateFromString } from "@pagopa/ts-commons/lib/dates";
import { ctFaultBean_type_nfpsp } from "../generated/nodeForPsp/ctFaultBean_type_nfpsp";
import { stAmount_type_nfpsp } from "../generated/nodeForPsp/stAmount_type_nfpsp";
import { faultBean_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/faultBean_type_ppt";
import { nodoTipoDatiPagamentoPSP_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoTipoDatiPagamentoPSP_type_ppt";

type MockResponse = readonly [number, string];

interface INodoRPTRequest {
  readonly esito: "OK" | "KO";
  readonly datiPagamento?: nodoTipoDatiPagamentoPSP_type_ppt;
  readonly fault?: faultBean_type_ppt;
}

interface IVerifyPaymentNoticeReq {
  readonly outcome: "OK" | "KO";
  readonly fault?: ctFaultBean_type_nfpsp;
  readonly amount?: stAmount_type_nfpsp;
  readonly dueDate?: DateFromString;
}

interface IActivateIOPaymentReq {
  readonly outcome: "OK" | "KO";
  readonly fault?: ctFaultBean_type_nfpsp;
  readonly amount?: stAmount_type_nfpsp;
}
export const NodoAttivaRPT = (params: INodoRPTRequest): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:ppt="http://ws.pagamenti.telematici.gov/">
  <ppt:nodoAttivaRPTRisposta>
    <nodoAttivaRPTRisposta>
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
    </nodoAttivaRPTRisposta>
  </ppt:nodoAttivaRPTRisposta>
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
  <ppt:nodoVerificaRPTRisposta>
    <nodoVerificaRPTRisposta>
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
    </nodoVerificaRPTRisposta>
  </ppt:nodoVerificaRPTRisposta>
</s:Body>
</s:Envelope>`
];

export const VerifyPaymentNoticeResponse = (
  params: IVerifyPaymentNoticeReq
): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
  <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd" xmlns:tns="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.wsdl">
    <soapenv:Body>
      <nfpsp:verifyPaymentNoticeRes>
        <outcome>OK</outcome>
        <paymentList>
          <paymentOptionDescription>
            <amount>17.00</amount>
            <options>EQ</options>
            <dueDate>${params.dueDate}</dueDate>
            <paymentNote>/RFB/349192200032537944/17.00/TXT/Reversale W14680/2022 CF: INCIDENTI  STRADALI||||</paymentNote>
          </paymentOptionDescription>
        </paymentList>
        <paymentDescription>Reversale W14680/2022 CF: INCIDENTI  STRADALI||||</paymentDescription>
        <fiscalCodePA>02438750586</fiscalCodePA>
        <companyName>Roma Capitale</companyName>
        <officeName>CORPO DI POLIZIA LOCALE DI ROMA CAPITALE</officeName>
      </nfpsp:verifyPaymentNoticeRes>
    </soapenv:Body>
  </soapenv:Envelope>`
];

export const activateIOPaymenResponse = (
  _params: IActivateIOPaymentReq
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

export const activatePaymenNoticeResponse = (): MockResponse => [
  200,
  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ns="http://pagopa-api.pagopa.gov.it/node/nodeForIO.xsd">
   <soapenv:Body>
    <ns:activatePaymentNoticeRes>
     <outcome>OK</outcome>
     <totalAmount>100.00</totalAmount>
     <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
     <fiscalCodePA>80017010721</fiscalCodePA>
     <paymentToken>4d500e9908714202b55751ed6b1dfdf3</paymentToken>
     <creditorReferenceId>01225090200079679</creditorReferenceId>
    </ns:activatePaymentNoticeRes>
   </soapenv:Body>
  </soapenv:Envelope>
 `
];

export const activateV2PaymenNoticeResponse = (): MockResponse => [
  200,
  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:common="http://pagopa-api.pagopa.gov.it/xsd/common-types/v1.0.0/" xmlns:nfp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd">
    <soapenv:Body>
        <nfp:activatePaymentNoticeV2Response>
            <outcome>OK</outcome>
            <totalAmount>100.00</totalAmount>
            <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
            <fiscalCodePA>77777777777</fiscalCodePA>
            <companyName>company</companyName>
            <officeName>office</officeName>
            <paymentToken>d56d327bb84047539023d98f04a63cad</paymentToken>
            <transferList>
                <transfer>
                    <idTransfer>1</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <IBAN>IT45R0760103200000000001016</IBAN>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                    <transferCategory>transferCategoryTest</transferCategory>
                </transfer>
                <transfer>
                    <idTransfer>2</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <richiestaMarcaDaBollo>
                        <hashDocumento>documentHash</hashDocumento>
                        <tipoBollo>type</tipoBollo>
                        <provinciaResidenza>Foggia</provinciaResidenza>
                    </richiestaMarcaDaBollo>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                </transfer>
            </transferList>
            <creditorReferenceId>11137215100062787</creditorReferenceId>
        </nfp:activatePaymentNoticeV2Response>
    </soapenv:Body>
    </soapenv:Envelope>`
];

export const activateV2PaymenNoticeResponseAllCCP = (): MockResponse => [
  200,
  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:common="http://pagopa-api.pagopa.gov.it/xsd/common-types/v1.0.0/" xmlns:nfp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd">
    <soapenv:Body>
        <nfp:activatePaymentNoticeV2Response>
            <outcome>OK</outcome>
            <totalAmount>100.00</totalAmount>
            <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
            <fiscalCodePA>77777777777</fiscalCodePA>
            <companyName>company</companyName>
            <officeName>office</officeName>
            <paymentToken>d56d327bb84047539023d98f04a63cad</paymentToken>
            <transferList>
                <transfer>
                    <idTransfer>1</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <IBAN>IT45R0760103200000000001016</IBAN>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                    <transferCategory>transferCategoryTest</transferCategory>
                    <metadata>
                      <mapEntry>
                        <key>IBANAPPOGGIO</key>
                        <value>IT20U0760116100000000000000</value>
                      </mapEntry>
                    </metadata>   
                </transfer>
                <transfer>
                    <idTransfer>2</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <richiestaMarcaDaBollo>
                        <hashDocumento>documentHash</hashDocumento>
                        <tipoBollo>type</tipoBollo>
                        <provinciaResidenza>Foggia</provinciaResidenza>
                    </richiestaMarcaDaBollo>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                    <metadata>
                      <mapEntry>
                        <key>IBANAPPOGGIO</key>
                        <value>IT20U0760116100000000000000</value>
                      </mapEntry>
                    </metadata>
                </transfer>
            </transferList>
            <creditorReferenceId>11137215100062787</creditorReferenceId>
        </nfp:activatePaymentNoticeV2Response>
    </soapenv:Body>
    </soapenv:Envelope>`
];

export const activateV2PaymenNoticeResponseAllCCPlight = (): MockResponse => [
  200,
  `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:common="http://pagopa-api.pagopa.gov.it/xsd/common-types/v1.0.0/" xmlns:nfp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd">
    <soapenv:Body>
        <nfp:activatePaymentNoticeV2Response>
            <outcome>OK</outcome>
            <totalAmount>100.00</totalAmount>
            <paymentDescription>Quota Albo Ordine Giornalisti 2022</paymentDescription>
            <fiscalCodePA>77777777777</fiscalCodePA>
            <companyName>company</companyName>
            <officeName>office</officeName>
            <paymentToken>d56d327bb84047539023d98f04a63cad</paymentToken>
            <transferList>
                <transfer>
                    <idTransfer>1</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <IBAN>IT20U0760116100000000000000</IBAN>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                    <transferCategory>transferCategoryTest</transferCategory> 
                </transfer>
                <transfer>
                    <idTransfer>2</idTransfer>
                    <transferAmount>50.00</transferAmount>
                    <fiscalCodePA>77777777777</fiscalCodePA>
                    <IBAN>IT20U0760116100000123000000</IBAN>
                    <remittanceInformation>/RFB/00202200000217527/5.00/TXT/</remittanceInformation>
                </transfer>
            </transferList>
            <creditorReferenceId>11137215100062787</creditorReferenceId>
        </nfp:activatePaymentNoticeV2Response>
    </soapenv:Body>
    </soapenv:Envelope>`
];
