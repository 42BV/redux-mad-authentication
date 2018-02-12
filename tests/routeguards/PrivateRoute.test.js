
import React from 'react';

import { Redirect } from 'react-router-dom';

import { configureAuthentication } from '../../src/config';

import PrivateRoute from '../../src/routeguards/PrivateRoute';

describe('PrivateRoute', () => {

  function setup({ isLoggedIn }) {
    configureAuthentication({
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: '/login',
      dispatch: jest.fn(),
      authenticationStore: () => ({ isLoggedIn, currentUser: undefined })
    });
  }

  test('loggedIn', () => {
    setup({ isLoggedIn: true });

    const route = PrivateRoute({ component: TestComponent, extra: 'extra-extra-read-all-about-it' });

    expect(route.props.extra).toBe('extra-extra-read-all-about-it');

    const child = route.props.render();

    expect(child.type).toBe(TestComponent);;
  });

  test('not logged in', () => {
    setup({ isLoggedIn: false });

    const route = PrivateRoute({ component: TestComponent, extra: 'prop' });

    const child = route.props.render({ location: '/dashboard' });

    expect(child.type).toBe(Redirect);
    expect(child.props.to.pathname).toBe('/login');
    expect(child.props.to.state.from).toBe('/dashboard');
  });
});

function TestComponent() {
  return <h1>Hello World</h1>
}
