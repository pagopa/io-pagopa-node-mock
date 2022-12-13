import * as t from "io-ts";

const SinglePosition = t.interface({
  fiscalCode: t.string,
  noticeNumber: t.string
});

const CheckPositionRequestOK = t.interface({
  positionslist: t.array(SinglePosition)
});

const CheckPositionResponseOK = t.interface({
  esito: t.literal("OK")
});

const CheckPositionResponseKO = t.interface({
  esito: t.literal("KO")
});

const CheckPositionResponseError = t.interface({
  error: t.literal("generic error")
});

export const CheckPositionResponse = t.union([
  CheckPositionResponseOK,
  CheckPositionResponseKO,
  CheckPositionResponseError
]);

export const CheckPositionRequest = CheckPositionRequestOK;
export type CheckPositionRequest = t.TypeOf<typeof CheckPositionRequest>;
export type CheckPositionResponse = t.TypeOf<typeof CheckPositionResponse>;

export const checkPosition = (): readonly [CheckPositionResponse, number] => [
  {
    esito: "OK"
  },
  200
];
