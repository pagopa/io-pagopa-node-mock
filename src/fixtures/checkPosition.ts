import * as t from "io-ts";

const SinglePosition = t.interface({
  fiscalCode: t.string,
  noticeNumber: t.string
});

const CheckPositionRequestMock = t.interface({
  mocktype: t.union([t.undefined, t.string]),
  positionslist: t.array(SinglePosition)
});

const CheckPositionResponseOK = t.interface({
  esito: t.literal("OK")
});

const CheckPositionResponseKO = t.interface({
  esito: t.literal("KO")
});

const CheckPositionResponseError = t.interface({
  error: t.string
});

export const CheckPositionResponse = t.union([
  CheckPositionResponseOK,
  CheckPositionResponseKO,
  CheckPositionResponseError
]);

export const CheckPositionRequest = CheckPositionRequestMock;
export type CheckPositionRequest = t.TypeOf<typeof CheckPositionRequest>;
export type CheckPositionResponse = t.TypeOf<typeof CheckPositionResponse>;

export const checkPosition = (
  req: CheckPositionRequest
): readonly [CheckPositionResponse, number] => {
  if (req.mocktype === "404") {
    return [
      {
        error: "404 not found"
      },
      404
    ];
  } else if (req.mocktype === "408") {
    return [
      {
        error: "408 request timeout"
      },
      408
    ];
  } else if (req.mocktype === "422") {
    return [
      {
        error: "422 Unprocessable entry"
      },
      408
    ];
  }

  if (req.positionslist[0].noticeNumber.startsWith("3333")) {
    return [
      {
        esito: "KO"
      },
      200
    ];
  }
  return [
    {
      esito: "OK"
    },
    200
  ];
};
