# io-pagopa-node-mock

A mock implementation of the Nodo SOAP service

## Usage

```sh
yarn install
yarn build
yarn start
```

## Environment

| name                 | description                   | default            |
| -------------------- | ----------------------------- | ------------------ |
| WINSTON_LOG_LEVEL    | desired log level             | "debug"            |
| PAGOPA_NODO_HOST     | host this server listens to   | "http://localhost" |
| PORT                 | host this server listens to   | 3000               |
| PAGOPA_PROXY_HOST    | PagoPa Proxy host             | localhost          |
| PAGOPA_NODO_PASSWORD | nodo mock auth password       | password           |
| PAGOPA_PROXY_PORT    | PagoPa Proxy port             | 3001               |
| PAGOPA_WS_URI        | PagoPa Proxy SOAP service URI | `/FespCdService`   |