import { authFetch } from './utils';
import { handleLogin, handleLogout } from './authentication-reducer';
import { getConfig } from './config';

// Throw error when not 200 otherwise parse response.
function tryParse(response: Response): Promise<any> {
  if (response.status !== 200) {
    throw response;
  } else {
    return response.json();
  }
}

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
export async function login(body: object): Promise<void> {
  const { authenticationUrl, dispatch } = getConfig();

  const response = await authFetch(authenticationUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(body),
  });
  const user = await tryParse(response);
  dispatch(handleLogin(user));
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
export async function current(): Promise<void> {
  const { currentUserUrl, dispatch } = getConfig();

  const response = await authFetch(currentUserUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'get',
  });
  const user = await tryParse(response);
  dispatch(handleLogin(user));
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
export async function logout(): Promise<void> {
  const { authenticationUrl, dispatch } = getConfig();

  const response = await authFetch(authenticationUrl, {
    method: 'delete',
  });
  if (response.status === 200) {
    dispatch(handleLogout());
  } else {
    throw response;
  }
}
