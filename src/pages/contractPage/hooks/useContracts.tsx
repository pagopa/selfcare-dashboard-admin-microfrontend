import { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../model/Product';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';

/**
 * MOCK PRODUCTS
 */
const MOCK_PRODUCTS: Array<Product> = [
  {
    id: 'prod-interop',
    title: 'Interoperabilità',
  } as Product,
];

/**
 * MOCK CONTRACTS
 * (usa SOLO campi che la UI legge)
 */
const MOCK_CONTRACTS_BY_PRODUCT: Record<
  string,
  Array<ContractTemplateResponse>
> = {
  'prod-interop': [
    {
      contractTemplateId: 'mock-1',
      name: 'Contratto Interoperabilità',
      contractTemplateVersion: '1.0.0',
      createdAt: new Date().toISOString() as any,
      createdBy: 'Super Giampo',
      productId: 'prod-interop',
    },
    {
      contractTemplateId: 'mock-2',
      name: 'Contratto Interoperabilità',
      contractTemplateVersion: '1.1.0',
      createdAt: new Date().toISOString() as any,
      createdBy: 'Sempre io',
      productId: 'prod-interop',
    },
  ],
};

export const useContracts = () => {
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

    setProducts(MOCK_PRODUCTS);
    setLoading(false);
  }, []);


  const loadContractsForProduct = async (product: Product) => {
    if (contractsByProduct[product.id]) {
      return;
    }

    const contracts = MOCK_CONTRACTS_BY_PRODUCT[product.id] ?? [];

    setContractsByProduct((prev) => ({
      ...prev,
      [product.id]: contracts,
    }));
  };

  return {
    loading,
    products,
    contractsByProduct,
    loadContractsForProduct,
  };
};