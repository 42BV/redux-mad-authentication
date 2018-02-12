// @flow

import { authFetch } from './utils';
import { handleLogin, handleLogout } from './authentication-reducer';

import { getConfig } from './config';

/**
 * Tries to log the user in based on the 'body' parameter.
 *
 * The URL it will send the request to is defined by the 'authenticationUrl'
 * from the Config object. The HTTP method it uses is 'post'.
 *
 * An example of the response:
 *
 * ```JSON
 * { "id": 1, "name": "sjonnyb", "roles": ["ADMIN"] }
 * ```
 *
 * The entire response will be written to the Redux AuthenticationStore's
 * currentUser key. Whatever the JSON response is will be the currentUser.
 *
 * @param {Object} body The body, representing the user, to send in JSON form to the back-end.
 * @returns { Promise } An empty Promise
 */
export function login(body: Object): Promise<*> {
  const { authenticationUrl, dispatch } = getConfig();

  return authFetch(authenticationUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(body)
  })
  .then(tryParse)
  .then((user) => {
    dispatch(handleLogin(user));
  });
}

/**
 * Tries to retrieve the current user from the 'back-end'.
 *
 * The URL it will send the request to is defined by the 'currentUserUrl'
 * from the Config object.
 *
 * An example of the response:
 *
 * ```JSON
 * { "id": 1, "name": "sjonnyb", "roles": ["ADMIN"] }
 * ```
 *
 * The entire response will be written to the Redux AuthenticationStore's
 * currentUser key. Whatever the JSON response is will be the currentUser.
 *
 * @returns { Promise } An empty promise.
 */
export function current(): Promise<*> {
  const { currentUserUrl, dispatch } = getConfig();

  return authFetch(currentUserUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
  .then(tryParse)
  .then((user) => {
    dispatch(handleLogin(user));
  });
}

/**
 * Performs a logout request to the back-end. It expects the
 * back-end to respond with a 200 OK when the logout succeeds.
 *
 * The URL it will send the request to is defined by the 'authenticationUrl'
 * from the Config object. The HTTP method it uses is 'delete'.
 *
 * @returns { Promise } An empty promise.
 */
export function logout() {
  const { authenticationUrl, dispatch } = getConfig();

  return authFetch(authenticationUrl, {
    method: 'delete'
  }).then((response: Response) => {
    if (response.status === 200) {
      dispatch(handleLogout());
    } else {
      throw response;
    }
  });
}

// Throw error when not 200 otherwise parse response.
function tryParse(response: Response) {
  if (response.status !== 200) {
    throw response;
  } else {
    return response.json();
  }
}