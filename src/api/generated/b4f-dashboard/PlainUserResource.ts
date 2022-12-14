/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const PlainUserResourceR = t.interface({
  id: t.string,

  name: t.string,

  surname: t.string
});

// optional attributes
const PlainUserResourceO = t.partial({});

export const PlainUserResource = t.intersection(
  [PlainUserResourceR, PlainUserResourceO],
  "PlainUserResource"
);

export type PlainUserResource = t.TypeOf<typeof PlainUserResource>;
