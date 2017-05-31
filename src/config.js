// @flow

import type { AuthenticationStore } from './authentication-reducer';

import type { Action } from './authentication-reducer';

export type Config = {
  // The URL to do a GET request to for a handshake.
  handshakeUrl: string,

  // The URL to POST login request and DELETE logout request.
  authenticationUrl: string,

  // The URL to GET retrieve the current user from.
  currentUserUrl: string,

  /*
    The location to redirect the user to when the user is not logged in.
    Used by PrivateRoute and AuthorizedRoute.
  */
  loginRoute: string,

  // The dispatch function for the Redux store.
  dispatch: (Action) => void,

  // A function which returns the latests AuthenticationStore from Redux.
  authenticationStore: () => AuthenticationStore
};

let config: Config | null = null;

/**
 * Configures the Authentication libary.
 *
 * @param {Config} The new configuration
 */
export function configureAuthentication(c: Config) {
  config = c;
}

/**
 * Either returns the a Config or throws an error when the
 * config is not yet initialized.
 *
 * @returns The Config
 */
export function getConfig(): Config {
  if (config === null) {
    throw new Error('The authentication service is not initialized.');
  } else {
    return config;
  }
}
