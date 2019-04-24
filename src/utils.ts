import { getConfig } from './config';
import { handleLogout } from './authentication-reducer';

// Get the XSRF token from the cookies.
const getXSRFToken = (): string =>
  document.cookie.replace(
    /(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  );

/**
 * Calls fetch and makes sure that credentials: 'same-origin' is passed
 * in the options block. Also adds the X-XSRF-TOKEN to the header when a
 * non 'get' request is made.
 *
 * When the request you send returns a 401 the user is automatically
 * logged out in the Redux store.
 *
 * @param {String} url to send the request to
 * @param {Object} options optional object to send with the request
 * @return {Promise} fetch promise
 */
export async function authFetch(
  url: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const { dispatch } = getConfig();

  let headers = options.headers || {};
  if (options.method !== 'get') {
    headers = {
      'X-XSRF-TOKEN': getXSRFToken(),
      ...headers
    };
  }

  const config = {
    ...options,
    credentials: 'same-origin' as RequestCredentials,
    headers
  };

  const response = await fetch(url, config);
  if (response.status === 401) {
    dispatch(handleLogout());
    return response;
  }

  return response;
}
