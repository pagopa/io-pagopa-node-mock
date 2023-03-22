import * as t from "io-ts";

const ClosePaymentRequestOK = t.interface({
  additionalPaymentInformations: t.record(t.string, t.string),
  fee: t.number,
  idBrokerPSP: t.string,
  idChannel: t.string,
  idPSP: t.string,
  outcome:  t.literal("OK"),
  paymentMethod: t.string,
  paymentTokens: t.readonly(t.array(t.string)),
  timestampOperation: t.string,
  totalAmount: t.number,
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

export const closePayment = (
  req: ClosePaymentRequest
): readonly [ClosePaymentResponse, number] => {
  if (req.outcome === "OK") {
    if (req.additionalPaymentInformations.mockCase === "notFound") {
      return [
        {
          description: "closePayment - mock case NOT FOUND",
          outcome: "KO"
        },
        404
      ];
    } else if (
      req.additionalPaymentInformations.mockCase === "unprocessableEntity"
    ) {
      return [
        {
          description: "closePayment - mock case UNPROCESSABLE ENTITY",
          outcome: "KO"
        },
        422
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
