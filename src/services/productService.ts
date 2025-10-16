import { DashboardApi } from '../api/DashboardApiClient';
import { mockedPartyProducts } from '../microcomponents/mock_dashboard/data/product';
import { Product, productResource2Product } from '../model/Product';

export const fetchProducts = (): Promise<Array<Product>> => {
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return Promise.resolve(mockedPartyProducts);
  } else {
    return DashboardApi.getProducts().then((productResources) =>
      productResources ? productResources.map(productResource2Product) : []
    );
  }
};
