// @flow

import React from 'react';

import { Route, Redirect } from 'react-router-dom';

import { getConfig } from '../config';
import type { Config } from '../config';

import type { AuthenticationStore } from '../authentication-reducer';

type Props = {
  component: any // Any React Component
};

/**
 * Works just like a regular Route except for when the user is
 * not logged in. If the user is not logged in it will Redirect
 * the user to the loginRoute as configured in the Config object.
 *
 * @example
 * ``` JavaScript
 *  <PrivateRoute path="/" component={ Dashboard }/>
 * ```
 *
 * @param {Props} The props for the PrivateRoute
 * @returns Either the Component or a Redirect
 */
export default function PrivateRoute(props: Props) {
  const { component, ...rest } = props;

  const config: Config = getConfig();

  const authenticationStore: AuthenticationStore = config.authenticationStore();

  const isLoggedIn = authenticationStore.isLoggedIn;

  return (
   <Route {...rest} render={props => (
    isLoggedIn ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: config.loginRoute,
        state: { from: props.location }
      }}/>
    )
  )}/>
  );
}
