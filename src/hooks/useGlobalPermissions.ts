import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { getPermissionsListService } from '../services/dashboardService';

export const useGlobalPermissions = () => {
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();

  useEffect(() => {
    getPermissionsListService()
      .then((res) => {
        const payload = (res.items || []).map((p) => ({
          productId: p.productId ?? '',
          actions: [...(p.permissions ?? [])],
        }));
        dispatch(setProductPermissions(payload));
      })
      .catch((error) => {
        addError({
          id: 'getPermissionsList-api-error',
          blocking: false,
          techDescription: 'Get permissions list failed',
          toNotify: false,
          error: error as Error,
        });
      });
  }, []);
};
