import { useState, useEffect } from 'react';
import { ContractTemplateResponse } from '../../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { Product } from '../../../model/Product';
import { fetchContractTemplates } from '../../../services/contractService';
import { fetchProducts } from '../../../services/productService';

export const useContracts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [contractsByProduct, setContractsByProduct] = useState<
    Record<string, Array<ContractTemplateResponse>>
  >({});

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      const productsData = await fetchProducts();
      setProducts(productsData);

      const entries: Array<[string, Array<ContractTemplateResponse>]> = await Promise.all(
        productsData.map(async (product) => {
          try {
            const contracts = await fetchContractTemplates(product.title, '');
            return [product.id, contracts];
          } catch {
            return [product.id, []];
          }
        })
      );

      setContractsByProduct(Object.fromEntries(entries));
      setLoading(false);
    };

    void loadInitialData();
  }, []);

  return { loading, products, contractsByProduct };
};
