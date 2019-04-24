import { createStore, Store } from 'redux';

import {
  authentication,
  initialState,
  handleLogin,
  handleLogout,
  AuthenticationState,
  AuthenticationActions
} from '../src/authentication-reducer';

describe('Store: AuthenticationStore', () => {
  test('initial state', () => {
    /* 
      TODO: Find the right way to achieve 100% coverage instead
      of adding a ts-ignore.
    */
    // @ts-ignore
    const emptyAction: AuthenticationActions = { type: 'INITIAL' };
    const authenticationStore = authentication(undefined, emptyAction);

    const expected = {
      currentUser: undefined,
      isLoggedIn: false
    };

    expect(authenticationStore).toEqual(expected);
  });

  describe('actions', () => {
    let store: Store<AuthenticationState>;

    beforeEach(() => {
      store = createStore(authentication, initialState);
    });

    test('handleLogin', () => {
      store.dispatch(handleLogin({ username: 'fakeuser' }));

      const state = store.getState();

      expect(state.currentUser).toEqual({ username: 'fakeuser' });
      expect(state.isLoggedIn).toBe(true);
    });

    test('handleLogout', () => {
      store.dispatch(handleLogout());

      const state = store.getState();

      expect(state.currentUser).toEqual(undefined);
      expect(state.isLoggedIn).toBe(false);
    });
  });
});
