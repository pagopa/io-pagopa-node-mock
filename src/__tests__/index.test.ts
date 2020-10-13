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
import * as FespCdClient from "../services/pagopa_api/FespCdClient";

const sleep = (ms: number) => new Promise(ok => setTimeout(ok, ms));

describe("index#nodoAttivaRPT", () => {
  // tslint:disable-next-line: no-let
  let server: http.Server;
  // tslint:disable-next-line: no-let
  let mockPagopaProxyServer: http.Server;

  const mockExpressHandler = jest.fn().mockImplementation((_, res) => {
    res.send("");
  });

  const anImportoSingoloVersamento = 1;
  const mockedNodoAttivaRequest = ({
    identificativoPSP: "AA",
    // tslint:disable-next-line: object-literal-sort-keys
    identificativoIntermediarioPSP: "1",
    identificativoCanale: "1",
    // tslint:disable-next-line: no-hardcoded-credentials
    password: CONFIG.PAGOPA_PROXY.PASSWORD,
    codiceContestoPagamento: "1",
    identificativoIntermediarioPSPPagamento: "1",
    identificativoCanalePagamento: "1",
    codificaInfrastrutturaPSP: "",
    codiceIdRPT: { a: true },
    datiPagamentoPSP: {
      importoSingoloVersamento: anImportoSingoloVersamento
    }
  } as unknown) as nodoAttivaRPT_element_ppt;

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
    const pagoPAClient = new PPTPortClient.PagamentiTelematiciPspNodoAsyncClient(
      await PPTPortClient.createPagamentiTelematiciPspNodoClient({
        endpoint: `${CONFIG.NODO_MOCK.HOST}:${CONFIG.NODO_MOCK.PORT}${CONFIG.NODO_MOCK.ROUTES.PPT_NODO}`,
        wsdl_options: {
          timeout: 1000
        }
      })
    );
    const response = await pagoPAClient.nodoAttivaRPT({
      ...mockedNodoAttivaRequest,
      password: `${mockedNodoAttivaRequest}_wrong` as string &
        IWithinRangeStringTag<8, 16>
    });
    expect(response).toEqual({
      risposta: {
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
    const pagoPAClient = new PPTPortClient.PagamentiTelematiciPspNodoAsyncClient(
      await PPTPortClient.createPagamentiTelematiciPspNodoClient({
        endpoint: `${CONFIG.NODO_MOCK.HOST}:${CONFIG.NODO_MOCK.PORT}${CONFIG.NODO_MOCK.ROUTES.PPT_NODO}`,
        wsdl_options: {
          timeout: 1000
        }
      })
    );
    const response = await pagoPAClient.nodoAttivaRPT(mockedNodoAttivaRequest);
    expect(response).toEqual({
      risposta: {
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
    const server = http.createServer(app);
    server.listen(3000);
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
    server.close();
  });
});
