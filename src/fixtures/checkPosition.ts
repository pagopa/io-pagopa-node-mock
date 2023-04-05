import * as t from "io-ts";

const SinglePosition = t.interface({
  description: t.union([t.undefined, t.string]),
  fiscalCode: t.string,
  noticeNumber: t.string,
  state: t.union([t.undefined, t.string])
});

const CheckPositionRequestMock = t.interface({
  positionslist: t.array(SinglePosition)
});

const CheckPositionResponseOK = t.interface({
  outcome: t.literal("OK"),
  positionslist: t.array(SinglePosition)
});

const CheckPositionResponseKO = t.interface({
  outcome: t.literal("KO"),
  positionslist: t.array(SinglePosition)
});

const CheckPositionResponseERROR = t.interface({
  description: t.string,
  outcome: t.literal("KO")
});

export const CheckPositionResponse = t.union([
  CheckPositionResponseOK,
  CheckPositionResponseKO,
  CheckPositionResponseERROR
]);
export type CheckPositionResponse = t.TypeOf<typeof CheckPositionResponse>;

export const CheckPositionRequest = CheckPositionRequestMock;
export type CheckPositionRequest = t.TypeOf<typeof CheckPositionRequest>;

export const CheckPositionResponseKo = CheckPositionResponseKO;
export type CheckPositionResponseKo = t.TypeOf<typeof CheckPositionResponseKo>;

export const CheckPositionResponseOk = CheckPositionResponseOK;
export type CheckPositionResponseOk = t.TypeOf<typeof CheckPositionResponseOk>;

export const CheckPositionResponseError = CheckPositionResponseERROR;
export type CheckPositionResponseError = t.TypeOf<
  typeof CheckPositionResponseError
>;

export const checkPosition = (
  req: CheckPositionRequest
): readonly [CheckPositionResponse, number] => {
  if (req.positionslist[0].noticeNumber.startsWith("3332")) {
    return [
      {
        description: "Error 400",
        outcome: "KO"
      },
      400
    ];
  } else if (req.positionslist[0].noticeNumber.startsWith("3333")) {
    return [
      {
        outcome: "KO",
        positionslist: req.positionslist
      },
      200
    ];
  }
  return [
    {
      outcome: "OK",
      positionslist: req.positionslist
    },
    200
  ];
};
