
import { createStore } from 'redux';

import { authentication, initialState, handleLogin, handleLogout, setCsrfToken } from '../src/authentication-reducer';

describe('Store: AuthenticationStore', () => {
  test('initial state', () => {
    const authenticationStore = authentication(undefined, { type: 'FAKE_ACTION' });

    const expected = {
      currentUser: undefined,
      isLoggedIn: false,
      csrfToken: undefined
    };

    expect(authenticationStore).toEqual(expected);
  });

  describe('actions', () => {
    let store;

    beforeEach(() => {
      store = createStore(authentication, initialState);
    });

    test('handleLogin', () => {
      store.dispatch(handleLogin('fakeuser'));

      const state = store.getState();

      expect(state.currentUser).toBe('fakeuser');
      expect(state.isLoggedIn).toBe(true);
    });

    test('handleLogout', () => {
      store.dispatch(handleLogout());

      const state = store.getState();

      expect(state.currentUser).toBe(undefined);
      expect(state.isLoggedIn).toBe(false);
      expect(state.csrfToken).toBe(undefined);
    });

    test('setCsrfToken', () => {
      store.dispatch(setCsrfToken('hoken-token'));

      const state = store.getState();

      expect(state.csrfToken).toBe('hoken-token');
    });
  });
});
