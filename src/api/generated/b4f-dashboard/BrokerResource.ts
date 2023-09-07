/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const BrokerResourceR = t.interface({});

// optional attributes
const BrokerResourceO = t.partial({
  code: t.string,

  description: t.string,

  enabled: t.boolean
});

export const BrokerResource = t.intersection(
  [BrokerResourceR, BrokerResourceO],
  "BrokerResource"
);

export type BrokerResource = t.TypeOf<typeof BrokerResource>;
