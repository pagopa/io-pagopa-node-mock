import axios, { AxiosError, AxiosResponse } from "axios";
import { Either } from "fp-ts/lib/Either";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { Errors } from "io-ts";
import {
  ClosePaymentRequest,
  ClosePaymentResponse
} from "../fixtures/closePayment";
import {
  CheckPositionRequest,
  CheckPositionResponse
} from "../fixtures/checkPosition";

export class RestClient {
  private readonly options: { readonly basepath: string };

  constructor(options: { readonly basepath: string }) {
    this.options = options;
  }

  public async closePayment(
    closePaymentRequest: ClosePaymentRequest
  ): Promise<Either<Errors, readonly [number, ClosePaymentResponse]>> {
    const responsePromise = TE.tryCatch(
      () =>
        axios.post(
          this.options.basepath + "/nodo-per-pm/v2/closepayment",
          closePaymentRequest
        ),
      e => e
    );

    return pipe(
      responsePromise,
      TE.orElse(e => TE.of((e as AxiosError).response as AxiosResponse)),
      TE.chainEitherK(response =>
        pipe(
          response.data,
          ClosePaymentResponse.decode,
          E.map(value => ({ status: response.status, value }))
        )
      ),
      TE.map(
        ({ status, value }) =>
          [status, value] as readonly [number, ClosePaymentResponse]
      )
    )();
  }

  public async checkPosition(
    checkPositionRequest: CheckPositionRequest
  ): Promise<Either<Errors, readonly [number, CheckPositionResponse]>> {
    const responsePromise = TE.tryCatch(
      () =>
        axios.post(
          this.options.basepath + "/nodo-per-pm/v1/checkPosition",
          checkPositionRequest
        ),
      e => e
    );

    return pipe(
      responsePromise,
      TE.orElse(e => TE.of((e as AxiosError).response as AxiosResponse)),
      TE.chainEitherK(response =>
        pipe(
          response.data,
          CheckPositionResponse.decode,
          E.map(value => ({ status: response.status, value }))
        )
      ),
      TE.map(
        ({ status, value }) =>
          [status, value] as readonly [number, CheckPositionResponse]
      )
    )();
  }
}
