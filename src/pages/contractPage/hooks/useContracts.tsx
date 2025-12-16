import { useEffect, useRef, useState } from 'react';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import type { Product } from '../../../model/Product';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { fetchProducts } from '../../../services/productService';
import { fetchContractTemplates } from '../../../services/contractService';

export const useContracts = () => {
  const addError = useErrorDispatcher();

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [contractsByProduct, setContractsByProduct] = useState<
    Record<string, Array<ContractTemplateResponse>>
  >({});

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    hasLoadedRef.current = true;

    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        addError({
          id: 'load-products-error',
          blocking: false,
          techDescription: 'Failed to load products',
          toNotify: false,
          error: error as Error,
        });
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [addError]);

  const loadContractsForProduct = async (product: Product) => {
    if (contractsByProduct[product.id]) {
      return;
    }

    try {
      const contracts = await fetchContractTemplates(product.title, '');
      setContractsByProduct((prev) => ({
        ...prev,
        [product.id]: contracts,
      }));
    } catch {
      setContractsByProduct((prev) => ({
        ...prev,
        [product.id]: [],
      }));
    }
  };

  return {
    loading,
    products,
    contractsByProduct,
    loadContractsForProduct,
  };
};
