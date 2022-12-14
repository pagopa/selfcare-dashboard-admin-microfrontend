/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { ProductInfoResource } from "./ProductInfoResource";
import * as t from "io-ts";
import { EmailString } from "@pagopa/ts-commons/lib/strings";
import { enumType } from "@pagopa/ts-commons/lib/types";

export enum RoleEnum {
  "ADMIN" = "ADMIN",

  "LIMITED" = "LIMITED"
}

// required attributes
const InstitutionUserDetailsResourceR = t.interface({
  email: EmailString,

  fiscalCode: t.string,

  id: t.string,

  name: t.string,

  products: t.readonlyArray(
    ProductInfoResource,
    "array of ProductInfoResource"
  ),

  role: enumType<RoleEnum>(RoleEnum, "role"),

  status: t.string,

  surname: t.string
});

// optional attributes
const InstitutionUserDetailsResourceO = t.partial({});

export const InstitutionUserDetailsResource = t.intersection(
  [InstitutionUserDetailsResourceR, InstitutionUserDetailsResourceO],
  "InstitutionUserDetailsResource"
);

export type InstitutionUserDetailsResource = t.TypeOf<
  typeof InstitutionUserDetailsResource
>;
