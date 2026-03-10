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

## Response Custom mocks

### Activate payment response v2

Activate payment response v2 have custom responses based on input payment notice fiscal code

| fiscal code     | response                                                                           | note                                                                                         |
|-----------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------| 
| 77777777776     | OK response with all CCP response without `IBANAPPOGGIO` metadata entry            | used to test all CCP calculation algorithm                                                   | 
| 77777777775     | OK response with all CCP response with `IBANAPPOGGIO` metadata entry               | used to test all CCP calcultion algorith                                                     |
| 77777777774     | OK response with convention metadata informations                                  | used to mock a Node response with convention metadata                                        |
| 66666666600     | OK response with payment token with fixed value `00000000000000000000000000000001` | used to mock a payment flow with an error on close payment (see close payment section below) |
| 66666666601     | OK response with payment token with fixed value `00000000000000000000000000000002` | used to mock a payment flow with an error on close payment (see close payment section below) |
| 66666666602     | OK response with payment token with fixed value `00000000000000000000000000000003` | used to mock a payment flow with an error on close payment (see close payment section below) |
| 66666666603     | OK response with payment token with fixed value `00000000000000000000000000000004` | used to mock a payment flow with an error on close payment (see close payment section below) |
| 66666666604     | OK response with payment token with fixed value `00000000000000000000000000000005` | used to mock a payment flow with an error on close payment (see close payment section below) |
| 66666666605     | OK response with payment token with fixed value `00000000000000000000000000000006` | used to mock a payment flow with an error on close payment (see close payment section below) |
| any other value | OK response                                                                        | used to test an ok payment flow                                                              |

### Close payment

Close payment have custom mocks based on payment token used to test different errors scenario

| payment token value              | http error code | http error description        | response timeout                     |
|----------------------------------|-----------------|-------------------------------|--------------------------------------|
| 00000000000000000000000000000001 | 400             | Generic error description     | 0                                    |
| 00000000000000000000000000000002 | 404             | Generic error description     | 0                                    |
| 00000000000000000000000000000003 | 422             | Generic error description     | 0                                    |
| 00000000000000000000000000000004 | 422             | Node did not receive RPT yet  | 0                                    |
| 00000000000000000000000000000005 | 500             | Generic error description     | 0                                    |
| 00000000000000000000000000000006 | 500             | Generic error description     | 20 seconds *(used for timeout tests) |
| any other value.                 | 200             | outcome KO                    | 0                                    |