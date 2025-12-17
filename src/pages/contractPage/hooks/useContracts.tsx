import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../model/Product';
import { fetchProducts } from '../../../services/productService';
import { fetchContractTemplates } from '../../../services/contractService';
import { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';



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

    const loadData = async (): Promise<void> => {
      try {
        const [products, contracts] = await Promise.all([
          fetchProducts(),
          fetchContractTemplates(),
        ]);
        const contractsWithProductId = contracts.filter(
          (contract): contract is ContractTemplateResponse & { productId: string } =>
            contract.productId !== undefined && contract.productId !== null
        );
        const productIdsInContracts = new Set(contractsWithProductId.map((contract) => contract.productId));
        const filteredProducts = products.filter((p) => productIdsInContracts.has(p.id));
        setProducts(filteredProducts);
        const contractsByProductMap = contractsWithProductId.reduce<Record<string, Array<ContractTemplateResponse>>>(
          (acc, contract) => ({
            ...acc,
            [contract.productId]: [...(acc[contract.productId] ?? []), contract],
          }),
          {}
        );
        setContractsByProduct(contractsByProductMap);
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

    void loadData();
  }, [addError]);

  return {
    loading,
    products,
    contractsByProduct,
  };
};
