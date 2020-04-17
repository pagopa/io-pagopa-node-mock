/**
 * Common configurations for Proxy PagoPA and external resources
 */

import * as t from "io-ts";
import { NonEmptyString } from "italia-ts-commons/lib/strings";
import { stPassword_type_ppt } from "./generated/PagamentiTelematiciPspNodoservice/stPassword_type_ppt";
import { stText35_type_pay_i } from "./generated/PagamentiTelematiciPspNodoservice/stText35_type_pay_i";

const localhost = "http://localhost";

export const CONFIG = {
  // The log level used for Winston logger (error, info, debug)
  WINSTON_LOG_LEVEL: process.env.WINSTON_LOG_LEVEL || "debug",

  // RESTful Webservice configuration
  // These information are documented here:
  // https://docs.google.com/document/d/1Qqe6mSfon-blHzc-ldeEHmzIkVaElKY5LtDnKiLbk80/edit
  // Used to expose services
  NODO_MOCK: {
    HOST: process.env.PAGOPA_NODO_HOST || localhost,
    PORT: process.env.PORT || 3000,

    // SHA256 client certificate fingerprint (without `:` separators)
    CLIENT_CERTIFICATE_FINGERPRINT:
      process.env.PAGOPAPROXY_CLIENT_CERTIFICATE_FINGERPRINT,
    ROUTES: {
      PPT_NODO: "/webservices/pof/PagamentiTelematiciPspNodoservice"
    }
  },

  // PagoPA Proxy Configuration
  PAGOPA_PROXY: {
    CLIENT_TIMEOUT_MSEC: Number(process.env.PAGOPA_TIMEOUT_MSEC) || 60000,
    HOST: process.env.PAGOPA_PROXY_HOST || localhost,
    HOST_HEADER: process.env.PAGOPA_HOST_HEADER,

    CERT: process.env.PAGOPA_CERT,
    KEY: process.env.PAGOPA_KEY,

    PASSWORD: process.env.PAGOPA_NODO_PASSWORD || "password",

    // These information will identify our system when it will access to PagoPA
    IDENTIFIER: {
      IDENTIFICATIVO_CANALE: process.env.PAGOPA_ID_CANALE || "1",
      IDENTIFICATIVO_CANALE_PAGAMENTO:
        process.env.PAGOPA_ID_CANALE_PAGAMENTO || "1",
      IDENTIFICATIVO_INTERMEDIARIO_PSP: process.env.PAGOPA_ID_INT_PSP || "1",
      IDENTIFICATIVO_PSP: process.env.PAGOPA_ID_PSP || "1"
    },
    PORT: process.env.PAGOPA_PROXY_PORT || 3001,
    WS_SERVICES: {
      FESP_CD: process.env.PAGOPA_WS_URI || "/FespCdService"
    }
  }
};

// Configuration validator - Define configuration types and interfaces
const ServerConfiguration = t.interface({
  HOST: NonEmptyString,
  // We allow t.string to use socket pipe address in Azure App Services
  PORT: t.any
});
export type ServerConfiguration = t.TypeOf<typeof ServerConfiguration>;

const NodoMockConfig = t.intersection([
  ServerConfiguration,
  t.interface({
    ROUTES: t.interface({
      PPT_NODO: NonEmptyString
    })
  }),
  t.partial({
    CLIENT_CERTIFICATE_FINGERPRINT: NonEmptyString
  })
]);
export type NodoMockConfig = t.TypeOf<typeof NodoMockConfig>;

export const PagoPAProxyConfig = t.intersection([
  ServerConfiguration,
  t.interface({
    PASSWORD: stPassword_type_ppt
  }),
  t.interface({
    CLIENT_TIMEOUT_MSEC: t.number,
    IDENTIFIER: t.interface({
      IDENTIFICATIVO_CANALE: stText35_type_pay_i,
      IDENTIFICATIVO_CANALE_PAGAMENTO: stText35_type_pay_i,
      IDENTIFICATIVO_INTERMEDIARIO_PSP: stText35_type_pay_i,
      IDENTIFICATIVO_PSP: stText35_type_pay_i
    }),
    WS_SERVICES: t.interface({
      FESP_CD: NonEmptyString
    })
  }),
  t.partial({
    CERT: NonEmptyString,
    KEY: NonEmptyString,

    HOST_HEADER: t.string
  })
]);
export type PagoPAProxyConfig = t.TypeOf<typeof PagoPAProxyConfig>;

export const WinstonLogLevel = t.keyof({
  debug: 4,
  error: 0,
  info: 2
});
export type WinstonLogLevel = t.TypeOf<typeof WinstonLogLevel>;

export const RedisConfig = t.intersection([
  ServerConfiguration,
  t.interface({
    PASSWORD: t.string,
    USE_CLUSTER: t.boolean
  })
]);
export type RedisConfig = t.TypeOf<typeof RedisConfig>;

export const Configuration = t.interface({
  NODO_MOCK: NodoMockConfig,
  PAGOPA_PROXY: PagoPAProxyConfig,
  WINSTON_LOG_LEVEL: WinstonLogLevel
});
export type Configuration = t.TypeOf<typeof Configuration>;
