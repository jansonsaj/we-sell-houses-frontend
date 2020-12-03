import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import UpdateProperty from '../components/UpdateProperty';
import {antdSelectOption} from './helpers';

const property = {
  _id: 'test-id',
  type: 'cottage',
  status: 'underOffer',
  features: ['Garage'],
  price: '100.00',
  title: 'test title',
  description: 'test description',
  location: {
    addressLine1: 'test address line 1',
    addressLine2: 'test address line 2',
    town: 'test town',
    county: 'test county',
    postcode: 'abc',
  },
  files: [],
};

const server = setupServer(
    rest.get(`${process.env.REACT_APP_API_URL}/properties/:id`,
        (req, res, ctx) => {
          return res(
              ctx.status(200),
              ctx.json(property),
          );
        },
    ),
    rest.put(`${process.env.REACT_APP_API_URL}/properties/:id`,
        (req, res, ctx) => {
          return res(
              ctx.status(200),
          );
        },
    ));

/**
 * Render Update property component
 * @return {object} Rendered component
 */
function renderUpdateProperty() {
  localStorage.setItem('accessToken', 'test token');
  const history = createMemoryHistory();
  history.goBack = () => {};
  return render(
      <Router history={history}>
        <UpdateProperty
          match={{params: {id: 'test-id'}}} />,
      </Router>,
  );
}

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('when property updated, displays a success message', async () => {
  expect.assertions(1);
  const {container} = renderUpdateProperty();
  await screen.findByText(/Edit property/i);
  await antdSelectOption(
      screen.getByLabelText(/Type/i),
      /^Detached/i,
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
      '12',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Property updated/i);
  expect(element).toBeInTheDocument();
});

test('fills form with values from property', async () => {
  renderUpdateProperty();
  await screen.findByText(/Edit property/i);
  expect(screen.getByText(/Cottage/i)).toBeInTheDocument();
  expect(screen.getByText(/Under offer/i)).toBeInTheDocument();
  expect(screen.getByText(/Garage/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Asking price/i)).toHaveValue('£ 100');
  expect(screen.getByLabelText(/Title/i)).toHaveValue('test title');
  expect(screen.getByLabelText(/Description/i)).toHaveValue('test description');
  expect(screen.getByLabelText(/Address line 1/i))
      .toHaveValue('test address line 1');
  expect(screen.getByLabelText(/Address line 2/i))
      .toHaveValue('test address line 2');
  expect(screen.getByLabelText(/County/i)).toHaveValue('test county');
  expect(screen.getByLabelText(/Postcode/i)).toHaveValue('abc');
});

test('when failed to update property, display alert', async () => {
  expect.assertions(1);
  server.use(
      rest.put(`${process.env.REACT_APP_API_URL}/properties/:id`,
          (req, res, ctx) => {
            return res(
                ctx.status(500),
            );
          },
      ));
  const {container} = renderUpdateProperty();
  await screen.findByText(/Edit property/i);
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Unable to update the property/i);
  expect(element).toBeInTheDocument();
});

test('when cannot get property, display alert', async () => {
  expect.assertions(1);
  server.use(
      rest.get(`${process.env.REACT_APP_API_URL}/properties/:id`,
          (req, res, ctx) => {
            return res(
                ctx.status(500),
            );
          },
      ));
  renderUpdateProperty();
  const element = await screen.findByText(/Cannot load property/i);
  expect(element).toBeInTheDocument();
});
