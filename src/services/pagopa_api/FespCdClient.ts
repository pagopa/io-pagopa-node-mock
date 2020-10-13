import { NonEmptyString } from "italia-ts-commons/lib/strings";
import * as path from "path";
import * as soap from "soap";
import { createClient, promisifySoapMethod } from "../../utils/soap";
import { IFespCdSoap } from "./IFespCdSoap";

// WSDL path for FespCd
const FESP_CD_WSDL_PATH = path.join(
  __dirname,
  "./../../wsdl/CdPerNodo.wsdl"
) as NonEmptyString;

/**
 * Create a client for FespCd SOAP service
 * @param {soap.IOptions} options - Soap options
 * @return {Promise<soap.Client & IPPTPortSoap>} Soap client created
 */
export function createFespCdClient(
  options: soap.IOptions,
  cert?: string,
  key?: string,
  hostHeader?: string
): Promise<soap.Client & IFespCdSoap> {
  return createClient<IFespCdSoap>(
    FESP_CD_WSDL_PATH,
    options,
    cert,
    key,
    hostHeader
  );
}

/**
 * Converts the callback based methods of a FespCd client to
 * promise based methods.
 */
export class FespCdClientAsync {
  public readonly cdInfoWisp = promisifySoapMethod(this.client.cdInfoWisp);
  constructor(private readonly client: IFespCdSoap) {}
}
