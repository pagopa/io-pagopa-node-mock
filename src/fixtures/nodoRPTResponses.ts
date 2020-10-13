import { faultBean_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/faultBean_type_ppt";
import { nodoTipoDatiPagamentoPSP_type_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoTipoDatiPagamentoPSP_type_ppt";

type MockResponse = readonly [number, string];

interface INodoRPTRequest {
  esito: "OK" | "KO";
  datiPagamento?: nodoTipoDatiPagamentoPSP_type_ppt;
  fault?: faultBean_type_ppt;
}

export const NodoAttivaRPT = (params: INodoRPTRequest): MockResponse => [
  200,
  `<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:ppt="http://ws.pagamenti.telematici.gov/">
  <nodoAttivaRPTRisposta>
    <ppt:risposta>
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
    </ppt:risposta>
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
    <ppt:risposta>
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
    </ppt:risposta>
  </nodoVerificaRPTRisposta>
</s:Body>
</s:Envelope>`
];
