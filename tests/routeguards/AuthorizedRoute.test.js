
import React from 'react';

import { Redirect } from 'react-router-dom';

import { configureAuthentication } from '../../src/config';

import AuthorizedRoute from '../../src/routeguards/AuthorizedRoute';

describe('AuthorizedRoute', () => {

  function setup({ isLoggedIn }) {
    configureAuthentication({
      handshakeUrl: '/api/handshake',
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: '/login',
      dispatch: jest.fn(),
      authenticationStore: () => ({ isLoggedIn, currentUser: { role: 'ADMIN' } })
    });
  }

  test('authorized', () => {
    setup({ isLoggedIn: true });

    const route = AuthorizedRoute({
      component: TestComponent,
      extra: 'extra-extra-read-all-about-it',
      authorizer: (authenticationStore) => {
        return authenticationStore.currentUser.role === 'ADMIN';
      }
    });

    expect(route.props.extra).toBe('extra-extra-read-all-about-it');

    const child = route.props.render();

    expect(child.type).toBe(TestComponent);;
  });

  test('not authorized', () => {
    setup({ isLoggedIn: true });

    const route = AuthorizedRoute({
      component: TestComponent,
      authorizer: (authenticationStore) => {
        return authenticationStore.currentUser.role === 'SUPERUSER';
      }
    });

    const child = route.props.render({ location: '/dashboard' });

    expect(child.type).toBe(Redirect);
    expect(child.props.to.pathname).toBe('/login');
    expect(child.props.to.state.from).toBe('/dashboard');
  });

  test('not logged in', () => {
    setup({ isLoggedIn: false });

    const route = AuthorizedRoute({ component: TestComponent, extra: 'prop' });

    const child = route.props.render({ location: '/dashboard' });

    expect(child.type).toBe(Redirect);
    expect(child.props.to.pathname).toBe('/login');
    expect(child.props.to.state.from).toBe('/dashboard');
  });
});

function TestComponent() {
  return <h1>Hello World</h1>
}
