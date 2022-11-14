/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";
import { EmailString } from "@pagopa/ts-commons/lib/strings";

// required attributes
const DpoDataR = t.interface({
  address: t.string,

  email: EmailString,

  pec: EmailString
});

// optional attributes
const DpoDataO = t.partial({});

export const DpoData = t.intersection([DpoDataR, DpoDataO], "DpoData");

export type DpoData = t.TypeOf<typeof DpoData>;