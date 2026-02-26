import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { renderComponent } from './RenderComponents/RenderComponentAdmin.test';

test('test routing to dashboard request page', async () => {
  const history = createMemoryHistory(); 
  renderComponent(undefined, history);
  expect(screen.queryByText('Richiesta di adesione')).not.toBeInTheDocument();
});
