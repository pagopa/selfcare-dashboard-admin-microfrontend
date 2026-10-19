import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from '../redux/store';

export const renderWithProviders = async (
  component: React.ReactElement,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </Provider>
    </Router>
  );
  return { store, history };
};
