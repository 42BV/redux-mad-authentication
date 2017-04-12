
import { configureAuthentication, getConfig } from '../src/config';

test('configuration lifecycle', () => {
  // When not initialized it should throw an error.
  expect(() => getConfig()).toThrow('The authentication service is not initialized.');

  // Next we initialize the config.
  const config = {
    handshakeUrl: '/api/handshake',
    authenticationUrl: '/api/authentication',
    currentUserUrl: '/api/authentication/current',
    loginRoute: '/login',
    dispath: jest.fn,
    authenticationStore: () => ({ csrfToken: 'd3add0g' })
  };

  configureAuthentication(config);

  // Now we expect the config to be set.
  expect(getConfig()).toBe(config);
});
