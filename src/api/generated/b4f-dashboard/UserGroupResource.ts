/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { PlainUserResource } from "./PlainUserResource";
import { ProductUserResource } from "./ProductUserResource";
import * as t from "io-ts";
import { enumType } from "@pagopa/ts-commons/lib/types";
import { UTCISODateFromString } from "@pagopa/ts-commons/lib/dates";

export enum StatusEnum {
  "ACTIVE" = "ACTIVE",

  "SUSPENDED" = "SUSPENDED"
}

// required attributes
const UserGroupResourceR = t.interface({
  description: t.string,

  id: t.string,

  institutionId: t.string,

  members: t.readonlyArray(ProductUserResource, "array of ProductUserResource"),

  name: t.string,

  productId: t.string,

  status: enumType<StatusEnum>(StatusEnum, "status")
});

// optional attributes
const UserGroupResourceO = t.partial({
  createdAt: UTCISODateFromString,

  createdBy: PlainUserResource,

  modifiedAt: UTCISODateFromString,

  modifiedBy: PlainUserResource
});

export const UserGroupResource = t.intersection(
  [UserGroupResourceR, UserGroupResourceO],
  "UserGroupResource"
);

export type UserGroupResource = t.TypeOf<typeof UserGroupResource>;
