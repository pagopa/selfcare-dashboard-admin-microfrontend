import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '@pagopa/selfcare-common-frontend/index.css';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import '../../locale';
import AdminPage from '../../pages/adminPage/AdminPage';
import ContractBuildPage from '../../pages/contractPage/ContractEditorPage';
import ContractPage from '../../pages/contractPage/ContractPage';
import { store } from '../../redux/store';
import reportWebVitals from '../../reportWebVitals';
import { MOCK_USER } from '../../utils/constants';
import { ENV } from '../../utils/env';
import App from './App';
import './index.css';
const onSuccessEncoded = encodeURIComponent(location.pathname + location.search);

// eslint-disable-next-line functional/immutable-data
CONFIG.MOCKS.MOCK_USER = MOCK_USER;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGIN = `${ENV.URL_FE.LOGIN}?onSuccess=` + onSuccessEncoded;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGOUT = ENV.URL_FE.LOGOUT;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.ASSISTANCE = ENV.URL_FE.ASSISTANCE;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path={ENV.ROUTES.ADMIN_SEARCH} exact={true}>
              <AdminPage />
            </Route>
            <Route path={ENV.ROUTES.ADMIN_PARTY_DETAIL} exact={false}>
              <App AppRouting={(window as any).AppRouting} store={store} />
            </Route>
            <Route
              path={ENV.ROUTES.ADMIN_CONTRACT}
              exact
              render={(props) => <ContractPage {...props} />}
            />
            <Route
              path={ENV.ROUTES.ADMIN_CONTRACT_EDITOR}
              exact
              render={(props) => <ContractBuildPage {...props} />}
            />
            
            <Route
              path={`${ENV.ROUTES.ADMIN_CONTRACT_EDITOR}/:productId/:contractTemplateId/editor`}
              exact
              render={(props) => <ContractBuildPage {...props} />}
            />
            <Route path="*">
              <Redirect
                to={resolvePathVariables(ENV.ROUTES.ADMIN_PARTY_DETAIL, {
                  tokenId: 'tokenId01',
                })}
              />
            </Route>
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
