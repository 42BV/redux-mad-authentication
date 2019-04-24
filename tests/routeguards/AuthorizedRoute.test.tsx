import React from 'react';
import { Redirect } from 'react-router-dom';

import { configureAuthentication } from '../../src/config';
import { User } from '../../src/authentication-reducer';
import AuthorizedRoute from '../../src/routeguards/AuthorizedRoute';

function TestComponent() {
  return <h1>Hello World</h1>;
}

interface UserWithRole extends User {
  role: 'ADMIN' | 'SUPERUSER';
}

describe('AuthorizedRoute', () => {
  function setup({ isLoggedIn }: { isLoggedIn: boolean }): void {
    configureAuthentication({
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: '/login',
      dispatch: jest.fn(),
      authenticationStore: () => ({
        isLoggedIn,
        currentUser: { role: 'ADMIN' }
      })
    });
  }

  test('authorized', () => {
    setup({ isLoggedIn: true });

    const route = AuthorizedRoute({
      component: TestComponent,
      exact: true,
      authorizer: authenticationStore => {
        const currentUser = authenticationStore.currentUser as UserWithRole;
        return currentUser.role === 'ADMIN';
      }
    });

    expect(route.props.exact).toBe(true);

    const child = route.props.render();
    expect(child.type).toBe(TestComponent);
  });

  test('not authorized', () => {
    setup({ isLoggedIn: true });

    const route = AuthorizedRoute({
      component: TestComponent,
      authorizer: authenticationStore => {
        const currentUser = authenticationStore.currentUser as UserWithRole;
        return currentUser.role === 'SUPERUSER';
      }
    });

    const child = route.props.render({ location: '/dashboard' });

    expect(child.type).toBe(Redirect);
    expect(child.props.to.pathname).toBe('/login');
    expect(child.props.to.state.from).toBe('/dashboard');
  });

  test('not logged in', () => {
    setup({ isLoggedIn: false });

    const route = AuthorizedRoute({
      component: TestComponent,
      exact: true,
      authorizer: () => false
    });

    const child = route.props.render({ location: '/dashboard' });

    expect(child.type).toBe(Redirect);
    expect(child.props.to.pathname).toBe('/login');
    expect(child.props.to.state.from).toBe('/dashboard');
  });
});
