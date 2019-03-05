import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

import { getConfig, Config } from '../config';
import { AuthenticationState } from '../authentication-reducer';

export interface Props extends React.ComponentProps<any> {
  component: React.FunctionComponent | React.ComponentClass;
  authorizer: (store: AuthenticationState) => boolean;
}

/**
 * Works just like a regular Route except for when the user is
 * not logged in and a mandatory check for e.g. permissions.
 * If the user is not logged in or does not satisfy the mandatory check it will Redirect
 * the user to the loginRoute as configured in the Config object.
 *
 * @example
 * ``` JavaScript
 *  <AuthorizedRoute path="/"
 *    component={ Dashboard }
 *    authorizer={({ currentUser } => currentUser !== undefined && currentUser.role === 'SUPER_USER' )}
 *  />
 * ```
 *
 * @param props The props for the AuthorizedRoute
 * @returns Either the Component or a Redirect
 */
export default function AuthorizedRoute({ component, authorizer, ...rest }: Props): JSX.Element {
  const config: Config = getConfig();
  const authenticationStore: AuthenticationState = config.authenticationStore();

  const isLoggedIn = authenticationStore.isLoggedIn;
  const allowed = isLoggedIn && authorizer(authenticationStore);

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps & React.ClassAttributes<typeof component>) =>
        allowed ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: config.loginRoute,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
