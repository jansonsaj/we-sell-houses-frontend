import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import Register from '../components/Register';

const server = setupServer(
    rest.post(`${process.env.REACT_APP_API_URL}/users`,
        (req, res, ctx) => {
          return res(
              ctx.status(201),
          );
        },
    ));

/**
 * Render Register component
 * @return {object} Rendered component
 */
function renderRegister() {
  const history = createMemoryHistory();
  return render(
      <Router history={history}>
        <Register />,
      </Router>,
  );
}

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('when user registers, success message is displayed', async () => {
  expect.assertions(1);
  const {container} = renderRegister();
  userEvent.type(
      screen.getByPlaceholderText(/Sign-up code/i),
      'test sign-up code',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/^Password/i),
      'password',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Confirm password/i),
      'password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Account created/i);
  expect(element).toBeInTheDocument();
});

test('when user enters mismatching passwords, alert is displayed', async () => {
  expect.assertions(1);
  const {container} = renderRegister();
  userEvent.type(
      screen.getByPlaceholderText(/Sign-up code/i),
      'test sign-up code',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/^Password/i),
      'password',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Confirm password/i),
      'mismatching password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen
      .findByText(/The two passwords that you entered do not match/i);
  expect(element).toBeInTheDocument();
});

test('when register fails, alert is displayed', async () => {
  expect.assertions(1);
  server.use(
      rest.post(`${process.env.REACT_APP_API_URL}/users`,
          (req, res, ctx) => {
            return res(
                ctx.status(500),
            );
          }),
  );
  const {container} = renderRegister();
  userEvent.type(
      screen.getByPlaceholderText(/Sign-up code/i),
      'test sign-up code',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/^Password/i),
      'password',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Confirm password/i),
      'password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Unable to create an account/i);
  expect(element).toBeInTheDocument();
});

