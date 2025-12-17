import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../model/Product';
import { fetchProducts } from '../../../services/productService';
import { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';

export const contractTemplatesMock: Array<ContractTemplateResponse> = [
  {
    contractTemplateId: 'tmpl_001',
    contractTemplatePath: '/templates/standard-v1.pdf',
    contractTemplateVersion: '1.0.0',
    createdAt: '2025-12-17T10:15:30.000Z' as any,
    createdBy: 'user_123',
    description: 'Template standard per contratti',
    name: 'Standard Contract',
    productId: 'prod-io',
  },
  {
    contractTemplateId: 'tmpl_002',
    contractTemplatePath: '/templates/premium-v2.pdf',
    contractTemplateVersion: '2.0.0',
    createdAt: '2025-10-01T08:00:00.000Z' as any,
    createdBy: 'user_456',
    description: 'Template premium aggiornato',
    name: 'Premium Contract',
    productId: 'prod-interop',
  },
  {
    contractTemplateId: 'tmpl_002',
    contractTemplatePath: '/templates/premium-v2.pdf',
    contractTemplateVersion: '2.0.0',
    createdAt: '2025-10-01T08:00:00.000Z' as any,
    createdBy: 'user_456',
    description: 'Template premium aggiornato',
    name: 'Premium Contract',
    productId: 'prod-interop',
  },
];

export const useContracts = () => {
  const addError = useErrorDispatcher();

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [contractsByProduct, setContractsByProduct] = useState<
    Record<string, Array<ContractTemplateResponse>>
  >({});

  const hasLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    hasLoadedRef.current = true;

    const loadProducts = async (): Promise<void> => {
      try {
        const data = await fetchProducts();
        const productIdsInContracts = new Set(contractTemplatesMock.map((giamma) => giamma.productId ));
        const filteredProducts = data.filter((p) => productIdsInContracts.has(p.id));
        setProducts(filteredProducts);
        console.log(data);
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

  const loadContractsForProduct = (product: Product): void => {
    const contracts = contractTemplatesMock.filter(
      (c) => c.productId === product.id
    );

    setContractsByProduct((prev) => ({
      ...prev,
      [product.id]: contracts,
    }));
  };

  useEffect(() => {
    products.forEach(loadContractsForProduct);
  }, [products]);

  return {
    loading,
    products,
    contractsByProduct,
  };
};
