/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { UserGroupPlainResource } from "./UserGroupPlainResource";
import * as t from "io-ts";

// required attributes
const PageOfUserGroupPlainResourceR = t.interface({
  content: t.readonlyArray(
    UserGroupPlainResource,
    "array of UserGroupPlainResource"
  ),

  number: t.Integer,

  size: t.Integer,

  totalElements: t.Integer,

  totalPages: t.Integer
});

// optional attributes
const PageOfUserGroupPlainResourceO = t.partial({});

export const PageOfUserGroupPlainResource = t.intersection(
  [PageOfUserGroupPlainResourceR, PageOfUserGroupPlainResourceO],
  "PageOfUserGroupPlainResource"
);

export type PageOfUserGroupPlainResource = t.TypeOf<
  typeof PageOfUserGroupPlainResource
>;
