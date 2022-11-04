/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";
import { enumType } from "@pagopa/ts-commons/lib/types";

export enum SelcRoleEnum {
  "ADMIN" = "ADMIN",

  "LIMITED" = "LIMITED"
}

// required attributes
const ProductRoleInfoResourceR = t.interface({
  relationshipId: t.string,

  role: t.string,

  selcRole: enumType<SelcRoleEnum>(SelcRoleEnum, "selcRole"),

  status: t.string
});

// optional attributes
const ProductRoleInfoResourceO = t.partial({});

export const ProductRoleInfoResource = t.intersection(
  [ProductRoleInfoResourceR, ProductRoleInfoResourceO],
  "ProductRoleInfoResource"
);

export type ProductRoleInfoResource = t.TypeOf<typeof ProductRoleInfoResource>;
