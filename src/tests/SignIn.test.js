import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import SignIn from '../components/SignIn';

const server = setupServer(
    rest.post(`${process.env.REACT_APP_API_URL}/users/signin`,
        (req, res, ctx) => {
          return res(ctx.json({
            id: 'test id',
            accessToken: 'test token',
          }));
        }),
);

/**
 * Render SignIn component
 * @param {function} setSignedIn Called to change signed in value
 * @return {object} Rendered component
 */
function renderSignIn(setSignedIn = () => {}) {
  const history = createMemoryHistory();
  return render(
      <Router history={history}>
        <SignIn setSignedIn={setSignedIn} />,
      </Router>,
  );
}

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('when user signs in, then set signed in is called', async () => {
  expect.assertions(1);
  const {container} = renderSignIn((isSignedIn) => {
    expect(isSignedIn).toBeTruthy();
  });
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Password/i),
      'password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  await screen.findByText(/You have signed in/i);
});

test('when user signs in, then local storage is updated', async () => {
  expect.assertions(2);
  const {container} = renderSignIn();
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Password/i),
      'password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  await screen.findByText(/You have signed in/i);
  expect(localStorage.getItem('userId')).toBe('test id');
  expect(localStorage.getItem('accessToken')).toBe('test token');
});

test('when sign in fails, alert is displayed', async () => {
  expect.assertions(1);
  server.use(
      rest.post(`${process.env.REACT_APP_API_URL}/users/signin`,
          (req, res, ctx) => {
            return res(
                ctx.status(500),
            );
          }),
  );
  const {container} = renderSignIn();
  userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      'user@email.com',
  );
  userEvent.type(
      screen.getByPlaceholderText(/Password/i),
      'password',
  );
  userEvent.click(container.querySelector('button[type="submit"]'));
  const element = await screen.findByText(/Unable to sign in/i);
  expect(element).toBeInTheDocument();
});

