import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getPermissionsListService } from '../services/productService';

export const useGlobalPermissions = () => {
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();

  const permissions = useAppSelector((state: RootState) => state.permissions);
  const hasFetched = useRef(false);

  useEffect(() => {
    const productPermissions = (permissions as any).productPermissions || [];
    if (productPermissions.length > 0 || hasFetched.current) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    hasFetched.current = true;
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
  }, [permissions]);
};
