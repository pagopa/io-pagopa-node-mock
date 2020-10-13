import * as express from "express";
import * as http from "http";
import {
  IWithinRangeStringTag,
  NonEmptyString
} from "italia-ts-commons/lib/strings";
import waitForExpect from "wait-for-expect";
import * as FespCdServer from "../__mock__/FespCdServer";
import * as PPTPortClient from "../__mock__/PPTPortClient";
import { newExpressApp } from "../app";
import { CONFIG, Configuration } from "../config";
import { cdInfoWisp_element_ppt } from "../generated/FespCdService/cdInfoWisp_element_ppt";
import { cdInfoWispResponse_element_ppt } from "../generated/FespCdService/cdInfoWispResponse_element_ppt";
import { nodoAttivaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";
import { nodoVerificaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoVerificaRPT_element_ppt";
import * as FespCdClient from "../services/pagopa_api/FespCdClient";

const sleep = (ms: number) => new Promise(ok => setTimeout(ok, ms));
// tslint:disable-next-line: no-let
let server: http.Server;

const anImportoSingoloVersamento = 1;
const anIdentificativoPSP = "AA" as string & IWithinRangeStringTag<1, 36>;
const anIdentificativoIntermediarioPSP = "1" as string &
  IWithinRangeStringTag<1, 36>;
const anIdentificativoCanale = "1" as string & IWithinRangeStringTag<1, 36>;
const aValidPassword = CONFIG.PAGOPA_PROXY.PASSWORD as string &
  IWithinRangeStringTag<8, 16>;
const aCodiceContestoPagamento = "1" as string & IWithinRangeStringTag<1, 36>;
const aCodiceInfrastrutturaPSP = "";
const aCodiceIdRPT = {
  a: true
};
const mockedNodoAttivaRequest: nodoAttivaRPT_element_ppt = {
  codiceContestoPagamento: aCodiceContestoPagamento,
  codiceIdRPT: aCodiceIdRPT,
  codificaInfrastrutturaPSP: aCodiceInfrastrutturaPSP,
  datiPagamentoPSP: {
    importoSingoloVersamento: anImportoSingoloVersamento
  },
  identificativoCanale: anIdentificativoCanale,
  identificativoCanalePagamento: "1" as string & IWithinRangeStringTag<1, 36>,
  identificativoIntermediarioPSP: anIdentificativoIntermediarioPSP,
  identificativoIntermediarioPSPPagamento: "1" as string &
    IWithinRangeStringTag<1, 36>,
  identificativoPSP: anIdentificativoPSP,
  // tslint:disable-next-line: no-hardcoded-credentials
  password: aValidPassword
};

const mockedNodoVerificaRPT: nodoVerificaRPT_element_ppt = {
  codiceContestoPagamento: aCodiceContestoPagamento,
  codiceIdRPT: aCodiceIdRPT,
  codificaInfrastrutturaPSP: aCodiceInfrastrutturaPSP,
  identificativoCanale: anIdentificativoCanale,
  identificativoIntermediarioPSP: anIdentificativoIntermediarioPSP,
  identificativoPSP: anIdentificativoPSP,
  password: aValidPassword
};

const getPagopaClient = async () =>
  new PPTPortClient.PagamentiTelematiciPspNodoAsyncClient(
    await PPTPortClient.createPagamentiTelematiciPspNodoClient({
      endpoint: `${CONFIG.NODO_MOCK.HOST}:${CONFIG.NODO_MOCK.PORT}${CONFIG.NODO_MOCK.ROUTES.PPT_NODO}`,
      wsdl_options: {
        timeout: 1000
      }
    })
  );

describe("index#nodoAttivaRPT", () => {
  // tslint:disable-next-line: no-let
  let mockPagopaProxyServer: http.Server;

  const mockExpressHandler = jest.fn().mockImplementation((_, res) => {
    res.send("");
  });

  beforeAll(async () => {
    // Retrieve server configuration
    const config = Configuration.decode(CONFIG).getOrElseL(() => {
      throw Error(`Invalid configuration.`);
    });
    server = http.createServer(await newExpressApp(config));
    server.listen(config.NODO_MOCK.PORT);
    // Configure PagoPaProxy mock server
    const app = express();
    app.post(`${CONFIG.PAGOPA_PROXY.WS_SERVICES.FESP_CD}`, mockExpressHandler);
    mockPagopaProxyServer = http.createServer(app);
    mockPagopaProxyServer.listen(CONFIG.PAGOPA_PROXY.PORT);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    server.close();
    mockPagopaProxyServer.close();
  });
  it("nodoAttivaRPT should returns an error if password not match", async () => {
    const pagoPAClient = await getPagopaClient();
    const response = await pagoPAClient.nodoAttivaRPT({
      ...mockedNodoAttivaRequest,
      password: `${aValidPassword}_wrong` as string &
        IWithinRangeStringTag<8, 16>
    });
    expect(response).toEqual({
      nodoAttivaRPTRisposta: {
        esito: "KO",
        fault: {
          faultCode: "401",
          faultString: "Invalid password",
          id: "0"
        }
      }
    });
    await waitForExpect(async () => {
      await sleep(2000);
      expect(mockExpressHandler).toBeCalledTimes(0);
    });
  });

  it("nodoAttivaRPT should returns a valid success response", async () => {
    const pagoPAClient = await getPagopaClient();
    const response = await pagoPAClient.nodoAttivaRPT(mockedNodoAttivaRequest);
    expect(response).toEqual({
      nodoAttivaRPTRisposta: {
        datiPagamentoPA: {
          causaleVersamento: "Causale versamento mock",
          ibanAccredito: "IT47L0300203280645139156879",
          importoSingoloVersamento: anImportoSingoloVersamento.toFixed(2)
        },
        esito: "OK"
      }
    });
    await waitForExpect(() => {
      expect(mockExpressHandler).toHaveBeenCalledTimes(1);
    });
  });
});

describe("index#nodoVerificaRPT", () => {
  beforeAll(async () => {
    // Retrieve server configuration
    const config = Configuration.decode(CONFIG).getOrElseL(() => {
      throw Error(`Invalid configuration.`);
    });
    server = http.createServer(await newExpressApp(config));
    server.listen(config.NODO_MOCK.PORT);
  });
  afterAll(() => {
    server.close();
  });
  it("nodoVerificaRPT should returns an error if password not match", async () => {
    const pagoPAClient = await getPagopaClient();
    const response = await pagoPAClient.nodoVerificaRPT({
      ...mockedNodoVerificaRPT,
      password: `${aValidPassword}_wrong` as string &
        IWithinRangeStringTag<8, 16>
    });
    expect(response).toEqual({
      nodoVerificaRPTRisposta: {
        esito: "KO",
        fault: {
          faultCode: "401",
          faultString: "Invalid password",
          id: "0"
        }
      }
    });
  });
  it("nodoVerificaRPT should returns a valid success response", async () => {
    const pagoPAClient = await getPagopaClient();
    const response = await pagoPAClient.nodoVerificaRPT(mockedNodoVerificaRPT);
    expect(response).toEqual({
      nodoVerificaRPTRisposta: {
        datiPagamentoPA: {
          causaleVersamento: "Causale versamento mock",
          ibanAccredito: "IT47L0300203280645139156879",
          importoSingoloVersamento: anImportoSingoloVersamento.toFixed(2)
        },
        esito: "OK"
      }
    });
  });
});
describe("Test SOAP Server", () => {
  it("cdInfoWisp should returns a success response", async () => {
    const app = express();
    const expectedFespUrl = "/ws/fesp" as NonEmptyString;
    await FespCdServer.attachFespCdServer(app, expectedFespUrl, {
      cdInfoWisp: (
        input: unknown,
        cb?: (data: cdInfoWispResponse_element_ppt) => void
      ) => {
        cdInfoWisp_element_ppt.decode(input).bimap(
          err =>
            cb
              ? cb({
                  esito: "KO"
                })
              : err,
          _ =>
            cb
              ? cb({
                  esito: "OK"
                })
              : _
        );
      }
    });
    const soapServer = http.createServer(app);
    soapServer.listen(3000);
    const pagoPaProxyClient = new FespCdClient.FespCdClientAsync(
      await FespCdClient.createFespCdClient({
        endpoint: `http://localhost:3000${expectedFespUrl}`,
        wsdl_options: {
          timeout: 1000
        }
      })
    );
    const response = await pagoPaProxyClient.cdInfoWisp({
      codiceContestoPagamento: "1" as (string & IWithinRangeStringTag<1, 36>),
      // Fake paymentId
      idPagamento: Math.random()
        .toString(36)
        .slice(2)
        .toUpperCase(), // TODO: Check required format
      identificativoDominio: "1" as (string & IWithinRangeStringTag<1, 36>),
      identificativoUnivocoVersamento:
        // Fake paymentId
        Math.random()
          .toString(36)
          .slice(2)
          .toUpperCase() as (string & IWithinRangeStringTag<1, 36>) // TODO: check required format
    });
    expect(response).toEqual({ esito: "OK" });
    soapServer.close();
  });
});
