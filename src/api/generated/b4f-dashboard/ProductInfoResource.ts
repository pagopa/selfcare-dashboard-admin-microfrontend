/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { ProductRoleInfoResource } from "./ProductRoleInfoResource";
import * as t from "io-ts";

// required attributes
const ProductInfoResourceR = t.interface({});

// optional attributes
const ProductInfoResourceO = t.partial({
  id: t.string,

  roleInfos: t.readonlyArray(
    ProductRoleInfoResource,
    "array of ProductRoleInfoResource"
  ),

  title: t.string
});

export const ProductInfoResource = t.intersection(
  [ProductInfoResourceR, ProductInfoResourceO],
  "ProductInfoResource"
);

export type ProductInfoResource = t.TypeOf<typeof ProductInfoResource>;
