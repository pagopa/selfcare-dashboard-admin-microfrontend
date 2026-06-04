import { GridColDef } from "@mui/x-data-grid";
import { TFunction } from 'i18next';
import { OnboardingIndexResource } from "../../../../../api/generated/party-registry-proxy/OnboardingIndexResource";
import { Product } from "../../../../../model/Product";
import { ActionCell, DescriptionCell, renderCellWithTooltip, renderHeaderWithTooltip, renderStatusCell, renderUpdatedAtCell } from "./cells";

export type ModalState = {
  type: 'backoffice' | 'product' | null;
  row: OnboardingIndexResource | null;
};

export const getOnboardingsColumns = (
  t: TFunction,
  products: Array<Product>,
  hasBackofficeAdmin: boolean,
  setModalState: (state: ModalState) => void,
): Array<GridColDef<OnboardingIndexResource>> => [
    {
      field: 'description',
      headerName: t('onboardingsPage.table.institutionName'),
      flex: 2,
      sortable: false,
      valueGetter: (params) => {
        const description = params.row?.description;
        const parentDescription = params.row?.parentDescription;
        return description && parentDescription
          ? `${description} - ${parentDescription}`
          : description || '';
      },
      renderCell: (params) => <DescriptionCell params={params} />,
    },
    {
      field: 'productId',
      headerName: t('onboardingsPage.table.product'),
      flex: 1,
      sortable: false,
      valueGetter: (params) => {
        const productId = params.row?.productId;

        const subProduct = products
          .flatMap((p) => p.subProducts ?? [])
          .find((sp) => sp.id === productId);

        const product = products.find((p) => p.id === productId);

        return subProduct?.title ?? product?.title ?? productId ?? '';
      },
      renderCell: renderCellWithTooltip,
    },
    {
      field: 'institutionType',
      headerName: t('onboardingsPage.table.institutionType'),
      description: t('onboardingsPage.table.institutionTypeTooltip'),
      flex: 1.5,
      sortable: false,
      renderHeader: renderHeaderWithTooltip,
      valueGetter: (params) => {
        const raw = params.row?.institutionType;
        if (!raw) {
          return '';
        }
        const key = `common.institutionType.descriptions.${raw.toLowerCase()}`;
        const translated = t(key);
        return translated === key ? raw : translated;
      },
      renderCell: renderCellWithTooltip,
    },
    {
      field: 'requestDate',
      headerName: t('onboardingsPage.table.requestDate'),
      description: t('onboardingsPage.table.requestDateTooltip'),
      flex: 1,
      sortable: true,
      renderHeader: renderHeaderWithTooltip,
      valueGetter: (params) => {
        const date = params.row?.createdAt;
        return date ? new Date(date) : null;
      },
      renderCell: renderUpdatedAtCell,
    },
    {
      field: 'status',
      headerName: t('onboardingsPage.table.status'),
      flex: 1,
      sortable: false,
      renderCell: renderStatusCell,
    },
    {
      field: 'actions',
      headerName: '',
      width: hasBackofficeAdmin ? 160 : 56,
      sortable: false,
      disableColumnMenu: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => <ActionCell params={params} products={products} onOpenModal={setModalState} />,
    },
  ];