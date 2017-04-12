// @flow

import React from 'react';

import { Route, Redirect } from 'react-router-dom';

import { getConfig } from '../config';
import type { Config } from '../config';

import type { AuthenticationStore } from '../authentication-reducer';

type Props = {
  component: any, // Any React Component,
  authorizer: (store: AuthenticationStore) => boolean
};

export default function AuthorizedRoute(props: Props) {
  const { component, authorizer, ...rest } = props;

  const config: Config = getConfig();

  const authenticationStore: AuthenticationStore = config.authenticationStore();

  const isLoggedIn = authenticationStore.isLoggedIn;
  const allowed = isLoggedIn && authorizer(authenticationStore);

  return (
   <Route {...rest} render={props => (
    allowed ? (
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
