import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../../../model/Product';
import {
  fetchContractTemplatesNested,
  type ContractsNestedResponse,
} from '../../../services/contractService';
import type { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { fetchProducts } from '../../../services/productService';

export const useContracts = () => {
  const addError = useErrorDispatcher();

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [contractsByProduct, setContractsByProduct] = useState<
    Record<string, Array<ContractTemplateResponse>>
  >({});

  const hasLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasLoadedRef.current) {return;}

    // eslint-disable-next-line functional/immutable-data
    hasLoadedRef.current = true;

    const loadData = async () => {
      try {
        const [productsResponse, contractsResponse]: [
          Array<Product>,
          ContractsNestedResponse
        ] = await Promise.all([fetchProducts(), fetchContractTemplatesNested()]);

        const mappedContracts: Record<string, Array<ContractTemplateResponse>> = {};

        // Trasformiamo l'oggetto annidato in un array singolo per ogni prodotto
        for (const [productId, contractsByName] of Object.entries(contractsResponse)) {
          // eslint-disable-next-line functional/immutable-data
          mappedContracts[productId] = [];
          for (const [contractName, contractList] of Object.entries(contractsByName)) {
            const contractsArray: Array<ContractTemplateResponse> = (contractList as Array<ContractTemplateResponse>).map(
              (contract) => ({
                ...contract,
                description: contractName,
              })
            );
            // eslint-disable-next-line functional/immutable-data
            mappedContracts[productId].push(...contractsArray);
          }
        }

        setContractsByProduct(mappedContracts);

        const productIdsWithContracts = new Set(Object.keys(mappedContracts));
        const filteredProducts: Array<Product> = productsResponse.filter((p) =>
          productIdsWithContracts.has(p.id)
        );

        setProducts(filteredProducts);
      } catch (error) {
        addError({
          id: 'load-contracts-error',
          blocking: false,
          techDescription: 'Failed to load products or contracts',
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
