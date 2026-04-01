import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { useState } from 'react';
import { SearchServiceInstitution } from '../../../api/generated/party-registry-proxy/SearchServiceInstitution';
import { useTokenExchange } from '../../../hooks/useTokenExchange';
import { Product } from '../../../model/Product';

type UseProductNavigationProps = {
  products: Array<Product>;
  selectedInstitution: SearchServiceInstitution | null;
  hasMoreThanOneInteropEnv: boolean;
};

export const useProductNavigation = ({
  products,
  selectedInstitution,
  hasMoreThanOneInteropEnv,
}: UseProductNavigationProps) => {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [openInteropModal, setOpenInteropModal] = useState(false);
  const [openGenericEnvModal, setOpenGenericEnvModal] = useState(false);

  const { invokeProductBo } = useTokenExchange();
  const lang = i18n.language;

  const interopProduction = products.find((p) => p.id === 'prod-interop');

  const handleOnboardedProductClick = (productFromConfiguration?: Product) => {
    if (!productFromConfiguration) {
      return;
    }

    setActiveProduct(productFromConfiguration);

    if (hasMoreThanOneInteropEnv && productFromConfiguration.id?.startsWith('prod-interop')) {
      setOpenInteropModal(true);
      return;
    }

    if (
      productFromConfiguration.backOfficeEnvironmentConfigurations &&
      productFromConfiguration.backOfficeEnvironmentConfigurations.length > 0 &&
      productFromConfiguration.id !== 'prod-interop'
    ) {
      setOpenGenericEnvModal(true);
      return;
    }

    void invokeProductBo(
      productFromConfiguration,
      selectedInstitution as SearchServiceInstitution,
      undefined,
      lang
    );
  };

  const handleInteropConfirm = () => {
    void invokeProductBo(
      interopProduction as Product,
      selectedInstitution as SearchServiceInstitution,
      undefined,
      lang
    );
  };

  const handleGenericEnvConfirm = (envValue: string) => {
    void invokeProductBo(
      activeProduct as Product,
      selectedInstitution as SearchServiceInstitution,
      envValue,
      lang
    );
  };

  return {
    activeProduct,
    interopProduction,
    openInteropModal,
    openGenericEnvModal,
    handleOnboardedProductClick,
    handleInteropConfirm,
    handleGenericEnvConfirm,
    closeInteropModal: () => setOpenInteropModal(false),
    closeGenericEnvModal: () => setOpenGenericEnvModal(false),
  };
};
