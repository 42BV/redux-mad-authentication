import fetchMock from 'fetch-mock';

import { authFetch } from '../src/utils';
import { configureAuthentication } from '../src/config';
import * as actions from '../src/authentication-reducer';

describe('authFetch', () => {
  let dispatch: jest.Mock<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();

    // @ts-ignore
    actions.handleLogout = jest.fn(() => 'handleLogout');

    configureAuthentication({
      authenticationUrl: '/api/authentication',
      currentUserUrl: '/api/authentication/current',
      loginRoute: 'login',
      dispatch,
      authenticationStore: () => ({ isLoggedIn: false, currentUser: {} })
    });

    document.cookie = 'XSRF-TOKEN=d3add0g';
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('headers', () => {
    test('without CSRF token', async () => {
      fetchMock.get(
        '/api/GET',
        { fake: 'fake' },
        {
          // @ts-ignore
          credentials: 'same-origin'
        }
      );

      const data = await authFetch('/api/GET');

      const json = await data.json();

      expect(json).toEqual({ fake: 'fake' });

      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    test('with CSRF token', async () => {
      fetchMock.post(
        '/api/POST',
        { fake: 'fake' },
        {
          // @ts-ignore
          credentials: 'same-origin',
          headers: { 'X-XSRF-TOKEN': 'd3add0g' }
        }
      );

      const data = await authFetch('/api/POST', {
        method: 'post'
      });

      const json = await data.json();

      expect(json).toEqual({ fake: 'fake' });
      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    test('with user headers', async () => {
      fetchMock.post(
        '/api/POST',
        { fake: 'fake' },
        {
          // @ts-ignore
          credentials: 'same-origin',
          headers: { 'X-XSRF-TOKEN': 'd3add0g', 'X-AWESOME': '42' }
        }
      );

      const data = await authFetch('/api/POST', {
        method: 'post',
        headers: { 'X-AWESOME': '42' }
      });

      const json = await data.json();

      expect(json).toEqual({ fake: 'fake' });
      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });

  test('401 error handling', async () => {
    fetchMock.get(
      '/api/GET',
      {
        status: 401,
        body: '{ "fake": "fake" }'
      },
      {
        // @ts-ignore
        credentials: 'same-origin'
      }
    );

    const data = await authFetch('/api/GET', { method: 'get' });
    const json = await data.json();

    expect(json).toEqual({ fake: 'fake' });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(actions.handleLogout).toHaveBeenCalledTimes(1);
  });
});
