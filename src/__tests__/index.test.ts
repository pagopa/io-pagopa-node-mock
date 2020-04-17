import * as http from "http";
import * as PPTPortClient from "../__mock__/PPTPortClient";
import { newExpressApp } from "../app";
import { CONFIG, Configuration } from "../config";
import { nodoAttivaRPT_element_ppt } from "../generated/PagamentiTelematiciPspNodoservice/nodoAttivaRPT_element_ppt";

describe("index", () => {
  // tslint:disable-next-line: no-let
  let server: http.Server;
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
  it("should work", async () => {
    const pagoPAClient = new PPTPortClient.PagamentiTelematiciPspNodoAsyncClient(
      await PPTPortClient.createPagamentiTelematiciPspNodoClient({
        endpoint: `http://localhost:3000/webservices/pof/PagamentiTelematiciPspNodoservice`,
        wsdl_options: {
          timeout: 1000
        }
      })
    );
    try {
      await pagoPAClient.nodoAttivaRPT(({
        identificativoPSP: "AA",
        // tslint:disable-next-line: object-literal-sort-keys
        identificativoIntermediarioPSP: "1",
        identificativoCanale: "1",
        // tslint:disable-next-line: no-hardcoded-credentials
        password: "12345678",
        codiceContestoPagamento: "1",
        identificativoIntermediarioPSPPagamento: "1",
        identificativoCanalePagamento: "1",
        codificaInfrastrutturaPSP: "",
        codiceIdRPT: { a: true },
        datiPagamentoPSP: { importoSingoloVersamento: 1 }
      } as unknown) as nodoAttivaRPT_element_ppt);
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error(err);
    }
  });
});
