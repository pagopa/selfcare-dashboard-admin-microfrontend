import { appStateReducer } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { permissionsReducer } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { userReducer } from '@pagopa/selfcare-common-frontend/lib/redux/slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { LOG_REDUX_ACTIONS } from '../utils/constants';

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined];

type AppStoreState = Record<string, unknown>;

export type CreateStore = typeof configureStore;

// Keep returned types explicit so federation dts-plugin can name exports.
export const createStore = (): CreateStore =>
  configureStore({
    reducer: {
      user: userReducer,
      appState: appStateReducer,
      permissions: permissionsReducer,
    },
    middleware: (getDefaultMiddleware: any) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array),
        getDefaultMiddleware({ serializableCheck: false })
      ),
  });

export const store = createStore();

// Avoid exporting non-portable inferred types for federation dts generation.
export type RootState = AppStoreState;
export type AppDispatch = typeof store.dispatch;
