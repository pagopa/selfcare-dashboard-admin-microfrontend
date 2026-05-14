import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { useState } from 'react';
import { useTokenExchange } from '../../../hooks/useTokenExchange';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';

type UseProductNavigationProps = {
  products: Array<Product>;
  partyDetail: Party | null;
  hasMoreThanOneInteropEnv: boolean;
};

export const useProductNavigation = ({
  products,
  partyDetail,
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

    void invokeProductBo(productFromConfiguration, partyDetail, undefined, lang);
  };

  const handleInteropConfirm = () => {
    void invokeProductBo(interopProduction as Product, partyDetail, undefined, lang);
  };

  const handleGenericEnvConfirm = (envValue: string) => {
    void invokeProductBo(activeProduct as Product, partyDetail, envValue, lang);
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
