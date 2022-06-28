import axios from "axios";
import { Either } from "fp-ts/lib/Either";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Errors } from "io-ts";
import {
  ClosePaymentRequest,
  ClosePaymentResponse
} from "../fixtures/closePayment";

export class RestClient {
  private options: { basepath: string };

  constructor(options: { basepath: string }) {
    this.options = options;
  }

  public async closePayment(
    closePaymentRequest: ClosePaymentRequest
  ): Promise<Either<Errors, readonly [number, ClosePaymentResponse]>> {
    const response = await axios.post(this.options.basepath + "/v2/closepayment", closePaymentRequest);

      let responseBody = response.data;

      return pipe(
        ClosePaymentResponse.decode(responseBody),
        E.map(
          v => [response.status, v] as readonly [number, ClosePaymentResponse]
        )
    );
  }
}
