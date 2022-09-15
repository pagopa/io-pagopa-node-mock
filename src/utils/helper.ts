import * as t from "io-ts";
export const PPT_MULTI_BENEFICIARIO = t.literal("PPT_MULTI_BENEFICIARIO");
// eslint-disable-next-line @typescript-eslint/naming-convention
export type PPT_MULTI_BENEFICIARIO = t.TypeOf<typeof PPT_MULTI_BENEFICIARIO>;

export const PPT_ERRORE_EMESSO_DA_PAA = t.literal("PPT_ERRORE_EMESSO_DA_PAA");
// eslint-disable-next-line @typescript-eslint/naming-convention
export type PPT_ERRORE_EMESSO_DA_PAA = t.TypeOf<
  typeof PPT_ERRORE_EMESSO_DA_PAA
>;

export const PAA_PAGAMENTO_DUPLICATO = t.literal("PAA_PAGAMENTO_DUPLICATO");
// eslint-disable-next-line @typescript-eslint/naming-convention
export type PAA_PAGAMENTO_DUPLICATO = t.TypeOf<typeof PAA_PAGAMENTO_DUPLICATO>;
