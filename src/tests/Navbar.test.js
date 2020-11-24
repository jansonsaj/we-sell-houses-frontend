import React from 'react';
import {render} from '@testing-library/react';
import Navbar from '../components/Navbar';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';

let container;

beforeEach(() => {
  const history = createMemoryHistory();
  container = render(
      <Router history={history}>
        <Navbar />,
      </Router>,
  );
});

test('contains Home menu item', () => {
  const element = container.getByText(/Home/i);
  expect(element).toBeInTheDocument();
});

test('contains Settings menu item', () => {
  const element = container.getByText(/Settings/i);
  expect(element).toBeInTheDocument();
});
