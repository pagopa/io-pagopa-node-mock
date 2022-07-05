import * as t from "io-ts";

const ClosePaymentRequestOK = t.interface({
  additionalPaymentInformations: t.record(t.string, t.string),
  fee: t.number,
  identificativoCanale: t.string,
  identificativoIntermediario: t.string,
  identificativoPsp: t.string,
  outcome: t.literal("OK"),
  paymentTokens: t.readonly(t.array(t.string)),
  timestampOperation: t.string,
  tipoVersamento: t.string,
  totalAmount: t.number
});

const ClosePaymentRequestKO = t.interface({
  outcome: t.literal("KO"),
  paymentTokens: t.readonly(t.array(t.string))
});

export const ClosePaymentRequest = t.union([
  ClosePaymentRequestOK,
  ClosePaymentRequestKO
]);

export type ClosePaymentRequest = t.TypeOf<typeof ClosePaymentRequest>;

const ClosePaymentResponseOK = t.interface({
  esito: t.literal("OK")
});

const ClosePaymentResponseKO = t.interface({
  descrizione: t.string,
  esito: t.literal("KO")
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
    if (req.additionalPaymentInformations.mockErrorCode === "notFound") {
      return [
        {
          descrizione: "closePayment - mock case NOT FOUND",
          esito: "KO"
        },
        404
      ];
    } else if (
      req.additionalPaymentInformations.mockErrorCode === "unprocessableEntity"
    ) {
      return [
        {
          descrizione: "closePayment - mock case UNPROCESSABLE ENTITY",
          esito: "KO"
        },
        422
      ];
    }
  }

  return [
    {
      esito: "OK"
    },
    200
  ];
};
