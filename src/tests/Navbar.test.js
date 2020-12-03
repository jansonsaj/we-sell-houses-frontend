import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import Navbar from '../components/Navbar';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';

const server = setupServer(
    rest.get(`${process.env.REACT_APP_API_URL}/messages/summary`,
        (req, res, ctx) => {
          return res(ctx.json({
            unreadMessageCount: 3,
          }));
        }),
);

/**
 * Render Navbar component
 * @param {boolean} signedIn Whether to render as signed in
 * @param {function} setSignedIn Called to change signed in value
 */
function renderNavbar(signedIn, setSignedIn = () => {}) {
  const history = createMemoryHistory();
  render(
      <Router history={history}>
        <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />,
      </Router>,
  );
}

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

test('contains Properties menu item for guests', () => {
  renderNavbar(false);
  const element = screen.getByText(/Properties/i);
  expect(element).toBeInTheDocument();
});

test('contains Properties menu item for users', () => {
  renderNavbar(true);
  const element = screen.getByText(/Properties/i);
  expect(element).toBeInTheDocument();
});

test('contains Sign In menu item for guests', () => {
  renderNavbar(false);
  const element = screen.getByText(/Sign In/i);
  expect(element).toBeInTheDocument();
});

test('contains Sign Out menu item for users', () => {
  renderNavbar(true);
  const element = screen.getByText(/Sign Out/i);
  expect(element).toBeInTheDocument();
});

test('contains Settings menu item for guests', () => {
  renderNavbar(false);
  const element = screen.getByText(/Settings/i);
  expect(element).toBeInTheDocument();
});

test('contains Settings menu item for users', () => {
  renderNavbar(true);
  const element = screen.getByText(/Settings/i);
  expect(element).toBeInTheDocument();
});

test('contains New Property menu item for users', () => {
  renderNavbar(true);
  const element = screen.getByText(/New property/i);
  expect(element).toBeInTheDocument();
});

test('contains Messages menu item for users', () => {
  renderNavbar(true);
  const element = screen.getByText(/Messages/i);
  expect(element).toBeInTheDocument();
});

test('shows 3 unread messages in badge', async () => {
  renderNavbar(true);
  const elements = await screen.findAllByText('3');
  const element = elements.find((e) => e.classList.contains('current'));
  expect(element).toBeInTheDocument();
});

test('when sign out clicked, changes sign in status', async () => {
  expect.assertions(1);
  renderNavbar(true, (isSignedIn) => {
    expect(isSignedIn).toBeFalsy();
  });
  userEvent.click(screen.getByText(/Sign Out/i));
});

test('when sign out clicked, removes local storage', async () => {
  localStorage.setItem('userId', 'test');
  localStorage.setItem('accessToken', 'test');
  renderNavbar(true);
  userEvent.click(screen.getByText(/Sign Out/i));
  expect(localStorage.getItem('userId')).toBeNull();
  expect(localStorage.getItem('accessToken')).toBeNull();
});
