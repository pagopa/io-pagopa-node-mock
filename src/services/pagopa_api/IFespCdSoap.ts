import { cdInfoWisp_element_ppt } from "../../generated/FespCdService/cdInfoWisp_element_ppt";
import { cdInfoWispResponse_element_ppt } from "../../generated/FespCdService/cdInfoWispResponse_element_ppt";
import { SoapMethodCB } from "../../utils/soap";

export interface IFespCdSoap {
  readonly cdInfoWisp: SoapMethodCB<
    cdInfoWisp_element_ppt,
    cdInfoWispResponse_element_ppt
  >;
}
