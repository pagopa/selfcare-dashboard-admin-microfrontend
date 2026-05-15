import { useEffect, useState } from 'react';

import { useLoading } from '@pagopa/selfcare-common-frontend';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import { Product } from '../model/Product';
import { fetchProducts } from '../services/productService';
import { LOADING_TASK_PRODUCTS } from '../utils/constants';

export const useFetchProducts = () => {
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_PRODUCTS);

  const [products, setProducts] = useState<Array<Product>>([]);

  useEffect(() => {
    if (products?.length > 0) {
      return;
    }

    setLoading(true);

    fetchProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        addError({
          id: 'fetchProducts-api-error',
          blocking: false,
          techDescription: 'Fetch products failed',
          toNotify: false,
          error: error as Error,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [products]);

  return {
    products,
  };
};
