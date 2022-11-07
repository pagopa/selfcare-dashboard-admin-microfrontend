/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const UpdateUserGroupDtoR = t.interface({
  description: t.string,

  members: t.readonlyArray(t.string, "array of string"),

  name: t.string
});

// optional attributes
const UpdateUserGroupDtoO = t.partial({});

export const UpdateUserGroupDto = t.intersection(
  [UpdateUserGroupDtoR, UpdateUserGroupDtoO],
  "UpdateUserGroupDto"
);

export type UpdateUserGroupDto = t.TypeOf<typeof UpdateUserGroupDto>;
