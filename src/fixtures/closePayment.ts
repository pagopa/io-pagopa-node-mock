import * as t from "io-ts";

const ClosePaymentRequestOK = t.interface({
  additionalPaymentInformations: t.record(t.string, t.string),
  fee: t.number,
  idBrokerPSP: t.string,
  idChannel: t.string,
  idPSP: t.string,
  outcome: t.literal("OK"),
  paymentMethod: t.string,
  paymentTokens: t.readonly(t.array(t.string)),
  timestampOperation: t.string,
  totalAmount: t.number,
  transactionId: t.string
});

const ClosePaymentRequestKO = t.interface({
  outcome: t.literal("KO"),
  paymentTokens: t.readonly(t.array(t.string)),
  transactionId: t.string
});

export const ClosePaymentRequest = t.union([
  ClosePaymentRequestOK,
  ClosePaymentRequestKO
]);

export type ClosePaymentRequest = t.TypeOf<typeof ClosePaymentRequest>;

const ClosePaymentResponseOK = t.interface({
  outcome: t.literal("OK")
});

const ClosePaymentResponseKO = t.interface({
  description: t.string,
  outcome: t.literal("KO")
});

export const ClosePaymentResponse = t.union([
  ClosePaymentResponseOK,
  ClosePaymentResponseKO
]);

export type ClosePaymentResponse = t.TypeOf<typeof ClosePaymentResponse>;

const closePaymentGenericErrorDescription = "Generic error description";
export const closePayment = (
  req: ClosePaymentRequest
  // close payment response, status code and response timeout
): readonly [ClosePaymentResponse, number, number?] => {
  if (req.outcome === "OK") {
    const transactionId = req.paymentTokens[0];
    switch (transactionId) {
      case "00000000000000000000000000000001":
        return [
          {
            description: closePaymentGenericErrorDescription,
            outcome: "KO"
          },
          400
        ];
      case "00000000000000000000000000000002":
        return [
          {
            description: closePaymentGenericErrorDescription,
            outcome: "KO"
          },
          404
        ];
      case "00000000000000000000000000000003":
        return [
          {
            description: closePaymentGenericErrorDescription,
            outcome: "KO"
          },
          422
        ];
      case "00000000000000000000000000000004":
        return [
          {
            description: "Node did not receive RPT yet",
            outcome: "KO"
          },
          422
        ];
      case "00000000000000000000000000000005":
        return [
          {
            description: closePaymentGenericErrorDescription,
            outcome: "KO"
          },
          500
        ];
      case "00000000000000000000000000000006":
        return [
          {
            description: closePaymentGenericErrorDescription,
            outcome: "KO"
          },
          500,
          20000
        ];
      default:
        return [
          {
            outcome: "OK"
          },
          200
        ];
    }
  }

  return [
    {
      outcome: "OK"
    },
    200
  ];
};
