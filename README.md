# io-pagopa-node-mock

A mock implementation of the Nodo SOAP service, intended only for internal development and integration.
> :warning: **Please notice**: this project is NOT suited for testing when you are integrating as a EC/PSP for production purpose.
## Usage

```sh
yarn install
yarn build
yarn start
```

if all rights you'll see something like that :
```sh
{"message":"Server started at http://localhost:3000","level":"info"}
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


## Tests

To verify the correct behavior you can run the script under `resources` folder typing :

```sh
bash calls_scripts_utils.sh
```

and if node mock is running you'll see the following responses :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:ppt="http://ws.pagamenti.telematici.gov/">
  <nodoVerificaRPTRisposta>
    <ppt:nodoVerificaRPTRisposta>
      <esito>KO</esito>
      <fault>
        <faultCode>PPT_MULTI_BENEFICIARIO</faultCode>
        <faultString>Avviso Multi Beneficiario</faultString>
        <id>0</id>
      </fault>
    </ppt:nodoVerificaRPTRisposta>
  </nodoVerificaRPTRisposta>
</s:Body>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
</s:Envelope><s:Envelope xmlns:tns="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.wsdl"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:nfpsp="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd"
  xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <nfpsp:verifyPaymentNoticeRes>
      <outcome>OK</outcome>
      <paymentList>
        <paymentOptionDescription>
          <amount>2</amount>
          <options>EQ</options>
          <paymentNote>test</paymentNote>
        </paymentOptionDescription>
        <paymentOptionDescription/>
      </paymentList>
      <paymentDescription>Pagamento di Test</paymentDescription>
      <fiscalCodePA>12345678901</fiscalCodePA>
      <companyName>companyName</companyName>
      <officeName>officeName</officeName>
    </nfpsp:verifyPaymentNoticeRes>
  </s:Body>
</s:Envelope>

```