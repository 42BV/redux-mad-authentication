// @flow

import { getConfig } from './config';

import { handleLogout } from './authentication-reducer';

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
export function authFetch(url: RequestInfo, options?: RequestOptions = {}): Promise<*> {
  const { dispatch } = getConfig();

  const headers = options.headers || {};
  if (options.method !== 'get') {
    // $FlowFixMe
    headers['X-XSRF-TOKEN'] = getXSRFToken();
  }

  const config = { ...options, credentials: 'same-origin', headers };

  return fetch (url, config).then((response: Response) => {
    if (response.status === 401) {
      dispatch(handleLogout());
      return response;
    } else {
      return response;
    }
  });
}

// Get the XSRF token from the cookies.
function getXSRFToken() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}

