/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const CertifiedFieldResourceOfstringR = t.interface({
  certified: t.boolean,

  value: t.string
});

// optional attributes
const CertifiedFieldResourceOfstringO = t.partial({});

export const CertifiedFieldResourceOfstring = t.intersection(
  [CertifiedFieldResourceOfstringR, CertifiedFieldResourceOfstringO],
  "CertifiedFieldResourceOfstring"
);

export type CertifiedFieldResourceOfstring = t.TypeOf<
  typeof CertifiedFieldResourceOfstring
>;
