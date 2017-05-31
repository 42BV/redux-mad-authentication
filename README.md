# About

[![Build Status](https://travis-ci.org/42BV/redux-mad-authentication.svg?branch=master)](https://travis-ci.org/42BV/redux-mad-authentication)
[![Codecov](https://codecov.io/gh/42BV/redux-mad-authentication/branch/master/graph/badge.svg)](https://codecov.io/gh/42BV/redux-mad-authentication)

This is 42's authentication module for Redux in combination with
a specific Spring Security settings.

It can do the following things:

  1. Log the user in and out with your Spring application.
  2. Saving the current user in the Redux store.
  3. Send 'fetch' request with XSRF tokens and the cookies.
  4. Make a route only available for logged in users.
  5. Make a route available for specific users, based on properties
     of the current user.

# Getting started.

We assume you have a working Redux project, if you do not yet have
Redux add Redux to your project by following the Redux's instructions.

First install the following dependencies in the package.json:

  1. "react-redux": "5.0.3",
  2. "redux": "3.6.0",
  3. "react-router-dom": "4.0.0"

Now add the authentication-reducer to your rootReducer for example:

```JavaScript
// @flow

import { combineReducers } from 'redux';

import type { AuthenticationStore } from '../authentication/authentication-reducer';
import { authentication } from '../authentication/authentication-reducer';

export type Store = {
  authentication: AuthenticationStore
};

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Store = combineReducers({
  authentication,
});

export default rootReducer;
```

This should add the AuthenticationStore to Redux, which will store
the logged in user.

Next you have to configure the authentication module:

```JavaScript
import { createStore } from 'redux';
import { configureAuthentication } from './authentication';

export const store = createStore(
  rootReducer,
);

configureAuthentication({
  // The URL of your Spring back-end where the handshake endpoint lives
  handshakeUrl: '/api/authentication/handshake',

  // The URL of your Spring back-end where the user can login (POST) and logout(DELETE)
  authenticationUrl: '/api/authentication',

  // The URL of your Spring back-end where the current user can be requested via GET
  currentUserUrl: '/api/authentication/current',

  // The route (in the front-end) the user should be redirected to when not logged in.
  loginRoute: '/login',

  // A reference to the dispatch function for the react store.
  dispatch: store.dispatch,

  // A function which returns the current 'authentication' store 
  authenticationStore: () => store.getState().authentication
});
```

The authentication module must be configured before the application
is rendered.

# How to

## Writing a LoginForm.

In order to log the user in you must have a login form of some sorts.
This library does not assume anything on how this login form should
work or what it looks like.

Here's what a LoginForm should do:

  1. Call 'login' when the user submits the login form, with the correct body.
  2. Try to auto-login the user via `current` in the componentDidMount.
  3. In the `render` Redirect the user when he is logged in.

For example:

```JavaScript
// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, locationShape } from 'react-router-dom';

import { login, current } from './authentication';

import type { Store } from '../redux/root-reducer';

type Props = {
  loggedIn: boolean,
  location: locationShape
};

type State = {
  username: string,
  password: string,
  error: boolean,
  autoLoginFailed: boolean
};

export class Login extends Component<void, Props, State> {

  state = {
    username: '',
    password: '',
    error: false,
    autoLoginFailed: false
  };

  // Calling `current()` automatically logs the user in when the session is still valid
  componentDidMount() {
    current().catch(() => {
      this.setState({ autoLoginFailed: true });
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const { username, password } = this.state;

    this.setState({ error: false });

    // `login` expects a body to send to the server
    login({  username, password }).catch((error) => {
      this.setState({ error: true });
    });
  }

  setUsername(username: string) {
    this.setState({ username });
  }

  setPassword(password: string) {
    this.setState({ password });
  }

  render() {
    // Be sure 
    if (this.props.loggedIn) {
      const { from } = this.props.location.state || { from: { pathname: '/' } };

      return <Redirect to={ from }/>;
    }

    if (this.state.autoLoginFailed === false) {
      return null;
    }

    const { username, password, error } = this.state;

    const errorMessage = error ? 'Username and password are incorrect' : '';

    return (
      <form>
        <h1>Please log in</h1>
        <p>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={ username }
            onChange={ (event) => this.setUsername(event.target.value) }
          />
        </p>

        <p>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={ password }
            onChange={ (event) => this.setPassword(event.target.value) }
          />
        </p>

        <p>{ errorMessage }</p>

        <button type="sumbit" onClick={ (event) => this.onSubmit(event) }>Log in</button>
      </form>
    );
  }
}

export default connect((store: Store) => {
  return {
    loggedIn: store.authentication.isLoggedIn
  };
})(Login);
```

## Writing a Logout

In order to logout you must call the 'logout' function, and make
sure you Redirect the user to the login form when the user is
logged in.

For example:

```JavaScript
// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import type { Store } from '.redux/root-reducer';

import { logout } from './authentication';

type Props = {,
  isLoggedIn: boolean
};

export class Logout extends Component<void, Props, void> {

  onLogoutClick() {
    logout();
  }

  render() {
    if (this.props.isLoggedIn === false) {
      return <Redirect to="/"/>;
    }

    return (
      <a onClick={ () => this.onLogoutClick() }>Uitloggen</a>
    );
  }
}

export default connect((store: Store) => {
  return {
    isLoggedIn: store.authentication.isLoggedIn
  };
})(Logout);
```

## Make a Route private

Some routes can only be accessible when the user is logged in.
You can do this via the PrivateRoute for example:

```JavaScript
<BrowserRouter history={ browserHistory }>
  <div>
    <Route exact path="/" component={ Dashboard } />
    <Route path="/login" component={ Login }/>
    <PrivateRoute path="/users" component={ Users } />
  </div>
</BrowserRouter>
```

PrivateRoute works exacly like Route, except that it does not
support a `render` method. You must always provide a Component
instead.

When the user tries to go to a PrivateRoute he will be redirected
to the Config's route `loginRoute`.

## Add authorization to a Route

Some routes can only be accessed by a type of user or a specific
user. You can do this via the AuthorizedRoute.

```JavaScript
<BrowserRouter history={ browserHistory }>
  <div>
    <Route exact path="/" component={ Dashboard } />
    <Route path="/login" component={ Login }/>
    <PrivateRoute path="/users" component={ Users } />
    <AuthorizedRoute 
      path="/pictures" 
      component={ Pictures }
      authorizer={ (authenticationStore: AuthenticationStore) => {
        return authenticationStore.currentUser.role === 'ADMIN';
      }}
    />
  </div>
</BrowserRouter>
```

The authorizer function is only ran if the user is logged in.
The authorizer is given the authenticationStore as the first
parameter, and is expected to return a boolean.

AuthorizedRoute works exacly like Route, except that it does not
support a `render` method. You must always provide a Component
instead.

When the user tries to go to a AuthorizedRoute he will be redirected
to the Config's route `loginRoute`.

## Get the current user's info / login status

Lets say you have a component which must render the current user's
name, you will then need the current user from the Redux store.

We can use react-redux's connect to achieve this.

For example:

```JavaScript

function User(props) {
  if (isLoggedIn) {
    return <h1>Hi {{ props.currentUser.name }}</h1>
  } else {
    return <h1>Please log in</h1>
  }
}

export default connect((store: Store) => {
  return {
    isLoggedIn: store.authentication.isLoggedIn,
    currentUser: store.authentication.currentUser
  };
})(User);

```

## Send a request with the CSRF token as the current user.

To perform request with the CSRF token and with the cookies from
the current user. You can use the 'authFetch' utility from this
library:

```JavaScript

import 'authFetch' from './authentication'

function getUser() {
  authFetch('/user/1').then((response) => {
    console.log(response);
  });
}

```

`authFetch` is a thin wrapper around `fetch`, it only adds the
credentials and CSRF token, so it has the exact same arguments
as `fetch`.
