// TODO: Duplicated file with pagopa-proxy
import * as fs from "fs";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import * as soap from "soap";

// type signature for callback based async soap methods
export type SoapMethodCB<I, O> = (
  input: I,
  cb: (
    err: unknown,
    result: O,
    raw: string,
    soapHeader: { readonly [k: string]: unknown }
  ) => unknown,
  options?: Pick<soap.ISecurity, "postProcess">
) => void;

/**
 * Retrieve wsdl file content
 *
 * @param {NonEmptyString} path - WSDL file path
 * @return {Promise<string>} WSDL file content
 */
export const readWsdl = async (path: NonEmptyString): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    fs.readFile(path, { encoding: "utf8" }, (err, wsdl) => {
      if (err) {
        return reject(err);
      }
      resolve(wsdl.replace(/(\r\n|\n|\r)/gm, ""));
    });
  });

export const createClient = <T>(
  wsdlUri: string,
  options: soap.IOptions,
  cert?: string,
  key?: string,
  hostHeader?: string
): Promise<soap.Client & T> =>
  new Promise((resolve, reject) => {
    soap.createClient(wsdlUri, options, (err, client) => {
      if (err) {
        reject(err);
      } else {
        if (cert !== undefined && key !== undefined) {
          client.setSecurity(
            new soap.ClientSSLSecurity(Buffer.from(key), Buffer.from(cert))
          );
        }

        if (hostHeader !== undefined) {
          client.addHttpHeader("Host", hostHeader);
        }
        resolve(client as soap.Client & T); // tslint:disable-line:no-useless-cast
      }
    });
  });

/**
 * Converts a SoapMethodCB into a SoapMethodPromise
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const promisifySoapMethod = <I, O>(f: SoapMethodCB<I, O>) => (
  input: I,
  options?: Pick<soap.ISecurity, "postProcess">
) =>
  new Promise<O>((resolve, reject) => {
    f(input, (err, result) => (err ? reject(err) : resolve(result)), options);
  });

/**
 * Makes sure that importoSingoloVersamento is formatted with 2 decimals
 */
export const fixImportoSingoloVersamentoDigits = (xml: string): string =>
  xml.replace(
    /(\d+)(\.\d+)?([\n\s]*<\/importoSingoloVersamento)/,
    (_, p1, p2, p3) => {
      const decimals = p2 !== undefined ? String(p2).slice(0, 3) : ".";
      const padded = decimals.padEnd(3, "0");
      return `${p1}${padded}${p3}`;
    }
  );
