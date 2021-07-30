
# calls the node with a specific IUV to get PPT_MULTI_BENEFICIARIO fault as an answer 
curl --location --request POST 'http://localhost:3000/webservices/pof/PagamentiTelematiciPspNodoservice' \
--header 'Content-Type: application/xml' \
--data-raw '<soap:envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:qrc="http://PuntoAccessoPSP.spcoop.gov.it/QrCode" xmlns:pay_i="http://www.digitpa.gov.it/schemas/2011/Pagamenti/" xmlns:tns="http://PuntoAccessoPSP.spcoop.gov.it/servizi/PagamentiTelematiciPspNodo" xmlns:ppt="http://ws.pagamenti.telematici.gov/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soap:body>
        <ppt:nodoVerificaRPT>
            <identificativoPSP>AGID_01</identificativoPSP>
            <identificativoIntermediarioPSP>97735020584</identificativoIntermediarioPSP>
            <identificativoCanale>97735020584_03</identificativoCanale>
            <password>password</password>
            <codiceContestoPagamento>ffb98900f03e11eb96986f23f4e4aed5</codiceContestoPagamento>
            <codificaInfrastrutturaPSP>QR-CODE</codificaInfrastrutturaPSP>
            <codiceIdRPT>
                <qrc:QrCode>
                    <qrc:CF>01199250158</qrc:CF>
                    <qrc:CodStazPA>02</qrc:CodStazPA>
                    <qrc:AuxDigit>0</qrc:AuxDigit>
                    <qrc:CodIUV>302000720356803932071</qrc:CodIUV>
                </qrc:QrCode>
            </codiceIdRPT>
        </ppt:nodoVerificaRPT>
    </soap:body>
</soap:envelope>'

# calls the node with a new verify "MULTI BENEFICIARIO"
curl --location --request POST 'http://localhost:3000/webservices/pof/PagamentiTelematiciPspNodoservice' \
--header 'Content-Type: application/xml' \
--data-raw '  <soap:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nod="http://pagopa-api.pagopa.gov.it/node/nodeForPsp.xsd">
    <soap:Header/>
    <soap:Body>
      <nfpsp:verifyPaymentNoticeReq>
        <idPSP>88888888888</idPSP>
        <idBrokerPSP>88888888888</idBrokerPSP>
        <idChannel>88888888888_01</idChannel>
        <password>**********</password>
        <qrCode>
          <fiscalCode>77777777777</fiscalCode>
          <noticeNumber>311111111112222222</noticeNumber>
        </qrCode>
      </nfpsp:verifyPaymentNoticeReq>
    </soap:Body>
  </soap:Envelope>
'

