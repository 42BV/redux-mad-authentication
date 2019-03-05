import fetchMock from 'fetch-mock';

import { login, current, logout } from '../src/service';
import { configureAuthentication } from '../src/config';
import * as actions from '../src/authentication-reducer';

describe('AuthenticationService', () => {
  let dispatch: jest.Mock<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();

    // Mock the action creators
    // @ts-ignore
    actions.handleLogout = jest.fn(() => 'handleLogout');

    // @ts-ignore
    actions.handleLogin = jest.fn(() => 'handleLogin');

    configureAuthentication({
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: '/login',
      dispatch,
      authenticationStore: () => ({ isLoggedIn: false, currentUser: undefined }),
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('login', () => {
    test('200', async () => {
      fetchMock.post('/api/authentication', { fake: 'user' });

      await login({ user: 'Maarten', password: 'netraam' });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('handleLogin');

      expect(actions.handleLogin).toHaveBeenCalledTimes(1);
      expect(actions.handleLogin).toHaveBeenCalledWith({ fake: 'user' });
    });

    test('500', async () => {
      fetchMock.post('/api/authentication', 500);

      try {
        await login({ user: 'Maarten', password: 'netraam' });
        fail();
      } catch (response) {
        expect(actions.handleLogin).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('current', () => {
    test('200', async () => {
      fetchMock.get('/api/authentication/current', { fake: 'current' });
      await current();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('handleLogin');

      expect(actions.handleLogin).toHaveBeenCalledTimes(1);
      expect(actions.handleLogin).toHaveBeenCalledWith({ fake: 'current' });
    });

    test('500', async () => {
      fetchMock.get('/api/authentication/current', 500);

      try {
        await current();
        fail();
      } catch (response) {
        expect(actions.handleLogin).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('logout', () => {
    test('200', async () => {
      fetchMock.delete('/api/authentication', 200);

      await logout();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('handleLogout');

      expect(actions.handleLogout).toHaveBeenCalledTimes(1);
    });

    test('500', async () => {
      fetchMock.delete('/api/authentication', 500);

      try {
        await logout();
        fail();
      } catch (response) {
        expect(response.status).toBe(500);

        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actions.handleLogout).toHaveBeenCalledTimes(0);
      }
    });
  });
});
