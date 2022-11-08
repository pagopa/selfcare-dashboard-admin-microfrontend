/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const UserProductRolesR = t.interface({});

// optional attributes
const UserProductRolesO = t.partial({
  productRoles: t.readonlyArray(t.string, "array of string")
});

export const UserProductRoles = t.intersection(
  [UserProductRolesR, UserProductRolesO],
  "UserProductRoles"
);

export type UserProductRoles = t.TypeOf<typeof UserProductRoles>;