import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import NewProperty from '../components/NewProperty';
import {antdSelectOption} from './helpers';

const server = setupServer(
    rest.post(`${process.env.REACT_APP_API_URL}/properties`,
        (req, res, ctx) => {
          return res(
              ctx.status(201),
              ctx.json({_id: '123'}),
          );
        },
    ));

/**
 * Render SignIn component
 * @return {object} Rendered component
 */
function renderNewProperty() {
  localStorage.setItem('accessToken', 'test token');
  const history = createMemoryHistory();
  return render(
      <Router history={history}>
        <NewProperty />,
      </Router>,
  );
}

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('when property created, displays a success message', async () => {
  expect.assertions(1);
  const {container} = renderNewProperty();
  await antdSelectOption(
      screen.getByLabelText(/Type/i),
      /Cottage/i,
  );
  userEvent.type(
      screen.getByLabelText(/Title/i),
      'test title',
  );
  userEvent.type(
      screen.getByLabelText(/Address line 1/i),
      'test address line 1',
  );
  userEvent.type(
      screen.getByLabelText(/Town/i),
      'test town',
  );
  userEvent.type(
      screen.getByLabelText(/Postcode/i),
      'abc',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Property created/i);
  expect(element).toBeInTheDocument();
});

test('when failed to create property, display alert', async () => {
  expect.assertions(1);
  server.use(
      rest.post(`${process.env.REACT_APP_API_URL}/properties`,
          (req, res, ctx) => {
            return res(
                ctx.status(500),
            );
          },
      ));
  const {container} = renderNewProperty();
  await antdSelectOption(
      screen.getByLabelText(/Type/i),
      /Cottage/i,
  );
  userEvent.type(
      screen.getByLabelText(/Title/i),
      'test title',
  );
  userEvent.type(
      screen.getByLabelText(/Address line 1/i),
      'test address line 1',
  );
  userEvent.type(
      screen.getByLabelText(/Town/i),
      'test town',
  );
  userEvent.type(
      screen.getByLabelText(/Postcode/i),
      'abc',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Unable to create a property/i);
  expect(element).toBeInTheDocument();
});
