/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";
import { enumType } from "@pagopa/ts-commons/lib/types";

export enum TypeEnum {
  "AOO" = "AOO",

  "PT" = "PT",

  "UO" = "UO"
}

// required attributes
const DelegationRequestDtoR = t.interface({
  from: t.string,

  institutionFromName: t.string,

  institutionToName: t.string,

  productId: t.string,

  to: t.string,

  type: enumType<TypeEnum>(TypeEnum, "type")
});

// optional attributes
const DelegationRequestDtoO = t.partial({});

export const DelegationRequestDto = t.intersection(
  [DelegationRequestDtoR, DelegationRequestDtoO],
  "DelegationRequestDto"
);

export type DelegationRequestDto = t.TypeOf<typeof DelegationRequestDto>;
