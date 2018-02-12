
import { configureAuthentication, getConfig } from '../src/config';

test('configuration lifecycle', () => {
  // When not initialized it should throw an error.
  expect(() => getConfig()).toThrow('The authentication service is not initialized.');

  // Next we initialize the config.
  const config = {
    authenticationUrl: '/api/authentication',
    currentUserUrl: '/api/authentication/current',
    loginRoute: '/login',
    dispath: jest.fn,
    authenticationStore: () => ({ isLoggedIn: false, currentUser: undefined })
  };

  configureAuthentication(config);

  // Now we expect the config to be set.
  expect(getConfig()).toBe(config);
});
