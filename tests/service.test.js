
import fetchMock from 'fetch-mock';

import { login, current, logout } from '../src/service'

import { configureAuthentication } from '../src/config';

import * as actions from '../src/authentication-reducer';

describe('AuthenticationService', () => {
  let dispatch;
  let authenticationStore;

  beforeEach(() => {
    dispatch = jest.fn();
    authenticationStore = () => ({ csrfToken: 'd3add0g' });

    // Mock the action creators
    actions.setCsrfToken = jest.fn(() => 'setCsrfToken');
    actions.handleLogout = jest.fn(() => 'handleLogout');
    actions.handleLogin = jest.fn(() => 'handleLogin');

    configureAuthentication({
      handshakeUrl: '/api/handshake',
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: '/login',
      dispatch,
      authenticationStore
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('login', () => {
    test('200', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.post('/api/authentication', { fake: 'user' });

      const data = await login({ user: 'Maarten', password: 'netraam' });

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch.mock.calls[0][0]).toBe('setCsrfToken');
      expect(dispatch.mock.calls[1][0]).toBe('handleLogin');
      expect(dispatch.mock.calls[2][0]).toBe('setCsrfToken');

      expect(actions.setCsrfToken).toHaveBeenCalledTimes(2);

      expect(actions.handleLogin).toHaveBeenCalledTimes(1);
      expect(actions.handleLogin).toHaveBeenCalledWith({ fake: 'user' });
    });

    test('500', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.post('/api/authentication', 500);

      try {
        const data = await login({ user: 'Maarten', password: 'netraam' });
        fail();
      } catch(response) {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch.mock.calls[0][0]).toBe('setCsrfToken');

        expect(actions.setCsrfToken).toHaveBeenCalledTimes(1);

        expect(actions.handleLogin).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('current', () => {
    test('200', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.get('/api/authentication/current', { fake: 'current' });

      const data = await current();

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0]).toBe('setCsrfToken');
      expect(dispatch.mock.calls[1][0]).toBe('handleLogin');

      expect(actions.setCsrfToken).toHaveBeenCalledTimes(1);

      expect(actions.handleLogin).toHaveBeenCalledTimes(1);
      expect(actions.handleLogin).toHaveBeenCalledWith({ fake: 'current' });
    });

    test('500', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.get('/api/authentication/current', 500);

      try {
        const data = await current();
        fail();
      } catch(response) {
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch.mock.calls[0][0]).toBe('setCsrfToken');

        expect(actions.setCsrfToken).toHaveBeenCalledTimes(1);
        expect(actions.handleLogin).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('logout', () => {
    test('200', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.delete('/api/authentication', 200);

      const data = await logout();

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('handleLogout');

      expect(actions.handleLogout).toHaveBeenCalledTimes(1);
    });

    test('500', async () => {
      fetchMock.get('/api/handshake', { csrfToken: 'token' });

      fetchMock.delete('/api/authentication', 500);

      try {
        const data = await logout();
        fail();
      } catch(response) {
        expect(response.status).toBe(500);

        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actions.handleLogout).toHaveBeenCalledTimes(0);
      }
    });
  });
});
